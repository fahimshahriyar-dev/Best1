import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import discountCouponModel from "../models/discountCoupon.model";

export const createDiscountCoupon = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, discountPercent, expiryDays } = req.body;
      if (!code || !discountPercent) {
        return next(new ErrorHandler("All fields are required.", 400));
      }
      const existing = await discountCouponModel.findOne({ code: code.toUpperCase() });
      if (existing) {
        return next(new ErrorHandler("Coupon code already exists.", 400));
      }
      const expiryDate = expiryDays
        ? new Date(Date.now() + Number(expiryDays) * 24 * 60 * 60 * 1000)
        : undefined;
      const coupon = await discountCouponModel.create({
        code: code.toUpperCase(),
        discountPercent,
        expiryDate,
      });
      res.status(201).json({ success: true, coupon });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getAllDiscountCoupons = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const coupons = await discountCouponModel.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, coupons });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const updateDiscountCoupon = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { code, discountPercent, expiryDays, isActive } = req.body;
      const updateData: any = {};
      if (code) updateData.code = code.toUpperCase();
      if (discountPercent) updateData.discountPercent = discountPercent;
      if (expiryDays) {
        updateData.expiryDate = new Date(Date.now() + Number(expiryDays) * 24 * 60 * 60 * 1000);
      }
      if (isActive !== undefined) updateData.isActive = isActive;
      const coupon = await discountCouponModel.findByIdAndUpdate(id, updateData, { new: true });
      if (!coupon) {
        return next(new ErrorHandler("Coupon not found.", 404));
      }
      res.status(200).json({ success: true, coupon });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const deleteDiscountCoupon = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const coupon = await discountCouponModel.findByIdAndDelete(id);
      if (!coupon) {
        return next(new ErrorHandler("Coupon not found.", 404));
      }
      res.status(200).json({ success: true, message: "Coupon deleted successfully!" });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
