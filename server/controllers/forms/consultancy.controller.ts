import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../../middleware/catchAsyncError";
import ErrorHandler from "../../utils/errorHandler";
import consultancyModel from "../../models/consultancy.model";

// Submit a consultancy request (authenticated user)
export const submitConsultancy = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?._id;

            const existing = await consultancyModel.findOne({
                userId,
                status: "unreviewed",
            });

            if (existing) {
                return next(
                    new ErrorHandler(
                        "You already have an unreviewed consultancy request. Please wait for admin review.",
                        400
                    )
                );
            }

            const data = { ...req.body, userId };

            const consultancy = await consultancyModel.create(data);

            res.status(201).json({
                success: true,
                message: "Your consultancy request has been submitted successfully!",
                consultancy,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Submit a public consultancy inquiry (no auth required)
export const submitPublicConsultancy = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const consultancy = await consultancyModel.create(req.body);

            res.status(201).json({
                success: true,
                message: "Your consultancy inquiry has been submitted successfully! We will get back to you soon.",
                consultancy,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Get all consultancy requests (admin only)
export const getAllConsultancies = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const consultancies = await consultancyModel
                .find()
                .populate("userId", "name email avatar role")
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                consultancies,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Toggle consultancy review status (admin only)
export const toggleConsultancyReview = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            const consultancy = await consultancyModel.findById(id);

            if (!consultancy) {
                return next(new ErrorHandler("Consultancy request not found.", 404));
            }

            consultancy.status = consultancy.status === "reviewed" ? "unreviewed" : "reviewed";

            await consultancy.save();

            const label = consultancy.status === "reviewed" ? "reviewed" : "unreviewed";

            res.status(200).json({
                success: true,
                message: `Consultancy request marked as ${label}.`,
                consultancy,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Get current user's own consultancy request status
export const getMyConsultancyStatus = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?._id;

            const consultancy = await consultancyModel
                .findOne({ userId })
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                consultancy: consultancy || null,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
