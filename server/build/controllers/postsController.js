"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = void 0;
const db_1 = __importDefault(require("../db"));
const postsResponseCreator = (error, message, data = null) => {
    return { error: error, message: message, data: data };
};
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // create new post
        const { createdAt, authorId, title, htmlBody, textBody } = req.body;
        const post = (yield db_1.default.query("insert into posts (createdat, authorid, title, htmlbody, textbody) values ($1, $2, $3, $4, $5) returning id, createdat, authorid, title, htmlbody, comments, upvotes, downvotes", [createdAt, authorId, title, htmlBody, textBody])).rows[0];
        res
            .status(200)
            .json(postsResponseCreator(false, "Post created successfully", post));
    }
    catch (error) {
        console.log(error);
        res.status(400).json(postsResponseCreator(true, "Please try again later"));
    }
});
exports.createPost = createPost;
