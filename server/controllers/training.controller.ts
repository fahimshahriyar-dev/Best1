import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import trainingModel from "../models/training.model";
import cloudinary from "cloudinary";

// Create training (admin only)
export const createTraining = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;

            if (data.thumbnail) {
                const result = await cloudinary.v2.uploader.upload(data.thumbnail, {
                    folder: "trainings",
                });
                data.thumbnail = { public_id: result.public_id, url: result.secure_url };
            }

            if (data.trainerPhoto) {
                const result = await cloudinary.v2.uploader.upload(data.trainerPhoto, {
                    folder: "trainers",
                });
                data.trainerPhoto = { public_id: result.public_id, url: result.secure_url };
            }

            const training = await trainingModel.create(data);

            res.status(201).json({
                success: true,
                message: "Training created successfully!",
                training,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Edit training (admin only)
export const editTraining = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const data = req.body;

            const training = await trainingModel.findById(id);
            if (!training) {
                return next(new ErrorHandler("Training not found.", 404));
            }

            if (data.thumbnail && data.thumbnail.startsWith("data:")) {
                if (training.thumbnail?.public_id) {
                    await cloudinary.v2.uploader.destroy(training.thumbnail.public_id);
                }
                const result = await cloudinary.v2.uploader.upload(data.thumbnail, {
                    folder: "trainings",
                });
                data.thumbnail = { public_id: result.public_id, url: result.secure_url };
            }

            if (data.trainerPhoto && data.trainerPhoto.startsWith("data:")) {
                if (training.trainerPhoto?.public_id) {
                    await cloudinary.v2.uploader.destroy(training.trainerPhoto.public_id);
                }
                const result = await cloudinary.v2.uploader.upload(data.trainerPhoto, {
                    folder: "trainers",
                });
                data.trainerPhoto = { public_id: result.public_id, url: result.secure_url };
            }

            const updated = await trainingModel.findByIdAndUpdate(id, data, {
                new: true,
                runValidators: true,
            });

            res.status(200).json({
                success: true,
                message: "Training updated successfully!",
                training: updated,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Get all trainings (admin)
export const getAllTrainingsAdmin = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const trainings = await trainingModel.find().sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                trainings,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Get published trainings (public)
export const getAllTrainings = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const trainings = await trainingModel.find({
                status: { $in: ["active"] },
            }).sort({ startDate: 1 });

            res.status(200).json({
                success: true,
                trainings,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Get single training (public)
export const getSingleTraining = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const training = await trainingModel.findById(id);

            if (!training) {
                return next(new ErrorHandler("Training not found.", 404));
            }

            res.status(200).json({
                success: true,
                training,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Update training status (admin only)
export const updateTrainingStatus = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!["pending", "active", "disabled"].includes(status)) {
                return next(new ErrorHandler("Invalid status value.", 400));
            }

            const training = await trainingModel.findById(id);
            if (!training) {
                return next(new ErrorHandler("Training not found.", 404));
            }

            training.status = status;
            await training.save();

            res.status(200).json({
                success: true,
                message: "Training status updated successfully!",
                training,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Delete training (admin only)
export const deleteTraining = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            const training = await trainingModel.findById(id);
            if (!training) {
                return next(new ErrorHandler("Training not found.", 404));
            }

            if (training.thumbnail?.public_id) {
                await cloudinary.v2.uploader.destroy(training.thumbnail.public_id);
            }
            if (training.trainerPhoto?.public_id) {
                await cloudinary.v2.uploader.destroy(training.trainerPhoto.public_id);
            }

            await training.deleteOne();

            res.status(200).json({
                success: true,
                message: "Training deleted successfully!",
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
