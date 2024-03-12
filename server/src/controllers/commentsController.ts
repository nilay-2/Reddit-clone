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
  replymsg: Array<any>;
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
      .json(commentsResponseCreator(true, (error as Error).message));
  }
};

export const getAllComments = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const comments: Array<Comment> = (
      await client.query(
        "select c.*, u.username from comments c join users u on c.userid = u.id where c.postid = $1 and c.replyto is null order by createdat asc",
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
    res
      .status(400)
      .json(commentsResponseCreator(true, (error as Error).message));
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { commentId, postId } = req.params;
    const { replyTo } = req.body;
    await client.query("BEGIN");
    const deletedComment: Comment = (
      await client.query("delete from comments where id = $1 returning id", [
        commentId,
      ])
    ).rows[0];
    if (replyTo) {
      await client.query(
        "update comments set replies = replies - 1 where id = $1",
        [replyTo]
      );
    }
    await client.query(
      "update posts set comments = comments - 1 where id = $1",
      [postId]
    );
    await client.query("COMMIT");
    res
      .status(200)
      .json(
        commentsResponseCreator(
          false,
          "Comment delete successfully",
          deletedComment
        )
      );
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
    res
      .status(400)
      .json(commentsResponseCreator(true, (error as Error).message));
  }
};

export const createReply = async (req: Request, res: Response) => {
  try {
    const { postId, commentId } = req.params;
    const { createdAt, content } = req.body;
    await client.query("BEGIN");

    const reply: Comment = (
      await client.query(
        "insert into comments (postid, userid, replyto, content, createdat) values ($1, $2, $3, $4, $5) returning *",
        [postId, req.user.id, commentId, content, createdAt]
      )
    ).rows[0];

    await client.query(
      "update comments set replies = replies + 1 where id = $1",
      [commentId]
    );

    await client.query(
      "update posts set comments = comments + 1 where id = $1",
      [postId]
    );

    await client.query("COMMIT");
    res.status(200).json(commentsResponseCreator(false, "Reply added", reply));
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
    res
      .status(400)
      .json(commentsResponseCreator(true, (error as Error).message));
  }
};
