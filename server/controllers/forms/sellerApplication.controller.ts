import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../../middleware/catchAsyncError";
import ErrorHandler from "../../utils/errorHandler";
import sellerApplicationModel from "../../models/sellerApplication.model";
import userModel from "../../models/user.model";
import { redis } from "../../utils/redis";
import sendMail from "../../utils/sendEmail";

// Submit a seller application (authenticated user)
export const submitSellerApplication = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?._id;

            // Prevent duplicate pending application
            const existing = await sellerApplicationModel.findOne({
                userId,
                status: "pending",
            });

            if (existing) {
                return next(
                    new ErrorHandler(
                        "You already have a pending application. Please wait for admin review.",
                        400
                    )
                );
            }

            const data = { ...req.body, userId };

            const application = await sellerApplicationModel.create(data);

            res.status(201).json({
                success: true,
                message: "Your application has been submitted successfully!",
                application,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Get all seller applications (admin only)
export const getAllSellerApplications = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const applications = await sellerApplicationModel
                .find()
                .populate("userId", "name email avatar role")
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                applications,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Update application status (admin only)
export const updateApplicationStatus = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { status, adminNote } = req.body;

            if (!["approved", "rejected", "pending"].includes(status)) {
                return next(new ErrorHandler("Invalid status value.", 400));
            }

            const application = await sellerApplicationModel.findById(id);

            if (!application) {
                return next(new ErrorHandler("Application not found.", 404));
            }

            const previousStatus = application.status;
            application.status = status;
            if (adminNote !== undefined) {
                application.adminNote = adminNote;
            }

            await application.save();

            // Send email notification to user
            const user = await userModel.findById(application.userId);
            if (user) {
                const mailData = {
                    name: user.name,
                    status: status,
                    type: "seller",
                    adminNote: adminNote || ""
                };

                try {
                    await sendMail({
                        email: user.email,
                        subject: `Seller Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
                        template: "applicationStatus.ejs",
                        data: { data: mailData }
                    });
                } catch (error: any) {
                    console.log("Error sending email:", error.message);
                    // We don't necessarily want to fail the whole request if email fails, 
                    // but we should probably log it.
                }
            }

            // Role change is now manual, so we just return success
            res.status(200).json({
                success: true,
                message: `Application ${status} successfully.`,
                application,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Get current user's own application status
export const getMyApplicationStatus = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?._id;

            const application = await sellerApplicationModel
                .findOne({ userId })
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                application: application || null,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
