import { Request, Response, NextFunction } from "express";
import { catchAsyncError } from "./catchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import  jwt  from "jsonwebtoken";
import { redis } from "../utils/redis";

// Define a type for the JWT payload
interface JwtPayload {
    id: string;
}

// authenticated user
export const isAuthenticated = catchAsyncError(async( req: Request, res: Response, next: NextFunction ) => {
    const access_token = req.cookies.access_token

    if(!access_token) {
        return next(new ErrorHandler("Please login to access this resource.", 400));
    }

    let decoded: JwtPayload;

    try {
        decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload;
    } catch (error) {
        return next(new ErrorHandler("Access token is not valid.", 400));
    }

    const user = await redis.get(decoded.id);

    if(!user) {
        return next(new ErrorHandler("Please login to access this resource.", 400));
    }

    req.user = JSON.parse(user);

    next();
});

// validate user role
export const authorizeRoles = ( ...roles: string[] ) => {
    return ( req: Request, res: Response, next: NextFunction ) => {
        if (req.user?.role === 'superadmin') {
            return next();
        }
        if(!roles.includes(req.user?.role || '')) {
            return next(new ErrorHandler(`Role: ${req.user?.role} is not allowed to access this resource`, 403))
        }
        next();
    }
}