import mongoose, { Document, Model, Schema } from "mongoose";

export interface IConsultancy extends Document {
    userId?: mongoose.Types.ObjectId;
    fullName: string;
    email: string;
    phoneNumber: string;
    subject: string;
    message: string;
    // Business/public inquiry fields
    companyName?: string;
    contactPerson?: string;
    businessEmail?: string;
    companyWebsite?: string;
    industry?: string;
    consultancyType?: string;
    budgetRange?: string;
    preferredTimeline?: string;
    attachment?: string;
    status: "unreviewed" | "reviewed";
    adminNote?: string;
    createdAt: Date;
    updatedAt: Date;
}

const consultancySchema: Schema<IConsultancy> = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        subject: { type: String, required: true },
        message: { type: String, required: true },
        companyName: { type: String },
        contactPerson: { type: String },
        businessEmail: { type: String },
        companyWebsite: { type: String },
        industry: { type: String },
        consultancyType: { type: String },
        budgetRange: { type: String },
        preferredTimeline: { type: String },
        attachment: { type: String },
        status: {
            type: String,
            enum: ["unreviewed", "reviewed"],
            default: "unreviewed",
        },
        adminNote: { type: String },
    },
    { timestamps: true }
);

const consultancyModel: Model<IConsultancy> = mongoose.model(
    "Consultancy",
    consultancySchema
);

export default consultancyModel;
