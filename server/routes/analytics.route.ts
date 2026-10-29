import express from "express"
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { getCourseAnalytics, getOrderAnalytics, getUserAnalytics } from "../controllers/analytics.controller";

const analyticsRouter = express.Router();

// get
analyticsRouter.get("/getUserAnalytics", isAuthenticated, authorizeRoles("admin", "moderator"), getUserAnalytics);

analyticsRouter.get("/getCourseAnalytics", isAuthenticated, authorizeRoles("admin", "moderator"), getCourseAnalytics);

analyticsRouter.get("/getOrderAnalytics", isAuthenticated, authorizeRoles("admin", "moderator"), getOrderAnalytics);


export default analyticsRouter;