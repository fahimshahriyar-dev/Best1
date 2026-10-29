import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITopic {
    title: string;
}

export interface IModule {
    moduleTitle: string;
    topics: ITopic[];
}

export interface ITraining extends Document {
    title: string;
    description: string;
    thumbnail: { public_id: string; url: string };
    previewVideo: string;
    outcomes: { title: string }[];
    eligibility: { title: string }[];
    startDate: Date;
    endDate?: Date;
    duration: string;
    schedule: string;
    mode: "Online" | "Offline";
    meetingLink?: string;
    venue?: string;
    modules: IModule[];
    seatsTotal: number;
    trainerName: string;
    trainerDesignation: string;
    trainerBio: string;
    trainerPhoto: { public_id: string; url: string };
    trainerExperience: string;
    trainerLinkedin: string;
    price: number;
    isFree: boolean;
    inclusions: { title: string }[];
    status: "pending" | "active" | "disabled";
    createdAt: Date;
    updatedAt: Date;
}

const topicSchema: Schema<ITopic> = new mongoose.Schema({
    title: { type: String, required: true },
});

const moduleSchema: Schema<IModule> = new mongoose.Schema({
    moduleTitle: { type: String, required: true },
    topics: [topicSchema],
});

const trainingSchema: Schema<ITraining> = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        thumbnail: {
            public_id: { type: String },
            url: { type: String },
        },
        previewVideo: { type: String },
        outcomes: [{ title: { type: String } }],
        eligibility: [{ title: { type: String } }],
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        duration: { type: String, required: true },
        schedule: { type: String, required: true },
        mode: {
            type: String,
            enum: ["Online", "Offline"],
            required: true,
        },
        meetingLink: { type: String },
        venue: { type: String },
        modules: [moduleSchema],
        seatsTotal: { type: Number, required: true },
        trainerName: { type: String, required: true },
        trainerDesignation: { type: String, required: true },
        trainerBio: { type: String, required: true },
        trainerPhoto: {
            public_id: { type: String },
            url: { type: String },
        },
        trainerExperience: { type: String, required: true },
        trainerLinkedin: { type: String },
        price: { type: Number, required: true },
        isFree: { type: Boolean, default: false },
        inclusions: [{ title: { type: String } }],
        status: {
            type: String,
            enum: ["pending", "active", "disabled"],
            default: "pending",
        },
    },
    { timestamps: true }
);

const trainingModel: Model<ITraining> = mongoose.model(
    "Training",
    trainingSchema
);

export default trainingModel;
