import express from "express";
import { createPost } from "../controllers/postsController";
import { verify } from "../controllers/authController";
const postsRouter: express.Router = express.Router();

// verify if user is logged in
postsRouter.use(verify);

postsRouter.route("/createpost").post(createPost);

export default postsRouter;
