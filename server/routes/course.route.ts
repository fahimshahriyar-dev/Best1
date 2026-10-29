import express from "express"
import { addAnswer, addQuestion, addReview, addReviewReply, deleteCourse, editCourse, generateVideoUrl, getAllCourses, getAllCourses_Admin, getCourseContent, getSingleCourse, uploadCourse, editQuestion, deleteQuestion, editAnswer, deleteAnswer, updateCourseStatus, sendCourseMessage, deleteCourseMessage, editCourseMessage } from "../controllers/course.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { updateAccessToken } from "../controllers/user.controller";

const courseRouter = express.Router();

// post
courseRouter.post("/createCourse", updateAccessToken, isAuthenticated, authorizeRoles("admin", "moderator"), uploadCourse);

courseRouter.post("/getVdoCipherOTP", generateVideoUrl);

// get
courseRouter.get("/getCourse/:id", getSingleCourse);

courseRouter.get("/getCourses", getAllCourses);

courseRouter.get("/getCourseContent/:id", updateAccessToken, isAuthenticated, getCourseContent);

courseRouter.get("/getAllCourses", updateAccessToken, isAuthenticated, authorizeRoles("admin", "moderator"), getAllCourses);

courseRouter.get("/getAllCourses-admin", updateAccessToken, isAuthenticated, authorizeRoles("admin", "moderator"), getAllCourses_Admin);

// put

courseRouter.put("/addQuestion", updateAccessToken, isAuthenticated, addQuestion);

courseRouter.put("/addAnswer", updateAccessToken, isAuthenticated, addAnswer);

courseRouter.put("/addReview/:id", updateAccessToken, isAuthenticated, addReview);

courseRouter.put("/addReviewReply", updateAccessToken, isAuthenticated, authorizeRoles("admin", "moderator"), addReviewReply);

courseRouter.put("/editQuestion", updateAccessToken, isAuthenticated, editQuestion);

courseRouter.delete("/deleteQuestion/:courseId/:contentId/:questionId", updateAccessToken, isAuthenticated, deleteQuestion);

courseRouter.put("/editAnswer", updateAccessToken, isAuthenticated, editAnswer);

courseRouter.delete("/deleteAnswer/:courseId/:contentId/:questionId/:answerId", updateAccessToken, isAuthenticated, deleteAnswer);

courseRouter.put("/editCourse/:id", updateAccessToken, isAuthenticated, authorizeRoles("admin", "moderator"), editCourse);

courseRouter.put("/updateCourseStatus/:id", updateAccessToken, isAuthenticated, authorizeRoles("admin", "moderator"), updateCourseStatus);

// live course messaging
courseRouter.post("/send-course-message/:id", updateAccessToken, isAuthenticated, authorizeRoles("admin", "moderator", "teacher"), sendCourseMessage);
courseRouter.delete("/delete-course-message/:id/:messageId", updateAccessToken, isAuthenticated, authorizeRoles("admin", "moderator", "teacher"), deleteCourseMessage);
courseRouter.put("/edit-course-message/:id/:messageId", updateAccessToken, isAuthenticated, authorizeRoles("admin", "moderator", "teacher"), editCourseMessage);

// delete
courseRouter.delete("/deleteCourse/:id", updateAccessToken, isAuthenticated, authorizeRoles("admin", "moderator"), deleteCourse);

export default courseRouter;