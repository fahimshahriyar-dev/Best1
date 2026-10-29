import express from "express"
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { createLayout, editLayout, getLayoutByType } from "../controllers/layout.controller";
import { updateAccessToken } from "../controllers/user.controller";

const layoutRouter = express.Router();

// post
layoutRouter.post('/createLayout', updateAccessToken, isAuthenticated, authorizeRoles("admin", "moderator"), createLayout);

// get
layoutRouter.get('/getLayout/:type', getLayoutByType);

// put
layoutRouter.put('/editLayout', updateAccessToken, isAuthenticated, authorizeRoles("admin", "moderator"), editLayout);

export default layoutRouter;