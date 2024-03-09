import express from "express";
import { verify } from "../controllers/authController";
import { createComment } from "../controllers/commentsController";
const commentsRouter: express.Router = express.Router();

commentsRouter.use(verify);

commentsRouter.route("/post/:postId/comment").post(createComment);

export default commentsRouter;
