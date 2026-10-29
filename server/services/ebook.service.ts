import { Response } from "express";
import ebookModel from "../models/ebook.model";
import { catchAsyncError } from "../middleware/catchAsyncError";

// create ebook
export const createEbookService = catchAsyncError(async (data: any, res: Response) => {
    const ebook = await ebookModel.create(data);
    res.status(201).json({
        success: true,
        ebook
    });
});

// get all ebooks
export const getAllEbooksService = async (res: Response) => {
    const ebooks = await ebookModel.find().sort({ createdAt: -1 });

    res.status(201).json({
        success: true,
        ebooks
    });
};
