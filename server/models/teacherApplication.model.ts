import mongoose, { Document, Model, Schema } from "mongoose";

export interface IEducation {
    institutionName: string;
    degree: string;
    fieldOfStudy: string;
    startMonth: string;
    startYear: string;
    endMonth: string;
    endYear: string;
    grade: string;
    certificate?: string;
}

export interface ITeacherApplication extends Document {
    userId: mongoose.Types.ObjectId;
    // Section 1 — Personal Information
    fullName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth?: string;
    gender?: string;
    // Section 2 — Location
    country: string;
    city: string;
    postalCode?: string;
    address?: string;
    // Section 3 — Education
    education: IEducation[];
    // Section 4 — Teaching Details
    subjectsToTeach: string;
    teachingExperience: string;
    preferredClassFormat: string;
    preferredLanguage: string;
    // Section 5 — Online Presence (optional)
    linkedinUrl?: string;
    facebookUrl?: string;
    youtubeUrl?: string;
    portfolioUrl?: string;
    // Section 6 — Additional Information
    whyJoin?: string;
    // Status
    status: "pending" | "approved" | "rejected";
    adminNote?: string;
    createdAt: Date;
    updatedAt: Date;
}

const educationSchema: Schema<IEducation> = new mongoose.Schema({
    institutionName: { type: String, required: true },
    degree: { type: String, required: true },
    fieldOfStudy: { type: String, required: true },
    startMonth: { type: String, required: true },
    startYear: { type: String, required: true },
    endMonth: { type: String, required: true },
    endYear: { type: String, required: true },
    grade: { type: String },
    certificate: { type: String },
});

const teacherApplicationSchema: Schema<ITeacherApplication> = new mongoose.Schema(
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
        // Section 2
        country: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String },
        address: { type: String },
        // Section 3
        education: [educationSchema],
        // Section 4
        subjectsToTeach: { type: String, required: true },
        teachingExperience: { type: String, required: true },
        preferredClassFormat: { type: String, required: true },
        preferredLanguage: { type: String, required: true },
        // Section 5
        linkedinUrl: { type: String },
        facebookUrl: { type: String },
        youtubeUrl: { type: String },
        portfolioUrl: { type: String },
        // Section 6
        whyJoin: { type: String },
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

const teacherApplicationModel: Model<ITeacherApplication> = mongoose.model(
    "TeacherApplication",
    teacherApplicationSchema
);

export default teacherApplicationModel;
