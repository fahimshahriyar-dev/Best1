require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
const xss = require("xss-clean");
import hpp from "hpp";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notifications.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";

import teacherApplicationRouter from "./routes/teacherApplication.route";
import sellerApplicationRouter from "./routes/sellerApplication.route";
import consultancyRouter from "./routes/consultancy.route";
import ebookRouter from "./routes/ebook.route";
import learningGoalTagRouter from "./routes/learningGoalTag.route";
import courseTagRouter from "./routes/courseTag.route";
import ebookTagRouter from "./routes/ebookTag.route";
import discountCouponRouter from "./routes/discountCoupon.route";
import trainingRouter from "./routes/training.route";
import companyRouter from "./routes/company.route";

// security headers
app.use(helmet());

// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());

// cors (cross origins resourse sharing)
const defaultAllowedOrigins = [
    "http://localhost:3000",
    "https://best1.ai",
    "https://www.best1.ai",
];

const parseOrigins = (originEnv?: string): string[] => {
    if (!originEnv) return defaultAllowedOrigins;
    try {
        if (originEnv.trim().startsWith("[")) {
            const parsed = JSON.parse(originEnv);
            if (Array.isArray(parsed)) return parsed.map((o) => o.trim());
        }
    } catch (e) {
        // fallback to comma separated
    }
    return originEnv.split(",").map((o) => o.trim().replace(/^['"]|['"]$/g, "")).filter(Boolean);
};

export const allowedOrigins = parseOrigins(process.env.ORIGIN);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps, curl, server-to-server)
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
                callback(null, true);
            } else {
                callback(new Error(`Origin ${origin} not allowed by CORS`));
            }
        },
        credentials: true,
    })
);

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// data sanitization against XSS
app.use(xss());

// prevent parameter pollution
app.use(hpp());

// rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use("/api/v1", limiter);

// routers
app.use("/api/v1", userRouter, courseRouter, orderRouter, notificationRouter, analyticsRouter, layoutRouter, teacherApplicationRouter, sellerApplicationRouter, consultancyRouter, ebookRouter, trainingRouter, learningGoalTagRouter, courseTagRouter, ebookTagRouter, discountCouponRouter, companyRouter);

// testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: "API is working.",
    });
});

// unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found.`) as any;
    next(err);
});

app.use(ErrorMiddleware);