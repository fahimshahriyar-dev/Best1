import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import companyModel from "../models/company.model";
import cloudinary from "cloudinary";

// Add company (admin only)
export const addCompany = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, logo, website } = req.body;

            if (!name || !website) {
                return next(new ErrorHandler("Company name and website link are required.", 400));
            }

            let logoData: { public_id?: string; url?: string } | undefined = undefined;

            if (logo && typeof logo === "string" && logo.startsWith("data:")) {
                const cloudResult = await cloudinary.v2.uploader.upload(logo, {
                    folder: "companies",
                });
                logoData = {
                    public_id: cloudResult.public_id,
                    url: cloudResult.secure_url,
                };
            } else if (logo && typeof logo === "object" && logo.url) {
                logoData = logo;
            }

            const company = await companyModel.create({
                name,
                logo: logoData,
                website,
            });

            res.status(201).json({
                success: true,
                message: "Company added successfully!",
                company,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Get all companies (public)
export const getAllCompanies = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const companies = await companyModel.find().sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                companies,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Delete company (admin only)
export const deleteCompany = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            const company = await companyModel.findById(id);
            if (!company) {
                return next(new ErrorHandler("Company not found", 404));
            }

            if (company.logo?.public_id) {
                await cloudinary.v2.uploader.destroy(company.logo.public_id);
            }

            await company.deleteOne();

            res.status(200).json({
                success: true,
                message: "Company deleted successfully!",
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
