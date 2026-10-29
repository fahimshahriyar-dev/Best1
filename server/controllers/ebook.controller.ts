import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import cloudinary from "cloudinary";
import ebookModel, { IEbook } from "../models/ebook.model";
import { redis } from "../utils/redis";
import { createEbookService, getAllEbooksService } from "../services/ebook.service";
import mongoose from "mongoose";

// upload ebook (admin)
export const uploadEbook = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const { thumbnail, pdf } = data;
        
        if (thumbnail) {
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "ebooks",
            });

            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }

        if (pdf) {
            const myCloud = await cloudinary.v2.uploader.upload(pdf, {
                folder: "ebook_pdfs",
                resource_type: "raw",
                public_id: `ebook_${Date.now()}.pdf`
            });

            data.pdfFile = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }

        await redis.del("allEbooks");

        createEbookService(data, res, next);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// edit ebook (admin)
export const editEbook = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const { thumbnail, pdf } = data;
        const ebookId = req.params.id;

        const ebookData = await ebookModel.findById(ebookId) as any;

        if (thumbnail && !thumbnail.startsWith("https")) {
            if (ebookData.thumbnail?.public_id) {
                await cloudinary.v2.uploader.destroy(ebookData.thumbnail.public_id);
            }

            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "ebooks",
            });

            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }

        if (thumbnail && thumbnail.startsWith("https")) {
            data.thumbnail = {
                public_id: ebookData?.thumbnail.public_id,
                url: ebookData?.thumbnail.url,
            };
        }

        if (pdf && !pdf.startsWith("https")) {
            if (ebookData.pdfFile?.public_id) {
                await cloudinary.v2.uploader.destroy(ebookData.pdfFile.public_id, { resource_type: "raw" });
            }

            const myCloud = await cloudinary.v2.uploader.upload(pdf, {
                folder: "ebook_pdfs",
                resource_type: "raw",
                public_id: `ebook_${Date.now()}.pdf`
            });

            data.pdfFile = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }

        if (pdf && pdf.startsWith("https")) {
            data.pdfFile = {
                public_id: ebookData?.pdfFile.public_id,
                url: ebookData?.pdfFile.url,
            };
        }

        const ebook = await ebookModel.findByIdAndUpdate(
            ebookId,
            { $set: data },
            { new: true }
        );

        await redis.del("allEbooks");
        await redis.del(`ebook-${ebookId}`);

        res.status(200).json({
            success: true,
            ebook,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// get single ebook (public - omits pdf link)
export const getSingleEbook = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ebookId = req.params.id;

        const isCacheExist = await redis.get(`ebook-${ebookId}`);
        if (isCacheExist) {
            const ebook = JSON.parse(isCacheExist);
            return res.status(200).json({
                success: true,
                ebook,
            });
        }

        const ebook = await ebookModel.findById(ebookId).select("-pdfFile").populate("reviews.user");

        if (!ebook) {
            return next(new ErrorHandler("Ebook not found", 404));
        }

        await redis.set(`ebook-${ebookId}`, JSON.stringify(ebook), "EX", 604800); // 7 days

        res.status(200).json({
            success: true,
            ebook,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// get all ebooks (public - omits pdf link)
export const getAllEbooks = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const isCacheExist = await redis.get("allEbooks");

        if (isCacheExist) {
            const ebooks = JSON.parse(isCacheExist);
            return res.status(200).json({
                success: true,
                ebooks,
            });
        }

        const ebooks = await ebookModel.find().select("-pdfFile");

        await redis.set("allEbooks", JSON.stringify(ebooks));

        res.status(200).json({
            success: true,
            ebooks,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// get single ebook for valid user (purchased)
export const getPurchasedEbook = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ebookId = req.params.id;
        const user = req.user;

        const ebookExists = user?.ebooks.find((e: any) => e.ebookId === ebookId);
        
        // Admin or superadmin can view any ebook pdf
        const isAdmin = user?.role === "admin" || user?.role === "superadmin" || user?.role === "moderator";

        if (!ebookExists && !isAdmin) {
            return next(new ErrorHandler("You are not eligible to access this ebook", 403));
        }

        const ebook = await ebookModel.findById(ebookId).populate("reviews.user");

        if (!ebook) {
            return next(new ErrorHandler("Ebook not found", 404));
        }

        res.status(200).json({
            success: true,
            ebook,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// get all ebooks (admin only - full details)
export const getAllEbooksAdmin = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        getAllEbooksService(res);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// update ebook status (admin only)
export const updateEbookStatus = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["pending", "active", "disabled"].includes(status)) {
            return next(new ErrorHandler("Invalid status value.", 400));
        }

        const ebook = await ebookModel.findById(id);

        if (!ebook) {
            return next(new ErrorHandler("Ebook not found.", 404));
        }

        if (ebook.status === "drafting") {
            return next(new ErrorHandler("Drafting ebooks cannot have their status updated directly. Edit and publish the ebook instead.", 400));
        }

        ebook.status = status;
        await ebook.save();

        await redis.del(`ebook-${id}`);
        await redis.del("allEbooks");

        res.status(200).json({
            success: true,
            ebook
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// delete ebook (admin only)
export const deleteEbook = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const ebook = await ebookModel.findById(id);

        if (!ebook) {
            return next(new ErrorHandler("Ebook not found", 404));
        }

        if (ebook.thumbnail?.public_id) {
            await cloudinary.v2.uploader.destroy(ebook.thumbnail.public_id);
        }

        if (ebook.pdfFile?.public_id) {
            await cloudinary.v2.uploader.destroy(ebook.pdfFile.public_id, { resource_type: "raw" });
        }

        await ebook.deleteOne({ id });

        await redis.del(`ebook-${id}`);
        await redis.del("allEbooks");

        res.status(200).json({
            success: true,
            message: "Ebook deleted successfully",
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// add review to ebook
interface IAddReviewData {
    review: string;
    rating: number;
    userId: string;
}

export const addEbookReview = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const ebookId = req.params.id;
        
        const ebookExists = user?.ebooks.find((e: any) => e.ebookId === ebookId);

        if (!ebookExists) {
            return next(new ErrorHandler("You are not eligible to access this ebook", 403));
        }

        const ebook = await ebookModel.findById(ebookId);

        if (!ebook) {
            return next(new ErrorHandler("Ebook not found", 404));
        }

        const { review, rating } = req.body as IAddReviewData;

        const reviewData: any = {
            user: user._id,
            rating,
            comment: review,
        };

        const isReviewExists = ebook?.reviews.find(
            (rev: any) => rev.user.toString() === user._id.toString()
        );

        if (isReviewExists) {
            isReviewExists.comment = review;
            isReviewExists.rating = rating;
            ebook.markModified("reviews");
        } else {
            ebook?.reviews.push(reviewData);
        }

        let avg = 0;
        ebook?.reviews.forEach((rev: any) => {
            avg += rev.rating;
        });

        if (ebook) {
            ebook.ratings = avg / ebook.reviews.length;
            ebook.markModified("ratings");
        }

        await ebook?.save();
        
        // Invalidate all ebooks cache
        await redis.del("allEbooks");

        // Update single ebook cache (public version without pdfFile)
        const updatedEbook = await ebookModel.findById(ebookId).select("-pdfFile").populate("reviews.user");
        await redis.set(`ebook-${ebookId}`, JSON.stringify(updatedEbook), "EX", 604800);

        res.status(200).json({
            success: true,
            ebook: updatedEbook,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// add reply to ebook review (admin)
export const addReplyToEbookReview = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { comment, ebookId, reviewId } = req.body;

        const ebook = await ebookModel.findById(ebookId);

        if (!ebook) {
            return next(new ErrorHandler("Ebook not found", 404));
        }

        const review = ebook?.reviews?.find((rev: any) => rev._id.toString() === reviewId);

        if (!review) {
            return next(new ErrorHandler("Review not found", 404));
        }

        const replyData: any = {
            user: req.user?._id,
            comment,
            createdAt: new Date().toISOString(),
        };

        if (!review.commentReplies) {
            review.commentReplies = [];
        }

        review.commentReplies?.push(replyData);

        await ebook?.save();

        await redis.set(`ebook-${ebookId}`, JSON.stringify(ebook), "EX", 604800);

        res.status(200).json({
            success: true,
            ebook,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});
