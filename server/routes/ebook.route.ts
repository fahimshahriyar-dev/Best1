import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { updateAccessToken } from "../controllers/user.controller";
import { 
    addEbookReview, 
    addReplyToEbookReview, 
    deleteEbook, 
    editEbook, 
    getAllEbooks, 
    getAllEbooksAdmin, 
    getPurchasedEbook, 
    getSingleEbook, 
    updateEbookStatus,
    uploadEbook 
} from "../controllers/ebook.controller";

const ebookRouter = express.Router();

ebookRouter.post(
    "/create-ebook",
    updateAccessToken,
    isAuthenticated,
    authorizeRoles("superadmin", "admin", "moderator"),
    uploadEbook
);

ebookRouter.put(
    "/edit-ebook/:id",
    updateAccessToken,
    isAuthenticated,
    authorizeRoles("superadmin", "admin", "moderator"),
    editEbook
);

ebookRouter.get(
    "/get-ebook/:id",
    getSingleEbook
);

ebookRouter.get(
    "/get-ebooks",
    getAllEbooks
);

ebookRouter.get(
    "/get-ebook-content/:id",
    updateAccessToken,
    isAuthenticated,
    getPurchasedEbook
);

ebookRouter.get(
    "/get-admin-ebooks",
    updateAccessToken,
    isAuthenticated,
    authorizeRoles("superadmin", "admin", "moderator"),
    getAllEbooksAdmin
);

ebookRouter.put(
    "/update-ebook-status/:id",
    updateAccessToken,
    isAuthenticated,
    authorizeRoles("superadmin", "admin", "moderator"),
    updateEbookStatus
);

ebookRouter.delete(
    "/delete-ebook/:id",
    updateAccessToken,
    isAuthenticated,
    authorizeRoles("superadmin", "admin", "moderator"),
    deleteEbook
);

ebookRouter.put(
    "/add-ebook-review/:id",
    updateAccessToken,
    isAuthenticated,
    addEbookReview
);

ebookRouter.put(
    "/add-ebook-reply",
    updateAccessToken,
    isAuthenticated,
    authorizeRoles("superadmin", "admin", "moderator"),
    addReplyToEbookReview
);

export default ebookRouter;
