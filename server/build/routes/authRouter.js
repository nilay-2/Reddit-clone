"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authRouter = express_1.default.Router();
authRouter.route("/signup").post(authController_1.signUp);
authRouter.route("/login").post(authController_1.logIn);
authRouter.route("/verify").get(authController_1.verify);
exports.default = authRouter;
