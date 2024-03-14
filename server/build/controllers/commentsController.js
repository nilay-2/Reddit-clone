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
exports.getReply = exports.createReply = exports.deleteComment = exports.getAllComments = exports.createComment = void 0;
const db_1 = __importDefault(require("../db"));
const commentsResponseCreator = (error, message, data = null) => {
    return { error: error, message: message, data: data };
};
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const { userid, createdat, replyto, content } = req.body;
        yield db_1.default.query("BEGIN");
        const comment = (yield db_1.default.query("insert into comments (postid, userid, replyto, content, createdat) values ($1, $2, $3, $4, $5) returning *", [postId, userid, replyto, content, createdat])).rows[0];
        yield db_1.default.query("update posts set comments = comments + 1 where id = $1", [postId]);
        yield db_1.default.query("COMMIT");
        res
            .status(200)
            .json(commentsResponseCreator(false, `Comment created for postid: ${postId}`, comment));
    }
    catch (error) {
        yield db_1.default.query("ROLLBACK");
        console.log(error);
        res
            .status(400)
            .json(commentsResponseCreator(true, error.message));
    }
});
exports.createComment = createComment;
const getAllComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const comments = (yield db_1.default.query("select c.*, u.username from comments c join users u on c.userid = u.id where c.postid = $1 and c.replyto is null order by createdat asc", [postId])).rows;
        res
            .status(200)
            .json(commentsResponseCreator(false, `Comments received for postId: ${postId}`, comments));
    }
    catch (error) {
        console.log(error);
        res
            .status(400)
            .json(commentsResponseCreator(true, error.message));
    }
});
exports.getAllComments = getAllComments;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId, postId } = req.params;
        const { replyTo } = req.body;
        yield db_1.default.query("BEGIN");
        const deletedComment = (yield db_1.default.query("delete from comments where id = $1 returning id", [
            commentId,
        ])).rows[0];
        yield db_1.default.query("update posts set comments = comments - 1 where id = $1", [postId]);
        yield db_1.default.query("COMMIT");
        res
            .status(200)
            .json(commentsResponseCreator(false, "Comment delete successfully", deletedComment));
    }
    catch (error) {
        yield db_1.default.query("ROLLBACK");
        console.log(error);
        res
            .status(400)
            .json(commentsResponseCreator(true, error.message));
    }
});
exports.deleteComment = deleteComment;
const createReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId, commentId } = req.params;
        const { createdAt, content } = req.body;
        yield db_1.default.query("BEGIN");
        const reply = (yield db_1.default.query("insert into comments (postid, userid, replyto, content, createdat) values ($1, $2, $3, $4, $5) returning *", [postId, req.user.id, commentId, content, createdAt])).rows[0];
        yield db_1.default.query("update comments set replies = replies + 1 where id = $1", [commentId]);
        yield db_1.default.query("update posts set comments = comments + 1 where id = $1", [postId]);
        yield db_1.default.query("COMMIT");
        res.status(200).json(commentsResponseCreator(false, "Reply added", reply));
    }
    catch (error) {
        yield db_1.default.query("ROLLBACK");
        console.log(error);
        res
            .status(400)
            .json(commentsResponseCreator(true, error.message));
    }
});
exports.createReply = createReply;
const getReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId } = req.params;
        const replies = (yield db_1.default.query("select * from comments where replyto = $1", [
            commentId,
        ])).rows;
        res
            .status(200)
            .json(commentsResponseCreator(false, "Replies received", replies));
    }
    catch (error) {
        console.log(error);
        res
            .status(400)
            .json(commentsResponseCreator(true, error.message));
    }
});
exports.getReply = getReply;
