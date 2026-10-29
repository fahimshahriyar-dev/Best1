import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { updateAccessToken } from "../controllers/user.controller";
import {
  createLearningGoalTag,
  getAllLearningGoalTags,
  updateLearningGoalTag,
  deleteLearningGoalTag,
} from "../controllers/learningGoalTag.controller";

const learningGoalTagRouter = express.Router();

learningGoalTagRouter.post(
  "/create-learning-goal-tag",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin", "moderator"),
  createLearningGoalTag
);

learningGoalTagRouter.get(
  "/get-learning-goal-tags",
  getAllLearningGoalTags
);

learningGoalTagRouter.put(
  "/update-learning-goal-tag/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin", "moderator"),
  updateLearningGoalTag
);

learningGoalTagRouter.delete(
  "/delete-learning-goal-tag/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin", "moderator"),
  deleteLearningGoalTag
);

export default learningGoalTagRouter;
