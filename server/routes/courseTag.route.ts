import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { updateAccessToken } from "../controllers/user.controller";
import {
  createCourseTag,
  getAllCourseTags,
  updateCourseTag,
  deleteCourseTag,
} from "../controllers/courseTag.controller";

const courseTagRouter = express.Router();

courseTagRouter.post(
  "/create-course-tag",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin", "moderator"),
  createCourseTag
);

courseTagRouter.get(
  "/get-course-tags",
  getAllCourseTags
);

courseTagRouter.put(
  "/update-course-tag/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin", "moderator"),
  updateCourseTag
);

courseTagRouter.delete(
  "/delete-course-tag/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin", "moderator"),
  deleteCourseTag
);

export default courseTagRouter;
