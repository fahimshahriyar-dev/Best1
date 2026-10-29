import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import learningGoalTagModel from "../models/learningGoalTag.model";

export const createLearningGoalTag = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title } = req.body;

      if (!title) {
        return next(new ErrorHandler("Tag title is required.", 400));
      }

      const existingTag = await learningGoalTagModel.findOne({ title });
      if (existingTag) {
        return next(new ErrorHandler("Tag already exists.", 400));
      }

      const tag = await learningGoalTagModel.create({ title });

      res.status(201).json({
        success: true,
        tag,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getAllLearningGoalTags = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tags = await learningGoalTagModel.find().sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        tags,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const updateLearningGoalTag = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { title } = req.body;

      if (!title) {
        return next(new ErrorHandler("Tag title is required.", 400));
      }

      const existingTag = await learningGoalTagModel.findOne({
        title,
        _id: { $ne: id },
      });
      if (existingTag) {
        return next(new ErrorHandler("Tag with this title already exists.", 400));
      }

      const tag = await learningGoalTagModel.findByIdAndUpdate(
        id,
        { title },
        { new: true }
      );

      if (!tag) {
        return next(new ErrorHandler("Tag not found.", 404));
      }

      res.status(200).json({
        success: true,
        tag,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const deleteLearningGoalTag = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const tag = await learningGoalTagModel.findByIdAndDelete(id);

      if (!tag) {
        return next(new ErrorHandler("Tag not found.", 404));
      }

      res.status(200).json({
        success: true,
        message: "Tag deleted successfully!",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
