import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model";

interface IComment extends Document {
    user: IUser;
    question: string;
    answer?: string;
    questionReplies?: IComment[];
}

interface IReview extends Document {
    user: IUser;
    rating: number;
    comment: string;
    commentReplies?: IComment[];
}

interface ILink extends Document {
    title: string;
    url: string;
}

interface ICourseData extends Document {
    title: string;
    description: string;
    videoUrl: string;
    videoThumbnail: object;
    videoSec: string;
    videoLength: number;
    videoPlayer: string;
    suggetion: string;
    link: ILink[];
    questions: IComment[];
    // Live session fields
    startTime?: string;
    endTime?: string;
}

interface IMessage extends Document {
    adminId: string;
    adminName: string;
    text?: string;
    voice?: string;
    image?: { public_id: string; url: string };
    video?: { public_id: string; url: string };
    createdAt?: Date;
}

interface ICourse extends Document {
    name: string;
    title?: string;
    description?: string;
    categories: string;
    price: number;
    thumbnail: object;
    tags: string[];
    level: string;
    levelTo?: string;
    courseType: string;
    subCategory: string;
    demoUrl: string;
    sourceLinks: { title: string; url: string }[];
    discountCoupon: string;
    discountPercent?: number;
    couponExpiry?: string;
    daysPerWeek?: number;
    daysOfWeek?: string[];
    maxStudents?: number;
    teachers?: string[];
    enrolled?: mongoose.Types.ObjectId[];
    messages?: IMessage[];
    benefits: { title: string }[];
    prerequisites: { title: string }[];
    reviews: IReview[];
    courseData: ICourseData[];
    ratings?: number;
    purchased?: number;
    status?: string;
}

const reviewSchema = new Schema<IReview>({
    user: Object,
    rating: {
        type: Number,
        default: 0,
    },
    comment: String,
    commentReplies: [Object]
}, {timestamps: true});

const linkSchema = new Schema<ILink>({
    title: String,
    url: String
});

const commentSchema = new Schema<IComment>({
    user: Object,
    question: String,
    questionReplies: [Object]
}, {timestamps: true});

const courseDataSchema = new Schema<ICourseData>({
    title: Object,
    description: String,
    videoUrl: String,
    videoSec: String,
    videoLength: Number,
    videoPlayer: String,
    suggetion: String,
    link: [linkSchema],
    questions: [commentSchema],
    startTime: String,
    endTime: String,
});

const messageSchema = new Schema<IMessage>({
    adminId: String,
    adminName: String,
    text: String,
    voice: String,
    image: {
        public_id: String,
        url: String
    },
    video: {
        public_id: String,
        url: String
    },
    createdAt: Date
});

const sourceLinkSchema = new Schema({
    title: String,
    url: String
});

const courseSchema = new Schema<ICourse>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    categories: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    tags: [{
        type: String
    }],
    level: {
        type: String,
        required: true
    },
    levelTo: {
        type: String
    },
    courseType: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    demoUrl: {
        type: String,
        required: true
    },
    sourceLinks: [sourceLinkSchema],
    discountCoupon: {
        type: String
    },
    discountPercent: {
        type: Number
    },
    couponExpiry: {
        type: String
    },
    daysPerWeek: {
        type: Number
    },
    daysOfWeek: [{ type: String }],
    maxStudents: {
        type: Number
    },
    teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    enrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    benefits: [{ title: String }],
    prerequisites: [{ title: String }],
    messages: [messageSchema],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    ratings: {
        type: Number,
        default: 0
    },
    purchased: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["drafting", "pending", "active", "disabled"],
        default: "drafting"
    }
}, { timestamps: true });

const courseModel: Model<ICourse> = mongoose.model("Course", courseSchema);

export default courseModel;
