import express from "express"
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { getNotification, updateNotification } from "../controllers/notification.controller";
import { updateAccessToken } from "../controllers/user.controller";

const notificationRouter = express.Router();

// get
notificationRouter.get('/getNotification', updateAccessToken, isAuthenticated, authorizeRoles("admin", "moderator"), getNotification);

// put
notificationRouter.put('/updateNotification/:id', updateAccessToken, isAuthenticated, authorizeRoles("admin", "moderator"), updateNotification);

export default notificationRouter;