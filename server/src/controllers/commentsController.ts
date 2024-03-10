import { Request, Response } from "express";
import client from "../db";
import { ServiceResponse } from "../utils/ResponseInterface";

interface Comment {
  id: number;
  postid: number;
  userid: number;
  content: string;
  replyto: number | null;
  createdat: number;
  replies: number;
}

interface CommentResponse extends ServiceResponse {
  data: Array<Comment> | null | Comment;
}

const commentsResponseCreator = (
  error: boolean,
  message: string,
  data: Array<Comment> | Comment | null = null
): CommentResponse => {
  return { error: error, message: message, data: data };
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { userid, createdat, replyto, content } = req.body;
    await client.query("BEGIN");

    const comment: Comment = (
      await client.query(
        "insert into comments (postid, userid, replyto, content, createdat) values ($1, $2, $3, $4, $5) returning *",
        [postId, userid, replyto, content, createdat]
      )
    ).rows[0];

    await client.query(
      "update posts set comments = comments + 1 where id = $1",
      [postId]
    );

    await client.query("COMMIT");
    res
      .status(200)
      .json(
        commentsResponseCreator(
          false,
          `Comment created for postid: ${postId}`,
          comment
        )
      );
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
    res
      .status(400)
      .json(commentsResponseCreator(true, "Something went wrong!"));
  }
};

export const getAllComments = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const comments: Array<Comment> = (
      await client.query(
        "select c.*, u.username from comments c join users u on c.userid = u.id where c.postid = $1 order by createdat desc",
        [postId]
      )
    ).rows;

    res
      .status(200)
      .json(
        commentsResponseCreator(
          false,
          `Comments received for postId: ${postId}`,
          comments
        )
      );
  } catch (error) {
    console.log(error);
    res.status(400).json(commentsResponseCreator(true, "Something went wrong"));
  }
};
