import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../../middleware/catchAsyncError";
import ErrorHandler from "../../utils/errorHandler";
import teacherApplicationModel from "../../models/teacherApplication.model";
import userModel from "../../models/user.model";
import { redis } from "../../utils/redis";
import sendMail from "../../utils/sendEmail";

// Submit a teacher application (authenticated user)
export const submitTeacherApplication = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?._id;

            // Prevent duplicate pending application
            const existing = await teacherApplicationModel.findOne({
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

            const application = await teacherApplicationModel.create(data);

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

// Get all teacher applications (admin only)
export const getAllTeacherApplications = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const applications = await teacherApplicationModel
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

            const application = await teacherApplicationModel.findById(id);

            if (!application) {
                return next(new ErrorHandler("Application not found.", 404));
            }

            const previousStatus = application.status;
            application.status = status;
            if (adminNote !== undefined) {
                application.adminNote = adminNote;
            }

            await application.save();

            // Auto-promote / demote user role based on status change
            const user = await userModel.findById(application.userId);
            if (user) {
                if (status === "approved") {
                    user.role = "teacher";
                } else if (status === "rejected" && previousStatus === "approved") {
                    // Revert to user if approval is being revoked
                    user.role = "user";
                }
                await user.save();

                // Invalidate Redis cache so user sees updated role immediately
                await redis.del(user._id.toString());

                // Send email notification to user
                const mailData = {
                    name: user.name,
                    status: status,
                    type: "teacher",
                    adminNote: adminNote || ""
                };

                try {
                    await sendMail({
                        email: user.email,
                        subject: `Teacher Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
                        template: "applicationStatus.ejs",
                        data: { data: mailData }
                    });
                } catch (error: any) {
                    console.log("Error sending email:", error.message);
                }
            }

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

            const application = await teacherApplicationModel
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
