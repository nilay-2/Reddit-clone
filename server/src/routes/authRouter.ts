import express from "express";
import { signUp, logIn, verify } from "../controllers/authController";

const authRouter: express.Router = express.Router();

authRouter.route("/signup").post(signUp);
authRouter.route("/login").post(logIn);
authRouter.route("/verify").get(verify);

export default authRouter;
