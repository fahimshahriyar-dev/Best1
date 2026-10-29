import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import { generateLast12MonthData } from "../utils/analytics.generator";
import userModel from "../models/user.model";
import courseModel from "../models/course.model";
import orderModel from "../models/order.model";
// get users analytics (admin only)
export const getUserAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await generateLast12MonthData(userModel);
        const totalUsers = await userModel.countDocuments();

        res.status(200).json({
            success: true,
            users,
            totalUsers
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// get courses analytics (admin only)
export const getCourseAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courses = await generateLast12MonthData(courseModel);
        const totalCourses = await courseModel.countDocuments();

        res.status(200).json({
            success: true,
            courses,
            totalCourses
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// get orders analytics (admin only)
export const getOrderAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await generateLast12MonthData(orderModel);
        const totalOrders = await orderModel.countDocuments();

        res.status(200).json({
            success: true,
            orders,
            totalOrders
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

