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
exports.searchByQuery = exports.getPostById = exports.vote = exports.getPosts = exports.createPost = void 0;
const db_1 = __importDefault(require("../db"));
const appUrl_1 = require("../utils/appUrl");
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
        const post = (yield db_1.default.query("insert into posts (createdat, authorid, title, htmlbody, textbody, vector_document) values ($1, $2, $3, $4, $5, to_tsvector('english', $5 || ' ' || $3)) returning id, createdat, authorid, title, htmlbody, comments, upvotes, votes", [createdAt, authorId, title, htmlBody, textBody])).rows[0];
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
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { offset } = req.query;
        const posts = (yield db_1.default.query("select p.*, u.username from posts p join users u on p.authorid = u.id order by p.createdat desc limit 5 offset $1", [offset])).rows;
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
    try {
        const { postid, userid } = req.body;
        const updatedPost = (yield db_1.default.query("UPDATE posts SET upvotes = upvotes + (CASE WHEN $2::int = ANY(votes) THEN -1 ELSE 1 END), votes = (CASE WHEN $2::int = ANY(votes) THEN array_remove(votes, $2::int) ELSE array_append(votes, $2::int) end) WHERE id = $1 returning *", [postid, userid])).rows[0];
        res
            .status(200)
            .json(postsResponseCreator(false, "vote updated", updatedPost));
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
const searchByQuery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.query;
        const { andStr, orStr } = (0, appUrl_1.tsQuery)(query);
        const posts = (yield db_1.default.query(`SELECT u.username, p.*, ts_rank(vector_document, to_tsquery($1::text)) AS rank FROM posts p join users u on u.id = p.authorid  WHERE vector_document @@ to_tsquery($2::text) OR vector_document @@ to_tsquery($3::text) ORDER BY rank DESC`, [andStr, andStr, orStr])).rows;
        res.status(200).json(postsResponseCreator(false, "Data recieved", posts));
    }
    catch (error) {
        console.log(error);
        res.status(400).json(postsResponseCreator(false, error.message));
    }
});
exports.searchByQuery = searchByQuery;
