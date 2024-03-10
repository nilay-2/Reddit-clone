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
exports.getAllComments = exports.createComment = void 0;
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
            .json(commentsResponseCreator(true, "Something went wrong!"));
    }
});
exports.createComment = createComment;
const getAllComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const comments = (yield db_1.default.query("select c.*, u.username from comments c join users u on c.userid = u.id where c.postid = $1 order by createdat desc", [postId])).rows;
        res
            .status(200)
            .json(commentsResponseCreator(false, `Comments received for postId: ${postId}`, comments));
    }
    catch (error) {
        console.log(error);
        res.status(400).json(commentsResponseCreator(true, "Something went wrong"));
    }
});
exports.getAllComments = getAllComments;
