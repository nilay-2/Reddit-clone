import { Request, Response } from "express";
import client from "../db";

interface Post {
  createdAt: number;
  authorId: number;
  title: string;
  htmlBody: string;
  textBody: string;
  comments: number;
  upvotes: number;
  downvotes: number;
}

export const createPost = async (req: Request, res: Response) => {
  try {
    // create new post
    const { createdAt, authorId, title, htmlBody, textBody } = req.body;

    const post = (
      await client.query(
        "insert into posts (createdat, authorid, title, htmlbody, textbody) values ($1, $2, $3, $4, $5) returning id, createdat, authorid, title, htmlbody, comments, upvotes, downvotes",
        [createdAt, authorId, title, htmlBody, textBody]
      )
    ).rows[0] as Post;

    res.status(200).json({
      error: false,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Please try again later",
      data: null,
    });
  }
};
