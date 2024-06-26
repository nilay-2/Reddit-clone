"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postsController_1 = require("../controllers/postsController");
const authController_1 = require("../controllers/authController");
const postsRouter = express_1.default.Router();
// search for posts by query
postsRouter.route("/search").get(postsController_1.searchByQuery);
// get all posts
postsRouter.route("/").get(postsController_1.getPosts);
// get post by id
postsRouter.route("/:postId").get(postsController_1.getPostById);
// verify if user is logged in
postsRouter.use(authController_1.verify);
postsRouter.route("/createpost").post(postsController_1.createPost);
postsRouter.route("/vote").post(postsController_1.vote);
exports.default = postsRouter;
