import express from "express";
import {
  activateUser,
  deleteUser,
  getAllUsers,
  getTeachers,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  socialAuth,
  updateAccessToken,
  updatePassword,
  updateProfilePicture,
  updateUserInfo,
  updateUserRole,
  submitSurvey,
} from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { upload, handleMulterError } from "../middleware/multer";

const userRouter = express.Router();

// post
userRouter.post("/registration", registrationUser);

userRouter.post("/activationMail", activateUser);

userRouter.post("/login", loginUser);

userRouter.post("/socialAuth", socialAuth);

// get
userRouter.get("/logout", updateAccessToken, isAuthenticated, logoutUser);

userRouter.get("/refreshToken", updateAccessToken);

userRouter.get("/me", updateAccessToken, isAuthenticated, getUserInfo);

userRouter.get("/getTeachers", getTeachers);

userRouter.get(
  "/getUsers",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin", "moderator", "teacher"),
  getAllUsers
);

// put
userRouter.put(
  "/updateUserInfo",
  updateAccessToken,
  isAuthenticated,
  updateUserInfo
);

userRouter.put(
  "/updatePassword",
  updateAccessToken,
  isAuthenticated,
  updatePassword
);

userRouter.put(
  "/updateProfilePic",
  updateAccessToken,
  isAuthenticated,
  upload.single("avatar"),
  handleMulterError,
  updateProfilePicture
);

userRouter.put(
  "/updateUserRole",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin", "moderator"),
  updateUserRole
);

userRouter.put(
  "/submit-survey",
  updateAccessToken,
  isAuthenticated,
  submitSurvey
);

// delete
userRouter.delete(
  "/deleteUser/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin", "moderator"),
  deleteUser
);

export default userRouter;
