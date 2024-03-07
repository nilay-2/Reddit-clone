import express from "express";
import { createPost, getPosts, vote } from "../controllers/postsController";
import { verify } from "../controllers/authController";
const postsRouter: express.Router = express.Router();

// get all posts
postsRouter.route("/").get(getPosts);

// verify if user is logged in
postsRouter.use(verify);

postsRouter.route("/createpost").post(createPost);

postsRouter.route("/vote").post(vote);

export default postsRouter;
