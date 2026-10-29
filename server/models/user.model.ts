require('dotenv').config();
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// interface
export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    avatar: {
        public_id: string;
        url: string;
    };
    role: string;
    isVarified: boolean;
    courses: Array<{courseId: string; courseType?: string; categories?: string; subCategories?: string}>;
    ebooks: Array<{ebookId: string}>;
    provider?: string;
    isSurveyCompleted?: boolean;
    surveyData?: {
        description: string;
        ageGroup: string;
        reason: string[];
        referral: string;
    };
    phone?: string;
    dob?: string;
    gender?: string;
    country?: string;
    cityDistrict?: string;
    postalCode?: string;
    currentLevel?: string;
    institutionName?: string;
    takenOnlineCourseBefore?: string;
    heardAboutClass?: string;
    goal?: string;
    goalTags?: string[];
    comparePassword: (password: string) => Promise<boolean>;
    SignAccessToken: () => string;
    SignRefreshToken: () => string;
}

// schema
const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name."]
    },
    email: {
        type: String,
        required: [true, "Please enter your email."],
        validate: {
            validator: function(value: string) {
                return emailRegexPattern.test(value);
            },
            message: "Your email is not valid."
        },
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        minlength: [8, "Password must be at least 8 characters."],
        select: false
    },
    avatar: {
        public_id: String,
        url: String
    },
    role: {
        type: String,
        default: "user"
    },
    isVarified: {
        type: Boolean,
        default: false
    },
    courses: [
        {
            courseId: String,
            courseType: String,
            categories: String,
            subCategories: String
        }
    ],
    ebooks: [
        {
            ebookId: String
        }
    ],
    provider: {
        type: String,
        default: "manual"
    },
    isSurveyCompleted: {
        type: Boolean,
        default: false
    },
    surveyData: {
        description: String,
        ageGroup: String,
        reason: [String],
        referral: String
    },
    phone: { type: String, default: "" },
    dob: { type: String, default: "" },
    gender: { type: String, default: "" },
    country: { type: String, default: "Bangladesh" },
    cityDistrict: { type: String, default: "" },
    postalCode: { type: String, default: "" },
    currentLevel: { type: String, default: "" },
    institutionName: { type: String, default: "" },
    takenOnlineCourseBefore: { type: String, default: "" },
    heardAboutClass: { type: String, default: "" },
    goal: { type: String, default: "" },
    goalTags: [{ type: String }],
}, {timestamps: true})

// hash password before saving
userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    if (this.password) {
        this.password = await bcrypt.hash(this.password as string, 12);
    }
    next();
});


// sign access token
userSchema.methods.SignAccessToken = function () {
    return jwt.sign({id: this._id}, process.env.ACCESS_TOKEN || '', {
        expiresIn: '5m'
    })
};

// sign refresh token
userSchema.methods.SignRefreshToken = function () {
    return jwt.sign({id: this._id}, process.env.REFRESH_TOKEN || '', {
        expiresIn: '3d'
    })
};

// compare password
userSchema.methods.comparePassword = async function(enteredPassword: string): Promise<boolean> {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

// userModel
const userModel: Model<IUser> = mongoose.model("User", userSchema);

export default userModel;