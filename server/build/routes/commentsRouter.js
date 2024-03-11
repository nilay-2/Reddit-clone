"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentsController_1 = require("../controllers/commentsController");
const commentsRouter = express_1.default.Router();
// commentsRouter.use(verify);
commentsRouter
    .route("/post/:postId/comment")
    .post(commentsController_1.createComment)
    .get(commentsController_1.getAllComments);
commentsRouter.route("/post/:postId/comment/:commentId").delete(commentsController_1.deleteComment);
exports.default = commentsRouter;
