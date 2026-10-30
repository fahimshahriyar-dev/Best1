import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import layoutModel from "../models/layout.model";
import cloudinary from "cloudinary";

// create layout (admin only)
export const createLayout = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body;

        const isTypeExist = await layoutModel.findOne({ type });

        if(isTypeExist) {
            return next(new ErrorHandler(`${type} already exist.`, 400));
        }

        // banner
        if(type === "Banner") {
            const { image, title, subTitle } = req.body;

            const myCloud = await cloudinary.v2.uploader.upload(image, {
                folder: "layout"
            })

            const banner = {
                type: "Banner",
                banner: {
                    image: {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url
                    },
                    title,
                    subTitle
                }
            }

            await layoutModel.create(banner);
        };

        // faq
        if(type === "FAQ" ) {
            const { faq } = req.body;

            const faqItems = await Promise.all(
                faq.map(async(item: any) => {
                    return {
                        question: item.question,
                        answer: item.answer
                    }
                })
            )

            await layoutModel.create({ type: "FAQ", faq: faqItems });
        }

        // category
        if(type === "Categories" || type === "EbookCategories") {
            const { categories } = req.body;

            const categoryItems = await Promise.all(
                categories.map(async(item: any) => {
                    return {
                        title: item.title
                    }
                })
            )

            await layoutModel.create({ type, categories: categoryItems });
        }

        res.status(201).json({
            success: true,
            message: "Layout created successfully!"
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Edit layout (admin only)
export const editLayout = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type, image, title, subTitle, faq, categories } = req.body;

        if (type === "Banner") {
            if (!title || !subTitle || !image) {
                return res.status(400).json({ success: false, message: "All banner fields are required" });
            }

            let bannerData = await layoutModel.findOne({ type: "Banner" });

            if (!bannerData) {
                bannerData = await layoutModel.create({
                    type: "Banner",
                    banner: {
                        image: { public_id: "", url: image },
                        title,
                        subTitle
                    }
                });
                return res.status(201).json({ success: true, message: "Banner created successfully!", bannerData });
            }

            let uploadedImage = bannerData.banner!.image;
            if (!image.startsWith("https")) {
                const uploaded = await cloudinary.v2.uploader.upload(image, { folder: "layout" });
                uploadedImage = { public_id: uploaded.public_id, url: uploaded.secure_url };
            }

            bannerData.banner = {
                image: uploadedImage,
                title,
                subTitle
            };

            await bannerData.save();
            return res.status(200).json({ success: true, message: "Banner updated successfully!", bannerData });
        }

        // Handle updating FAQ
        if (type === "FAQ") {
            if (!faq || !Array.isArray(faq)) {
                return next(new ErrorHandler("FAQ data must be a non-empty array.", 400));
            }
            const updatedLayout = await layoutModel.findOneAndUpdate(
                { type: "FAQ" },
                { faq },
                { new: true, upsert: true, runValidators: true }
            );
            return res.status(200).json({ success: true, message: "FAQ updated successfully!", layout: updatedLayout });
        }

        // Handle updating Categories
        if (type === "Categories" || type === "EbookCategories") {
            if (!categories || !Array.isArray(categories)) {
                return next(new ErrorHandler("Categories data must be a non-empty array.", 400));
            }

            // Remove the _id from new categories before saving
            const categoriesToSave = categories.map((cat: any) => {
                const { _id, ...rest } = cat; // Destructure to remove _id
                return rest;
            });

            const updatedLayout = await layoutModel.findOneAndUpdate(
                { type },
                { categories: categoriesToSave }, // Use the modified array
                { new: true, upsert: true, runValidators: true }
            );
            return res.status(200).json({ success: true, message: "Categories updated successfully!", layout: updatedLayout });
        }

        return next(new ErrorHandler(`Invalid layout type: ${type}`, 400));
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// get layout by type (admin only)
export const getLayoutByType = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.params;

        let layout = await layoutModel.findOne({ type });

        // If FAQ doesn't exist, create it with default questions
        if (!layout && type === "FAQ") {
            const defaultFAQ = [
                {
                    question: "What is Best1 Academy?",
                    answer: "Best1 Academy is an online learning platform where you can join live courses taught by experienced instructors or purchase self-paced courses — all from the comfort of your home."
                },
                {
                    question: "How do I enroll in a course or live course?",
                    answer: "Simply find the course or live course you're interested in, fill out the enrollment form, and complete your payment. Once confirmed, you'll get instant access."
                },
                {
                    question: "Do I need an account to get started?",
                    answer: "Yes. Creating a free account lets you enroll in courses, join live courses, and track your learning progress from your personal dashboard."
                },
                {
                    question: "Can I become a mentor at Best1 Academy?",
                    answer: "Absolutely. If you have knowledge and a passion for teaching, you can apply through our mentor application form. Our team will review your submission and get back to you."
                },
                {
                    question: "How can I contact Best1 Academy for help?",
                    answer: "You can reach us by email at fazli7.sam@gmail.com or call us at +8801618206060. We're happy to help with any questions you have."
                }
            ];
            layout = await layoutModel.create({ type: "FAQ", faq: defaultFAQ });
        }

        res.status(200).json({
            success: true,
            layout
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});