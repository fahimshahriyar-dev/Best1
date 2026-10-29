import mongoose, { Document, Model, Schema } from "mongoose";

export interface IDiscountCoupon extends Document {
  code: string;
  discountPercent: number;
  expiryDate: Date;
  isActive: boolean;
}

const discountCouponSchema: Schema<IDiscountCoupon> = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Please enter coupon code."],
      unique: true,
      uppercase: true,
    },
    discountPercent: {
      type: Number,
      required: [true, "Please enter discount percent."],
    },
    expiryDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const discountCouponModel: Model<IDiscountCoupon> = mongoose.model(
  "DiscountCoupon",
  discountCouponSchema
);

export default discountCouponModel;
