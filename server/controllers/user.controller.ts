require("dotenv").config();
import { log } from "console";
import ejs from "ejs";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import path from "path";
import { catchAsyncError } from "../middleware/catchAsyncError";
import userModel, { IUser } from "../models/user.model";
import {
  getAllUsersService,
  getUserById,
  updateUserRoleService,
} from "../services/user.service";
import ErrorHandler from "../utils/errorHandler";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/jwt";
import { redis } from "../utils/redis";
import sendEmail from "../utils/sendEmail";
import cloudinary from "cloudinary";
import fs from "fs";
import { getIO } from "../socketServer";

// register user
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const registrationUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exist", 400));
      }

      const user: IRegistrationBody = {
        name,
        email,
        password,
      };

      const activationToken = createActicationToken(user);

      const activationCode = activationToken.activationCode;

      const data = { user: { name: user.name }, activationCode };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activationMail.ejs"),
        data
      );

      // send email
      try {
        await sendEmail({
          email: user.email,
          subject: "Activate your account.",
          template: "activationMail.ejs",
          data,
        });

        res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to activate your account!`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// activation token
interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActicationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET_KEY as Secret,
    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};

// activate user
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;

      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET_KEY as string
      ) as { user: IUser; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }

      const { name, email, password } = newUser.user;

      const existUser = await userModel.findOne({ email });

      if (existUser) {
        return next(new ErrorHandler("Email already exist.", 400));
      }

      let user;
      try {
        user = await userModel.create({
          name,
          email,
          password,
        });
      } catch (error: any) {
        if (error.code === 11000) {
          return next(new ErrorHandler("Email already exist.", 400));
        }
        return next(new ErrorHandler(error.message, 400));
      }

      sendToken(user, 201, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// login user
interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(
          new ErrorHandler("Please enter your email and password.", 400)
        );
      }

      // Check if account is locked
      const isLocked = await redis.get(`lockout:${email}`);
      if (isLocked) {
        return next(new ErrorHandler("Account is locked due to too many failed attempts. Please try again after 15 minutes.", 400));
      }

      const user = await userModel.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Invalid email or password.", 400));
      }

      const isPasswordMatch = await user.comparePassword(password);

      if (!isPasswordMatch) {
        // Increment failed attempts
        const attempts = await redis.incr(`attempts:${email}`);
        if (attempts === 1) {
          await redis.expire(`attempts:${email}`, 1800); // 30 minutes window
        }

        if (attempts >= 5) {
          await redis.set(`lockout:${email}`, "locked", "EX", 900); // Lock for 15 minutes
          await redis.del(`attempts:${email}`);
          return next(new ErrorHandler("Too many failed attempts. Your account has been locked for 15 minutes.", 400));
        }

        return next(new ErrorHandler(`Invalid email or password. ${5 - attempts} attempts remaining.`, 400));
      }

      // Clear attempts on successful login
      await redis.del(`attempts:${email}`);
      await redis.del(`lockout:${email}`);

      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// logout user
export const logoutUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      const userId = req.user?._id || "";

      redis.del(userId);
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update access token
export const updateAccessToken = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;

      const message = "Could not refresh token.";
      if (!decoded) {
        return next(new ErrorHandler(message, 400));
      }

      const session = await redis.get(decoded.id as string);
      if (!session) {
        return next(
          new ErrorHandler("Please login to access this resource.", 400)
        );
      }

      const user = JSON.parse(session);

      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        {
          expiresIn: "5m",
        }
      );

      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        {
          expiresIn: "3d",
        }
      );

      req.user = user;

      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);

      await redis.set(user._id, JSON.stringify(user), "EX", 604800); // expire in 7 days

      next();
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get user info (after using ._id it gives an err)
export const getUserInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id?.toString();
      const superAdminEmail = "fahimshahriyar.dev@gmail.com";

      if (userId) {
        // Special logic: Ensure hardcoded email is superadmin
        if (req.user?.email === superAdminEmail && req.user?.role !== "superadmin") {
          const user = await userModel.findById(userId);
          if (user) {
            user.role = "superadmin";
            await user.save();
            await redis.set(userId, JSON.stringify(user), "EX", 604800);
            req.user = user;
          }
        }
        // Check if user has password set
        const userWithPassword = await userModel.findById(userId).select("+password");
        const hasPassword = !!userWithPassword?.password;

        // Get user from redis/db via service
        const userJson = await redis.get(userId);
        if (userJson) {
          const user = JSON.parse(userJson);
          res.status(200).json({
            success: true,
            user: { ...user, hasPassword }
          });
        } else {
          await getUserById(userId, res);
        }
      } else {
        return next(new ErrorHandler("User ID is not available.", 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// social auth
interface ISocialAuth {
  email: string;
  name: string;
  avatar: string;
  provider?: string;
}

export const socialAuth = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar, provider } = req.body as ISocialAuth;
      
      // Validate required fields
      if (!email || !name) {
        return next(new ErrorHandler("Email and name are required for social authentication.", 400));
      }
      
      let user = await userModel.findOne({ email });
      
      if (!user) {
        try {
          // Create new user for social auth
          user = await userModel.create({ 
            email, 
            name, 
            avatar: {
              public_id: "",
              url: avatar || ""
            },
            isVarified: true, // Social auth users are automatically verified
            provider: provider || "manual", // Track the provider
          });
          
          console.log(`New user created via ${provider} auth:`, user.email);
        } catch (error: any) {
          if (error.code === 11000) {
            // User was likely created by a concurrent request, fetch it
            user = await userModel.findOne({ email });
            if (!user) {
              return next(new ErrorHandler("User creation failed due to conflict.", 400));
            }
          } else {
            return next(new ErrorHandler(error.message, 400));
          }
        }
      } else {
        // Update existing user's info if needed
        let needsUpdate = false;
        
        if (user.name !== name) {
          user.name = name;
          needsUpdate = true;
        }
        
        if (avatar && user.avatar?.url !== avatar) {
          user.avatar = {
            public_id: user.avatar?.public_id || "",
            url: avatar
          };
          needsUpdate = true;
        }
        
        if (needsUpdate) {
          await user.save();
          console.log(`User updated via ${provider} auth:`, user.email);
        }
      }
      
      // Send tokens and user data
      sendToken(user, 200, res);
      
    } catch (error: any) {
      console.error("Social auth error:", error);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user info
interface IUpdateUserinfo {
  name?: string;
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
}

export const updateUserInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        name, phone, dob, gender, country, cityDistrict, postalCode,
        currentLevel, institutionName, takenOnlineCourseBefore,
        heardAboutClass, goal, goalTags
      } = req.body as IUpdateUserinfo;
      const userId = req.user?._id?.toString();
      const user = await userModel.findById(userId);

      if (user) {
        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (dob !== undefined) user.dob = dob;
        if (gender !== undefined) user.gender = gender;
        if (country !== undefined) user.country = country;
        if (cityDistrict !== undefined) user.cityDistrict = cityDistrict;
        if (postalCode !== undefined) user.postalCode = postalCode;
        if (currentLevel !== undefined) user.currentLevel = currentLevel;
        if (institutionName !== undefined) user.institutionName = institutionName;
        if (takenOnlineCourseBefore !== undefined) user.takenOnlineCourseBefore = takenOnlineCourseBefore;
        if (heardAboutClass !== undefined) user.heardAboutClass = heardAboutClass;
        if (goal !== undefined) user.goal = goal;
        if (goalTags !== undefined) user.goalTags = goalTags;
      }

      await user?.save();

      if (userId) {
        await redis.set(userId, JSON.stringify(user));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user password
interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const updatePassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;
      const user = await userModel.findById(req.user?._id).select("+password");

      const isPasswordSet = !!user?.password;

      if (!isPasswordSet) {
        // User doesn't have a password yet (social login)
        if (!newPassword) {
          return next(new ErrorHandler("Please enter a new password.", 400));
        }
      } else {
        // User already has a password, must provide old password
        if (!oldPassword || !newPassword) {
          return next(
            new ErrorHandler("Please enter old and new password.", 400)
          );
        }

        const isPassword = await user?.comparePassword(oldPassword);
        if (!isPassword) {
          return next(new ErrorHandler("Invalid old password.", 400));
        }
      }

      // update password
      user.password = newPassword;

      await user.save();

      const userId = req.user?._id?.toString();
      if (userId) {
        // Fetch fresh user data and update redis
        const updatedUser = await userModel.findById(userId);
        await redis.set(userId, JSON.stringify(updatedUser));
      }

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update profile picture
export const updateProfilePicture = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      const user = await userModel.findById(userId);

      if (!user) {
        return next(new ErrorHandler("User not found.", 404));
      }

      // Check if file was uploaded
      if (!req.file) {
        return next(new ErrorHandler("Please select an image to upload.", 400));
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return next(new ErrorHandler("Please upload a valid image file (JPEG, PNG, WebP).", 400));
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (req.file.size > maxSize) {
        return next(new ErrorHandler("Image size should be less than 5MB.", 400));
      }

      // Convert buffer to base64 for Cloudinary upload
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

      // If user has existing avatar, delete it first
      if (user?.avatar?.public_id) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      }

      // Upload new image to Cloudinary
      const uploadResult = await cloudinary.v2.uploader.upload(base64Image, {
        folder: "avatars",
        width: 150,
        height: 150,
        crop: "fill",
        quality: "auto",
        fetch_format: "auto"
      });

      // Update user avatar
      user.avatar = {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      };

      await user.save();

      // Update Redis cache
      await redis.set(userId.toString(), JSON.stringify(user));

      res.status(200).json({
        success: true,
        message: "Profile picture updated successfully!",
        user,
      });
    } catch (error: any) {
      console.log("Profile picture update error:", error);
      return next(new ErrorHandler(error.message || "Failed to update profile picture.", 500));
    }
  }
);

// get all teachers --- public
export const getTeachers = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teachers = await userModel.find({ role: "teacher" }).sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        teachers,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get all users --- only for admin
export const getAllUsers = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllUsersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user role (admin only)
export const updateUserRole = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, role } = req.body;
      const currentUser = req.user;
      const superAdminEmail = "fahimshahriyar.dev@gmail.com";

      if (!email || !role) {
        return next(new ErrorHandler("Please provide email and role.", 400));
      }

      const user = await userModel.findOne({ email });

      if (!user) {
        return next(
          new ErrorHandler(`User with email ${email} not found.`, 404)
        );
      }

      // Prevent users from changing their own role
      if (user._id.toString() === currentUser?._id.toString()) {
        return next(new ErrorHandler("You cannot change your own role.", 400));
      }

      // Super Admin restrictions
      // 1. Only superadmin can change a superadmin's role (by promoting someone else)
      // 2. Only superadmin can promote someone to superadmin
      if (user.role === "superadmin" && currentUser?.role !== "superadmin") {
        return next(new ErrorHandler("Only the Super Admin can change a Super Admin's role.", 403));
      }

      if (role === "superadmin" && currentUser?.role !== "superadmin") {
        // Special case: if the hardcoded email is being promoted to superadmin for the first time by an admin
        // we might allow it if no other superadmin exists, but the user said "make this email super admin".
        // Let's just allow the current admin to make THIS SPECIFIC email a superadmin if there's no superadmin yet.
        const existingSuperAdmin = await userModel.findOne({ role: "superadmin" });
        if (existingSuperAdmin && email !== superAdminEmail) {
             return next(new ErrorHandler("Only the Super Admin can promote another user to Super Admin.", 403));
        }
        // If it's the target email and no superadmin exists, or if it's the target email and current user is admin, 
        // we could allow it, but the instruction is "super admin can change everyone's role".
        // I will just make the specific email superadmin if the current user is an admin and target is that email.
        if (email !== superAdminEmail && currentUser?.role !== "superadmin") {
            return next(new ErrorHandler("Only the Super Admin can promote another user to Super Admin.", 403));
        }
      }

      // If promoting someone to superadmin, demote the current superadmin
      let demotedSuperAdminId: string | null = null;
      if (role === "superadmin") {
        const currentSuperAdmin = await userModel.findOne({ role: "superadmin" });
        if (currentSuperAdmin && currentSuperAdmin.email !== email) {
          demotedSuperAdminId = currentSuperAdmin._id.toString();
          currentSuperAdmin.role = "admin";
          await currentSuperAdmin.save();
          await redis.set(currentSuperAdmin._id.toString(), JSON.stringify(currentSuperAdmin), "EX", 604800);
        }
      }

      // Moderator restrictions
      if (currentUser?.role === "moderator") {
        if (user.role === "admin") {
          return next(new ErrorHandler("Moderators cannot update the role of an admin.", 403));
        }
        if (role === "admin" || role === "superadmin") {
          return next(new ErrorHandler("Moderators cannot promote a user to admin or superadmin.", 403));
        }
      }

      await updateUserRoleService(res, user._id, role);

      // Socket.IO real-time update
      const io = getIO();
      if (io) {
        // Notify all clients about the newly promoted user
        io.emit("updateUserRole", { userId: user._id, role });
        // Also notify about the auto-demoted old superadmin (if any)
        if (demotedSuperAdminId) {
          io.emit("updateUserRole", { userId: demotedSuperAdminId, role: "admin" });
        }
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// delete user (admin only)
export const deleteUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const currentUser = req.user;

      const user = await userModel.findById(id);

      if (!user) {
        return next(new ErrorHandler("User not found.", 400));
      }

      // Moderator restrictions
      if (currentUser?.role === "moderator" && user.role === "admin") {
        return next(new ErrorHandler("Moderators cannot delete an admin account.", 403));
      }

      if (user.role === "superadmin") {
        return next(new ErrorHandler("Super Admin account cannot be deleted.", 403));
      }

      if (user._id.toString() === currentUser?._id.toString()) {
        return next(new ErrorHandler("You cannot delete your own account.", 400));
      }

      await user.deleteOne({ _id: id });
      await redis.del(id);

      res.status(201).json({
        success: true,
        message: "User deleted successfully!",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const submitSurvey = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { description, ageGroup, reason, referral } = req.body;
      const userId = req.user?._id || req.user?.id;
      const user = await userModel.findById(userId);

      if (!user) {
        return next(new ErrorHandler("User not found.", 404));
      }

      user.surveyData = {
        description,
        ageGroup,
        reason,
        referral,
      };
      user.isSurveyCompleted = true;

      await user.save();

      if (userId) {
        await redis.set(userId, JSON.stringify(user));
      }

      res.status(200).json({
        success: true,
        message: "Survey submitted successfully!",
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
