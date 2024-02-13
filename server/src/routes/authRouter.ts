import express from "express";
import {
  signUp,
  logIn,
  verify,
  allowUsersOnDashboard,
} from "../controllers/authController";

const authRouter: express.Router = express.Router();

authRouter.route("/signup").post(signUp);
authRouter.route("/login").post(logIn);
authRouter.route("/verify").get(verify, allowUsersOnDashboard);

export default authRouter;
