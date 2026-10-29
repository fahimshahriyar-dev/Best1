import { Document, model, Schema, Types } from "mongoose";

interface FaqItem {
    question: string;
    answer: string;
    _id?: Types.ObjectId;
    active?: boolean;
}

interface Category {
    title: string;
}

interface BannerImage {
    public_id: string;
    url: string;
}

interface LayoutDocument extends Document {
    type: "Banner" | "FAQ" | "Categories" | "EbookCategories";
    faq?: FaqItem[];
    categories?: Category[];
    banner?: {
        image?: BannerImage;
        title?: string;
        subTitle?: string;
    };
}

const faqSchema = new Schema<FaqItem>({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    _id: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
    active: {
        type: Boolean,
        default: false,
    }
});

const categorySchema = new Schema<Category>({
    title: {
        type: String,
        required: true
    }
});

const bannerImageSchema = new Schema<BannerImage>({
    public_id: {
        type: String
    },
    url: {
        type: String
    }
});

const layoutSchema = new Schema<LayoutDocument>(
    {
        type: {
            type: String,
            required: true,
            enum: ["Banner", "FAQ", "Categories", "EbookCategories"]
        },
        faq: [faqSchema],
        categories: [categorySchema],
        banner: {
            image: bannerImageSchema,
            title: {
                type: String
            },
            subTitle: {
                type: String
            }
        }
    },
    { timestamps: true }
);

const layoutModel = model<LayoutDocument>("Layout", layoutSchema);

export default layoutModel;