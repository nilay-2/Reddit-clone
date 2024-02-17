import { Request, Response } from "express";
import client from "../db";
import { ServiceResponse } from "../utils/ResponseInterface";

interface Post {
  createdAt: number;
  authorId: number;
  title: string;
  htmlBody: string;
  textBody: string;
  comments: number;
  upvotes: number;
  downvotes: number;
  username?: string;
}

interface PostsResponse extends ServiceResponse {
  data: Post | null | Array<Post>;
}

const postsResponseCreator = (
  error: boolean,
  message: string,
  data: Post | Array<Post> | null = null
): PostsResponse => {
  return { error: error, message: message, data: data };
};

export const createPost = async (req: Request, res: Response) => {
  try {
    // create new post
    const { createdAt, authorId, title, htmlBody, textBody } = req.body;

    const post: Post = (
      await client.query(
        "insert into posts (createdat, authorid, title, htmlbody, textbody) values ($1, $2, $3, $4, $5) returning id, createdat, authorid, title, htmlbody, comments, upvotes, downvotes",
        [createdAt, authorId, title, htmlBody, textBody]
      )
    ).rows[0];

    res
      .status(200)
      .json(postsResponseCreator(false, "Post created successfully", post));
  } catch (error) {
    console.log(error);

    res.status(400).json(postsResponseCreator(true, "Please try again later"));
  }
};

export const getPosts = async (_: Request, res: Response) => {
  try {
    const posts: Array<Post> = (
      await client.query(
        "select p.*, u.username from posts p join users u on p.authorid = u.id order by p.createdat desc"
      )
    ).rows;
    res
      .status(200)
      .json(postsResponseCreator(false, "Posts retreived successfully", posts));
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json(postsResponseCreator(true, "Something went wrong!", []));
  }
};
