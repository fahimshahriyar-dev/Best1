import express from "express"
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { createOrder, getAllOrders, newPayment, sendStripePublishableKey } from "../controllers/order.controller";
import { updateAccessToken } from "../controllers/user.controller";

const orderRouter = express.Router();

// post
orderRouter.post('/createOrder', updateAccessToken, isAuthenticated, createOrder);

orderRouter.post('/payment', isAuthenticated, newPayment);

// get
orderRouter.get("/getOrders", updateAccessToken, isAuthenticated, authorizeRoles("admin", "moderator"), getAllOrders);

orderRouter.get("/payment/stripe-publishablekey", sendStripePublishableKey);

export default orderRouter;