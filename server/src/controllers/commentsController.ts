import { Request, Response } from "express";
import client from "../db";

export const createComment = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { userid, createdat, replyto, content } = req.body;

    const comment = await client.query(
      "insert into comments (postid, userid, replyto, content, createdat) values ($1, $2, $3, $4, $5)",
      [postId, userid, replyto, content, createdat]
    );

    res.status(200).json({
      error: false,
      message: "Data received",
      data: comment,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error",
    });
  }
};
