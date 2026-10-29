import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISellerApplication extends Document {
    userId: mongoose.Types.ObjectId;
    // Section 1 — Personal Information
    fullName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth?: string;
    gender?: string;
    occupation: string;
    occupationOther?: string;
    // Section 2 — Location
    country: string;
    city: string;
    postalCode?: string;
    address?: string;
    // Section 3 — Product Info
    productCategory: string[];
    productType?: string;
    // Section 4 — Shop Details (optional)
    shopName?: string;
    shopCategory?: string;
    shopAddressType?: string;
    shopAddressOffline?: string;
    shopAddressOnline?: string[];
    shopAddressOther?: string;
    // Section 5 — Online Presence
    onlinePresenceType?: string;
    shopLinkedinUrl?: string;
    shopFacebookUrl?: string;
    shopYoutubeUrl?: string;
    shopPortfolioUrl?: string;
    personalLinkedinUrl?: string;
    personalFacebookUrl?: string;
    personalYoutubeUrl?: string;
    personalPortfolioUrl?: string;
    // Section 6 — Additional Information
    whyJoin?: string;
    additionalInfo?: string;
    // Status
    status: "pending" | "approved" | "rejected";
    adminNote?: string;
    createdAt: Date;
    updatedAt: Date;
}

const sellerApplicationSchema: Schema<ISellerApplication> = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // Section 1
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        dateOfBirth: { type: String },
        gender: { type: String },
        occupation: { type: String, required: true },
        occupationOther: { type: String },
        // Section 2
        country: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String },
        address: { type: String },
        // Section 3
        productCategory: [{ type: String }],
        productType: { type: String },
        // Section 4
        shopName: { type: String },
        shopCategory: { type: String },
        shopAddressType: { type: String },
        shopAddressOffline: { type: String },
        shopAddressOnline: [{ type: String }],
        shopAddressOther: { type: String },
        // Section 5
        onlinePresenceType: { type: String, default: "personal" },
        shopLinkedinUrl: { type: String },
        shopFacebookUrl: { type: String },
        shopYoutubeUrl: { type: String },
        shopPortfolioUrl: { type: String },
        personalLinkedinUrl: { type: String },
        personalFacebookUrl: { type: String },
        personalYoutubeUrl: { type: String },
        personalPortfolioUrl: { type: String },
        // Section 6
        whyJoin: { type: String },
        additionalInfo: { type: String },
        // Status
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        adminNote: { type: String },
    },
    { timestamps: true }
);

const sellerApplicationModel: Model<ISellerApplication> = mongoose.model(
    "SellerApplication",
    sellerApplicationSchema
);

export default sellerApplicationModel;
