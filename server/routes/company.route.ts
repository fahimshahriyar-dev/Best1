import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
    addCompany,
    getAllCompanies,
    deleteCompany,
} from "../controllers/company.controller";
import { updateAccessToken } from "../controllers/user.controller";

const companyRouter = express.Router();

// Admin routes
companyRouter.post(
    "/add-company",
    updateAccessToken,
    isAuthenticated,
    authorizeRoles("admin", "moderator"),
    addCompany
);

companyRouter.delete(
    "/delete-company/:id",
    updateAccessToken,
    isAuthenticated,
    authorizeRoles("admin", "moderator"),
    deleteCompany
);

// Public route
companyRouter.get("/get-companies", getAllCompanies);

export default companyRouter;
