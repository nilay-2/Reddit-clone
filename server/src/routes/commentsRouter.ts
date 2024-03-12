import express from "express";
import { verify } from "../controllers/authController";
import {
  createComment,
  getAllComments,
  deleteComment,
  createReply,
} from "../controllers/commentsController";
const commentsRouter: express.Router = express.Router();

commentsRouter.use(verify);

commentsRouter
  .route("/post/:postId/comment")
  .post(createComment)
  .get(getAllComments);

commentsRouter.route("/post/:postId/comment/:commentId").delete(deleteComment);

commentsRouter
  .route("/post/:postId/comment/:commentId/reply")
  .post(createReply);

export default commentsRouter;
