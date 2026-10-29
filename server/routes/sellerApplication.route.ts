import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
    submitSellerApplication,
    getAllSellerApplications,
    updateApplicationStatus,
    getMyApplicationStatus,
} from "../controllers/forms/sellerApplication.controller";
import { updateAccessToken } from "../controllers/user.controller";

const sellerApplicationRouter = express.Router();

// User routes
sellerApplicationRouter.post(
    "/apply-seller",
    updateAccessToken,
    isAuthenticated,
    submitSellerApplication
);

sellerApplicationRouter.get(
    "/my-seller-application",
    updateAccessToken,
    isAuthenticated,
    getMyApplicationStatus
);

// Admin routes
sellerApplicationRouter.get(
    "/seller-applications",
    updateAccessToken,
    isAuthenticated,
    authorizeRoles("admin", "moderator"),
    getAllSellerApplications
);

sellerApplicationRouter.put(
    "/seller-application/:id/status",
    updateAccessToken,
    isAuthenticated,
    authorizeRoles("admin", "moderator"),
    updateApplicationStatus
);

export default sellerApplicationRouter;
