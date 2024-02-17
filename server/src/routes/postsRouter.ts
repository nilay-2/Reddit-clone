import express from "express";
import { createPost, getPosts } from "../controllers/postsController";
import { verify } from "../controllers/authController";
const postsRouter: express.Router = express.Router();

// get all posts
postsRouter.route("/").get(getPosts);

// verify if user is logged in
postsRouter.use(verify);

postsRouter.route("/createpost").post(createPost);

export default postsRouter;
