import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { updateAccessToken } from "../controllers/user.controller";
import {
  createEbookTag,
  getAllEbookTags,
  updateEbookTag,
  deleteEbookTag,
} from "../controllers/ebookTag.controller";

const ebookTagRouter = express.Router();

ebookTagRouter.post(
  "/create-ebook-tag",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin", "moderator"),
  createEbookTag
);

ebookTagRouter.get(
  "/get-ebook-tags",
  getAllEbookTags
);

ebookTagRouter.put(
  "/update-ebook-tag/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin", "moderator"),
  updateEbookTag
);

ebookTagRouter.delete(
  "/delete-ebook-tag/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin", "moderator"),
  deleteEbookTag
);

export default ebookTagRouter;
