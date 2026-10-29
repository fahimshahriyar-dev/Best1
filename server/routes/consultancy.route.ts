import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
    submitConsultancy,
    submitPublicConsultancy,
    getAllConsultancies,
    toggleConsultancyReview,
    getMyConsultancyStatus,
} from "../controllers/forms/consultancy.controller";
import { updateAccessToken } from "../controllers/user.controller";

const consultancyRouter = express.Router();

// Public route (no auth required)
consultancyRouter.post(
    "/public-consultancy",
    submitPublicConsultancy
);

// User routes
consultancyRouter.post(
    "/apply-consultancy",
    updateAccessToken,
    isAuthenticated,
    submitConsultancy
);

consultancyRouter.get(
    "/my-consultancy",
    updateAccessToken,
    isAuthenticated,
    getMyConsultancyStatus
);

// Admin routes
consultancyRouter.get(
    "/consultancies",
    updateAccessToken,
    isAuthenticated,
    authorizeRoles("admin", "moderator"),
    getAllConsultancies
);

consultancyRouter.put(
    "/consultancy/:id/toggle-review",
    updateAccessToken,
    isAuthenticated,
    authorizeRoles("admin", "moderator"),
    toggleConsultancyReview
);

export default consultancyRouter;
