import { Request } from "express";
import { IUser } from "../models/user.model";

declare module "hpp";

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}