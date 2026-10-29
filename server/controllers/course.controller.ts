import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import cloudinary from "cloudinary";
import { createCourse, getAllCoursesService } from "../services/course.service";
import courseModel from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import ejs from "ejs"
import path from "path";
import sendMail from "../utils/sendEmail";
import notificationModel from "../models/notification.model";
import axios from "axios";

// upload course
export const uploadCourse = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;

        const thumbnail = data.thumbnail;
        
        if(thumbnail) {
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses",
            })

            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        }

        createCourse(data, res, next);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// edit course
export const editCourse = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;

        const thumbnail = data.thumbnail;

        const courseId = req.params.id;

        const courseData = await courseModel.findById(courseId) as any;
        
        if(thumbnail && !thumbnail.startsWith("https")) {
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses",
            })

            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        } else if(thumbnail && thumbnail.startsWith("https")) {
            data.thumbnail = {
                public_id: courseData?.thumbnail.public_id,
                url: courseData?.thumbnail.url
            }
        }

        const course = await courseModel.findByIdAndUpdate(
            courseId, 
            {
                $set: data
            },
            {
                new: true
            }
        );

        await redis.del(courseId);

        res.status(201).json({
            success: true,
            course
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// get single course (without purchasing)
export const getSingleCourse = catchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = req.params.id;

        const isCashExist = await redis.get(courseId);

        if(isCashExist) {
            const course = JSON.parse(isCashExist);
            res.status(200).json({
                success: true,
                course
            });
        } else {
            const course = await courseModel.findById(req.params.id).select("-courseData.videoUrl -courseData.suggetion -courseData.questions -courseData.links").populate("teachers enrolled");

            await redis.set(courseId, JSON.stringify(course), "EX", 604800); // expire in 7 days

            res.status(201).json({
                success: true,
                course
            });
        };
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// get all course (without purchasing)
export const getAllCourses = catchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const courses = await courseModel.find({ status: "active" }).select("-courseData.videoUrl -courseData.suggetion -courseData.questions -courseData.links");
        res.status(200).json({
            success: true,
            courses
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// get course content (only for valid user)
export const getCourseContent = catchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;
        const isStaff = req.user?.role === "superadmin" || req.user?.role === "admin" || req.user?.role === "moderator" || req.user?.role === "teacher";
        const isCourseExist = userCourseList?.find((course: any) => (course.courseId || course._id).toString() === courseId) || isStaff;

        if(!isCourseExist) {
            return next(new ErrorHandler("You are not eligible to access this course", 400));
        }

        const course = await courseModel.findById(courseId);

        const content = course?.courseData;

        res.status(201).json({
            success: true,
            content
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// add question in course
interface IAddQuestionData {
    question: string;
    courseId: string;
    contentId: string;
}

export const addQuestion = catchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { question, courseId, contentId }: IAddQuestionData = req.body;

        const course = await courseModel.findById(courseId);

        if(!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid content id", 400));
        };

        const courseContent = course?.courseData?.find((item: any) => item._id.equals(contentId));

        if(!courseContent) {
            return next(new ErrorHandler("Invalid content id", 400));
        };

        // create a new qs object
        const newQuestion: any = {
            user: req.user,
            question,
            questionReplies: []
        }

        // add this qs in course content
        courseContent.questions.push(newQuestion);

        await notificationModel.create({
            user: req.user?._id,
            title: "New Question Received",
            message: `you have a new question in ${courseContent.title}`
        });

        // save updated course
        await course?.save();

        res.status(200).json({
            success: true,
            course
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// add ans in course qs
interface IAddAnswerData {
    answer: string;
    courseId: string;
    contentId: string;
    questionId: string;
}

export const addAnswer = catchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { answer, courseId, contentId, questionId }: IAddAnswerData = req.body;

        const course = await courseModel.findById(courseId);

        if(!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid content id", 400));
        };

        const courseContent = course?.courseData?.find((item: any) => item._id.equals(contentId));

        if(!courseContent) {
            return next(new ErrorHandler("Invalid content id", 400));
        };

        // search qs
        const question = courseContent?.questions?.find((item: any) => item._id.equals(questionId));

        if(!question) {
            return next(new ErrorHandler("Invalid question id", 400));
        };

        // create a new qs object
        const newAnswer: any = {
            user: req.user,
            answer,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        // add this qs in course content
        question.questionReplies.push(newAnswer);

        // save updated course
        await course?.save();

        if(req.user?._id === question.user._id) {
            await notificationModel.create({
                user: req.user?._id,
                title: "New Question Reply Received",
                message: `you have a new question reply in ${courseContent.title}`
            });
        } else {
            const data = {
                name: question.user.name,
                title: courseContent.title
            }
            const html = await ejs.renderFile(path.join(__dirname, "../mails/questionReply.ejs"), data);

            try {
                await sendMail({
                    email: question.user.email,
                    subject: "Question Reply",
                    template: "questionReply.ejs",
                    data
                })
            } catch (error: any) {
                return next(new ErrorHandler(error.message, 500));
            }
        }

        res.status(200).json({
            success: true,
            course
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// edit question
interface IEditQuestionData {
    question: string;
    courseId: string;
    contentId: string;
    questionId: string;
}

export const editQuestion = catchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { question, courseId, contentId, questionId }: IEditQuestionData = req.body;

        const course = await courseModel.findById(courseId);

        if(!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid content id", 400));
        };

        const courseContent = course?.courseData?.find((item: any) => item._id.equals(contentId));

        if(!courseContent) {
            return next(new ErrorHandler("Invalid content id", 400));
        };

        const existingQuestion = courseContent?.questions?.find((item: any) => item._id.equals(questionId));

        if(!existingQuestion) {
            return next(new ErrorHandler("Invalid question id", 400));
        };

        if(existingQuestion.user._id.toString() !== req.user?._id.toString()) {
            return next(new ErrorHandler("You can only edit your own question", 403));
        };

        existingQuestion.question = question;

        await course?.save();

        res.status(200).json({
            success: true,
            course
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// delete question
export const deleteQuestion = catchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, contentId, questionId } = req.params;

        const course = await courseModel.findById(courseId);

        if(!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid content id", 400));
        };

        const courseContent = course?.courseData?.find((item: any) => item._id.equals(contentId));

        if(!courseContent) {
            return next(new ErrorHandler("Invalid content id", 400));
        };

        const questionIndex = courseContent?.questions?.findIndex((item: any) => item._id.equals(questionId));

        if(questionIndex === -1 || questionIndex === undefined) {
            return next(new ErrorHandler("Invalid question id", 400));
        };

        const question = courseContent.questions[questionIndex];
        const isOwner = question.user._id.toString() === req.user?._id.toString();
        const isStaff = req.user?.role === "superadmin" || req.user?.role === "admin" || req.user?.role === "moderator";

        if(!isOwner && !isStaff) {
            return next(new ErrorHandler("You are not authorized to delete this question", 403));
        };

        courseContent.questions.splice(questionIndex, 1);

        await course?.save();

        res.status(200).json({
            success: true,
            course
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// edit answer
interface IEditAnswerData {
    answer: string;
    courseId: string;
    contentId: string;
    questionId: string;
    answerId: string;
}

export const editAnswer = catchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { answer, courseId, contentId, questionId, answerId }: IEditAnswerData = req.body;

        const course = await courseModel.findById(courseId);

        if(!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid content id", 400));
        };

        const courseContent = course?.courseData?.find((item: any) => item._id.equals(contentId));

        if(!courseContent) {
            return next(new ErrorHandler("Invalid content id", 400));
        };

        const question = courseContent?.questions?.find((item: any) => item._id.equals(questionId));

        if(!question) {
            return next(new ErrorHandler("Invalid question id", 400));
        };

        const existingAnswer = question.questionReplies?.find((item: any) => item._id.equals(answerId));

        if(!existingAnswer) {
            return next(new ErrorHandler("Invalid answer id", 400));
        };

        if(existingAnswer.user._id.toString() !== req.user?._id.toString()) {
            return next(new ErrorHandler("You can only edit your own answer", 403));
        };

        existingAnswer.answer = answer;

        await course?.save();

        res.status(200).json({
            success: true,
            course
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// delete answer
export const deleteAnswer = catchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, contentId, questionId, answerId } = req.params;

        const course = await courseModel.findById(courseId);

        if(!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid content id", 400));
        };

        const courseContent = course?.courseData?.find((item: any) => item._id.equals(contentId));

        if(!courseContent) {
            return next(new ErrorHandler("Invalid content id", 400));
        };

        const question = courseContent?.questions?.find((item: any) => item._id.equals(questionId));

        if(!question) {
            return next(new ErrorHandler("Invalid question id", 400));
        };

        const answerIndex = question.questionReplies?.findIndex((item: any) => item._id.equals(answerId));

        if(answerIndex === -1 || answerIndex === undefined) {
            return next(new ErrorHandler("Invalid answer id", 400));
        };

        const reply = question.questionReplies[answerIndex];
        const isOwner = reply.user._id.toString() === req.user?._id.toString();
        const isStaff = req.user?.role === "superadmin" || req.user?.role === "admin" || req.user?.role === "moderator";

        if(!isOwner && !isStaff) {
            return next(new ErrorHandler("You are not authorized to delete this answer", 403));
        };

        question.questionReplies.splice(answerIndex, 1);

        await course?.save();

        res.status(200).json({
            success: true,
            course
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// add review
interface IAddReviewData {
    review: string;
    rating: number;
    userId: string;
}

export const addReview = catchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;
        const isStaff = req.user?.role === "superadmin" || req.user?.role === "admin" || req.user?.role === "moderator" || req.user?.role === "teacher";
        // check if courseId already exists in userCourseList
        const isCourseExists = userCourseList?.some((course: any) => (course.courseId || course._id).toString() === courseId.toString()) || isStaff;

        if(!isCourseExists) {
            return next(new ErrorHandler("You are not eligible to access this course.", 400));
        }

        const course = await courseModel.findById(courseId);

        const { review, rating } = req.body as IAddReviewData;

        const reviewData: any = {
            user: req.user,
            connect: review,
            rating
        }

        course?.reviews.push(reviewData);

        let avg = 0;

        course?.reviews.forEach((rev: any) => {
            avg += rev.rating;
        });

        if(course) {
            course.ratings = avg / course.reviews.length;
        }

        await course?.save();

        await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7 days

        const notification = {
            title: "New review received.",
            message: `${req.user?.name} has given a review in ${course?.name}.`
        }

        await notificationModel.create({
            user: req.user?._id,
            title: "New Question Received",
            message: `you have a new review in ${course?.title}`
        });

        res.status(200).json({
            success: true,
            course
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// add reply to review (admin only)
interface IAddReviewReplyData {
    comment: string;
    courseId: string;
    reviewId: string;
}

export const addReviewReply = catchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { comment, courseId, reviewId } = req.body as IAddReviewReplyData;

        const course = await courseModel.findById(courseId);

        if(!course) {
            return next(new ErrorHandler("Course not found.", 400));
        };

        const review = course?.reviews?.find((rev: any) => rev._id.toString() === reviewId.toString());

        if(!review) {
            return next(new ErrorHandler("Review not found.", 400));
        };

        const replyData: any = {
            user: req.user,
            comment,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        if (!review.commentReplies) {
            review.commentReplies = [];
        }

        review.commentReplies?.push(replyData);

        await course?.save();

        await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7 days

        res.status(200).json({
            success: true,
            course
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// get all courses (admin only)
export const getAllCourses_Admin = catchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        getAllCoursesService(res);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// update course status (admin only)
export const updateCourseStatus = catchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["pending", "active", "disabled"].includes(status)) {
            return next(new ErrorHandler("Invalid status value.", 400));
        }

        const course = await courseModel.findById(id);

        if (!course) {
            return next(new ErrorHandler("Course not found.", 404));
        }

        if (course.status === "drafting") {
            return next(new ErrorHandler("Drafting courses cannot have their status updated directly. Edit and publish the course instead.", 400));
        }

        course.status = status;
        await course.save();

        await redis.del(id);

        res.status(200).json({
            success: true,
            course
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// delete course (admin only)
export const deleteCourse = catchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const course = await courseModel.findById(id);

        if(!course) {
            return next(new ErrorHandler("Course not found.", 400));
        } else {
            await course.deleteOne({ id })
            await redis.del(id)
        }

        res.status(201).json({
            success: true,
            message: "Course deleted successfully!"
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// generate video url
export const generateVideoUrl = catchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { videoId } = req.body;

        const response = await axios.post(
            `https://dev.vdocipher.com/api/videos/${videoId}/opt`,
            { ttl: 300 },
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Apisecret ${process.env.VDOCIPHER_API_KEY}`
                }
            }
        );

        res.json(response.data);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// send message to live course (admin/moderator/teacher only)
export const sendCourseMessage = catchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { text, voice, image, video } = req.body;
        const courseId = req.params.id;

        const course = await courseModel.findById(courseId);

        if(!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        if (course.subCategory !== "Live") {
            return next(new ErrorHandler("Messaging is only available for live courses", 400));
        }

        const newMessage: any = {
            adminId: req.user?._id,
            adminName: req.user?.name,
            createdAt: new Date()
        };

        if (text) {
            newMessage.text = text;
        }

        if (image) {
            const myCloud = await cloudinary.v2.uploader.upload(image, {
                folder: "course_messages_images",
            });
            newMessage.image = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            };
        }

        if (video) {
            const myCloud = await cloudinary.v2.uploader.upload(video, {
                resource_type: "video",
                folder: "course_messages_videos",
            });
            newMessage.video = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            };
        }

        if (voice) {
            const myCloud = await cloudinary.v2.uploader.upload(voice, {
                resource_type: "video",
                folder: "course_messages_voice",
            });
            newMessage.voice = myCloud.secure_url;
        }

        if (!text && !image && !video && !voice) {
            return next(new ErrorHandler("Message content is required", 400));
        }

        course.messages.push(newMessage);
        await course.save();

        await redis.del(courseId);

        // Socket.IO real-time update
        const { getIO } = require("../socketServer");
        const io = getIO();
        if (io) {
            io.emit("newCourseMessage", { courseId });
        }

        res.status(200).json({
            success: true,
            course
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// delete course message (admin only)
export const deleteCourseMessage = catchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, messageId } = req.params;
        const course = await courseModel.findById(id);

        if(!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        const msg = course.messages.find((msg: any) => msg._id.toString() === messageId);
        if (!msg) {
            return next(new ErrorHandler("Message not found", 404));
        }
        if (msg.adminId !== req.user?._id.toString()) {
            return next(new ErrorHandler("You can only delete your own messages", 403));
        }

        course.messages = course.messages.filter((m: any) => m._id.toString() !== messageId);
        await course.save();

        await redis.del(id);

        const { getIO } = require("../socketServer");
        const io = getIO();
        if (io) {
            io.emit("newCourseMessage", { courseId: id });
        }

        res.status(200).json({
            success: true,
            course
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// edit course message (admin only)
export const editCourseMessage = catchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, messageId } = req.params;
        const { text } = req.body;
        const course = await courseModel.findById(id);

        if(!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        const message = course.messages.find((msg: any) => msg._id.toString() === messageId);
        if(!message) {
            return next(new ErrorHandler("Message not found", 404));
        }

        if (message.adminId !== req.user?._id.toString()) {
            return next(new ErrorHandler("You can only edit your own messages", 403));
        }

        message.text = text;
        await course.save();

        await redis.del(id);

        const { getIO } = require("../socketServer");
        const io = getIO();
        if (io) {
            io.emit("newCourseMessage", { courseId: id });
        }

        res.status(200).json({
            success: true,
            course
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});