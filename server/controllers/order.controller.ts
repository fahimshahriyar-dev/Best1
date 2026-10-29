import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import courseModel from "../models/course.model";
import ebookModel from "../models/ebook.model";
import ejs from "ejs"
import path from "path";
import sendMail from "../utils/sendEmail";
import { IOrder } from "../models/order.model";
import userModel from "../models/user.model";
import { getAllOrdersService, newOrder } from "../services/order.service";
import notificationModel from "../models/notification.model";
import { redis } from "../utils/redis";
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// create order
export const createOrder = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, ebookId, payment_info, enrollmentData } = req.body as any;

        if (payment_info && "id" in payment_info) {
            const paymentIntentId = payment_info.id;
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
            if (paymentIntent.status !== "succeeded") {
                return next(new ErrorHandler("Payment not authorized!", 400));
            }
        }

        const user = await userModel.findById(req.user?._id);

        let data: any = {
            userId: user?._id,
            payment_info,
            enrollmentData
        };

        let mailData: any;
        let itemName = "";

        if (courseId) {
            const isCourseAlreadyPurched = user?.courses.some((course: any) => course.courseId?.toString() === courseId);
            if (isCourseAlreadyPurched) {
                return next(new ErrorHandler("You have already purchased this course.", 400));
            }

            const course = await courseModel.findById(courseId);
            if (!course) {
                return next(new ErrorHandler("Course not found.", 400));
            }

            if (course.subCategory === "Live" && course.maxStudents && course.enrolled && course.enrolled.length >= course.maxStudents) {
                return next(new ErrorHandler("Course is full. Maximum student limit reached.", 400));
            }

            data.courseId = course._id;
            itemName = course.name;

            mailData = {
                order: {
                    _id: String(course._id).slice(0, 6),
                    name: course.name,
                    price: course.price,
                    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'})
                }
            };

            user?.courses.push({
                courseId: String(course?._id),
                courseType: course?.courseType,
                categories: course?.categories,
                subCategories: course?.subCategory || "Recorded"
            });
            if (course.subCategory === "Live") {
                course.enrolled.push(user?._id);
            }
            course.purchased ? course.purchased += 1 : course.purchased = 1;
            await course.save();
        } else if (ebookId) {
            const isEbookAlreadyPurchased = user?.ebooks.some((ebook: any) => ebook.ebookId === ebookId);
            if (isEbookAlreadyPurchased) {
                return next(new ErrorHandler("You have already purchased this e-book.", 400));
            }

            const ebook = await ebookModel.findById(ebookId);
            if (!ebook) {
                return next(new ErrorHandler("E-book not found.", 400));
            }

            data.ebookId = ebook._id;
            itemName = ebook.name;

            mailData = {
                order: {
                    _id: String(ebook._id).slice(0, 6),
                    name: ebook.name,
                    price: ebook.price,
                    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'})
                }
            };

            user?.ebooks.push({ ebookId: String(ebook._id) });
            ebook.purchased ? ebook.purchased += 1 : ebook.purchased = 1;
            await ebook.save();
        } else {
            return next(new ErrorHandler("No product provided for purchase.", 400));
        }

        const html = await ejs.renderFile(path.join(__dirname, "../mails/orderConfirmation.ejs"), {order: mailData});

        try {
            if (user) {
                await sendMail({
                    email: user.email,
                    subject: "Order Confirmation",
                    template: "orderConfirmation.ejs",
                    data: mailData
                });
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }

        await redis.set(req.user?._id, JSON.stringify(user));
        await user?.save();

        await notificationModel.create({
            user: user?._id,
            title: "New Order",
            message: `You have a new order for ${itemName}`
        });

        newOrder(data, res, next);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// get all orders (admin only)
export const getAllOrders = catchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        getAllOrdersService(res);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// send stripe publishble key
export const sendStripePublishableKey = catchAsyncError(async (req: Request, res: Response) => {
    res.status(200).json({
        publishablekey: process.env.STRIPE_PUBLISHABLE_KEY
    });
});

// new payment
export const newPayment = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const myPayment = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: "USD",
            metadata: {
                company: "E-Learning",
            },
            automatic_payment_methods: {
                enabled: true,
            }
    });

    res.status(201).json({
        success: true,
        client_secret: myPayment.client_secret
    });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});
