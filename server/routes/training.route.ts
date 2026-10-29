import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
    createTraining,
    editTraining,
    getAllTrainingsAdmin,
    getAllTrainings,
    getSingleTraining,
    deleteTraining,
    updateTrainingStatus,
} from "../controllers/training.controller";
import { updateAccessToken } from "../controllers/user.controller";

const trainingRouter = express.Router();

// Admin routes
trainingRouter.post(
    "/create-training",
    updateAccessToken,
    isAuthenticated,
    authorizeRoles("admin", "moderator"),
    createTraining
);

trainingRouter.put(
    "/edit-training/:id",
    updateAccessToken,
    isAuthenticated,
    authorizeRoles("admin", "moderator"),
    editTraining
);

trainingRouter.get(
    "/getAllTrainings-admin",
    updateAccessToken,
    isAuthenticated,
    authorizeRoles("admin", "moderator"),
    getAllTrainingsAdmin
);

trainingRouter.delete(
    "/delete-training/:id",
    updateAccessToken,
    isAuthenticated,
    authorizeRoles("admin", "moderator"),
    deleteTraining
);

trainingRouter.put(
    "/update-training-status/:id",
    updateAccessToken,
    isAuthenticated,
    authorizeRoles("admin", "moderator"),
    updateTrainingStatus
);

// Public routes
trainingRouter.get(
    "/getTrainings",
    getAllTrainings
);

trainingRouter.get(
    "/getTraining/:id",
    getSingleTraining
);

export default trainingRouter;
