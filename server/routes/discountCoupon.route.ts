import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { updateAccessToken } from "../controllers/user.controller";
import {
  createDiscountCoupon,
  getAllDiscountCoupons,
  updateDiscountCoupon,
  deleteDiscountCoupon,
} from "../controllers/discountCoupon.controller";

const discountCouponRouter = express.Router();

discountCouponRouter.post(
  "/create-discount-coupon",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin", "moderator"),
  createDiscountCoupon
);

discountCouponRouter.get("/get-discount-coupons", getAllDiscountCoupons);

discountCouponRouter.put(
  "/update-discount-coupon/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin", "moderator"),
  updateDiscountCoupon
);

discountCouponRouter.delete(
  "/delete-discount-coupon/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin", "moderator"),
  deleteDiscountCoupon
);

export default discountCouponRouter;
