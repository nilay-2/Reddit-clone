import express from "express";
import { verify } from "../controllers/authController";
import {
  createComment,
  getAllComments,
  deleteComment,
  createReply,
  getReply,
} from "../controllers/commentsController";
const commentsRouter: express.Router = express.Router();

commentsRouter.route("/post/:postId/comment").get(getAllComments);

commentsRouter.route("/replies/:commentId").get(getReply);

commentsRouter.use(verify);

commentsRouter.route("/post/:postId/comment").post(createComment);

commentsRouter.route("/post/:postId/comment/:commentId").delete(deleteComment);

commentsRouter
  .route("/post/:postId/comment/:commentId/reply")
  .post(createReply);

export default commentsRouter;
