import mongoose, { Document, Model, Schema } from "mongoose";

interface IReview extends Document {
    user: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    commentReplies?: IReview[];
}

export interface IEbook extends Document {
    name: string;
    author: string;
    description: string;
    price: number;
    discountCoupon?: string;
    discountPercent?: number;
    couponExpiry?: string;
    categories?: string;
    ebookType?: string;
    tags?: string[];
    pdfFile: {
        public_id: string;
        url: string;
    };
    thumbnail: {
        public_id: string;
        url: string;
    };
    status?: string;
    purchased: number;
    ratings: number;
    reviews: IReview[];
}

const reviewSchema = new Schema<IReview>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    comment: {
        type: String,
        required: true,
    },
    commentReplies: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
}, { timestamps: true });

const ebookSchema = new Schema<IEbook>({
    name: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discountCoupon: {
        type: String,
    },
    discountPercent: {
        type: Number,
    },
    couponExpiry: {
        type: String,
    },
    categories: {
        type: String,
    },
    ebookType: {
        type: String,
    },
    tags: [{
        type: String,
    }],
    pdfFile: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    thumbnail: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    status: {
        type: String,
        enum: ["drafting", "pending", "active", "disabled"],
        default: "drafting",
    },
    purchased: {
        type: Number,
        default: 0,
    },
    ratings: {
        type: Number,
        default: 0,
    },
    reviews: [reviewSchema],
}, { timestamps: true });

const ebookModel: Model<IEbook> = mongoose.model("Ebook", ebookSchema);

export default ebookModel;
