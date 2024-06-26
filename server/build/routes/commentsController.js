"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const commentsController_1 = require("../controllers/commentsController");
const commentsRouter = express_1.default.Router();
commentsRouter.use(authController_1.verify);
commentsRouter.route("/post/:postId/comment").post(commentsController_1.createComment);
exports.default = commentsRouter;
