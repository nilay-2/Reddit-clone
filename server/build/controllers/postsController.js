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
exports.getPostById = exports.vote = exports.getPosts = exports.createPost = void 0;
const db_1 = __importDefault(require("../db"));
const postsResponseCreator = (error, message, data = null) => {
    return { error: error, message: message, data: data };
};
const votesResponseCreator = (error, message, data = null) => {
    return { error: error, message: message, data: data };
};
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // create new post
        const { createdAt, authorId, title, htmlBody, textBody } = req.body;
        const post = (yield db_1.default.query("insert into posts (createdat, authorid, title, htmlbody, textbody) values ($1, $2, $3, $4, $5) returning id, createdat, authorid, title, htmlbody, comments, upvotes", [createdAt, authorId, title, htmlBody, textBody])).rows[0];
        res
            .status(200)
            .json(postsResponseCreator(false, "Post created successfully", post));
    }
    catch (error) {
        console.log(error);
        res.status(400).json(postsResponseCreator(true, error.message));
    }
});
exports.createPost = createPost;
const getPosts = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = (yield db_1.default.query("select p.*, u.username from posts p join users u on p.authorid = u.id order by p.createdat desc")).rows;
        res
            .status(200)
            .json(postsResponseCreator(false, "Posts retreived successfully", posts));
    }
    catch (error) {
        console.log(error);
        res
            .status(400)
            .json(postsResponseCreator(true, error.message, []));
    }
});
exports.getPosts = getPosts;
const vote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { postid, userid, isupvote } = req.body;
        const post = (yield db_1.default.query("select votes from posts where id = $1", [postid])).rows[0];
        const isAlreadyLiked = (_a = post.votes) === null || _a === void 0 ? void 0 : _a.find((vote) => {
            return vote === userid;
        });
        if (isAlreadyLiked) {
            const updatedPost = (yield db_1.default.query("update posts set upvotes = upvotes - 1, votes = array_remove(votes, $1) where id = $2 returning *", [userid, postid])).rows[0];
            res
                .status(200)
                .json(postsResponseCreator(false, "Removed a like", updatedPost));
        }
        else {
            const updatedPost = (yield db_1.default.query("update posts set upvotes = upvotes + 1, votes = array_append(votes, $1) where id = $2 returning *", [userid, postid])).rows[0];
            res
                .status(200)
                .json(postsResponseCreator(false, "Added a like", updatedPost));
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json(votesResponseCreator(true, error.message));
    }
});
exports.vote = vote;
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const post = (yield db_1.default.query("select p.*, u.username from posts p join users u on p.authorid = u.id where p.id = $1", [postId])).rows[0];
        res
            .status(200)
            .json(postsResponseCreator(false, `Post received with id: ${postId}`, post));
    }
    catch (error) {
        console.log(error);
        res.status(400).json(postsResponseCreator(false, error.message));
    }
});
exports.getPostById = getPostById;
