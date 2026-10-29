import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICompany extends Document {
    name: string;
    logo?: {
        public_id?: string;
        url?: string;
    };
    website: string;
    createdAt: Date;
    updatedAt: Date;
}

const companySchema: Schema<ICompany> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Company name is required"],
            trim: true,
        },
        logo: {
            public_id: { type: String },
            url: { type: String },
        },
        website: {
            type: String,
            required: [true, "Website link is required"],
            trim: true,
        },
    },
    { timestamps: true }
);

const companyModel: Model<ICompany> = mongoose.model<ICompany>("Company", companySchema);

export default companyModel;
