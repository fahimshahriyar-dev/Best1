import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
    submitTeacherApplication,
    getAllTeacherApplications,
    updateApplicationStatus,
    getMyApplicationStatus,
} from "../controllers/forms/teacherApplication.controller";
import { updateAccessToken } from "../controllers/user.controller";

const teacherApplicationRouter = express.Router();

// User routes
teacherApplicationRouter.post(
    "/apply-teacher",
    updateAccessToken,
    isAuthenticated,
    submitTeacherApplication
);

teacherApplicationRouter.get(
    "/my-teacher-application",
    updateAccessToken,
    isAuthenticated,
    getMyApplicationStatus
);

// Admin routes
teacherApplicationRouter.get(
    "/teacher-applications",
    updateAccessToken,
    isAuthenticated,
    authorizeRoles("admin", "moderator"),
    getAllTeacherApplications
);

teacherApplicationRouter.put(
    "/teacher-application/:id/status",
    updateAccessToken,
    isAuthenticated,
    authorizeRoles("admin", "moderator"),
    updateApplicationStatus
);

export default teacherApplicationRouter;
