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
exports.createComment = void 0;
const db_1 = __importDefault(require("../db"));
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const { userid, createdat, replyto, content } = req.body;
        const comment = yield db_1.default.query("insert into comments (postid, userid, replyto, content, createdat) values ($1, $2, $3, $4, $5)", [postId, userid, replyto, content, createdat]);
        res.status(200).json({
            error: false,
            message: "Data received",
            data: comment,
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            error: true,
            message: "Error",
        });
    }
});
exports.createComment = createComment;
