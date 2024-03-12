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
  votes?: Array<number>;
  username?: string;
}

interface PostsResponse extends ServiceResponse {
  data: Post | null | Array<Post>;
}

interface VotesResponse extends ServiceResponse {
  data: Array<number> | null;
}

const postsResponseCreator = (
  error: boolean,
  message: string,
  data: Post | Array<Post> | null = null
): PostsResponse => {
  return { error: error, message: message, data: data };
};

const votesResponseCreator = (
  error: boolean,
  message: string,
  data: Array<number> | null = null
): VotesResponse => {
  return { error: error, message: message, data: data };
};

export const createPost = async (req: Request, res: Response) => {
  try {
    // create new post
    const { createdAt, authorId, title, htmlBody, textBody } = req.body;

    const post: Post = (
      await client.query(
        "insert into posts (createdat, authorid, title, htmlbody, textbody) values ($1, $2, $3, $4, $5) returning id, createdat, authorid, title, htmlbody, comments, upvotes",
        [createdAt, authorId, title, htmlBody, textBody]
      )
    ).rows[0];

    res
      .status(200)
      .json(postsResponseCreator(false, "Post created successfully", post));
  } catch (error) {
    console.log(error);

    res.status(400).json(postsResponseCreator(true, (error as Error).message));
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
      .json(postsResponseCreator(true, (error as Error).message, []));
  }
};

export const vote = async (req: Request, res: Response) => {
  try {
    const { postid, userid, isupvote } = req.body;
    const post: Post = (
      await client.query("select votes from posts where id = $1", [postid])
    ).rows[0];

    const isAlreadyLiked = post.votes?.find((vote) => {
      return vote === userid;
    });

    if (isAlreadyLiked) {
      const updatedPost: Post = (
        await client.query(
          "update posts set upvotes = upvotes - 1, votes = array_remove(votes, $1) where id = $2 returning *",
          [userid, postid]
        )
      ).rows[0];
      res
        .status(200)
        .json(postsResponseCreator(false, "Removed a like", updatedPost));
    } else {
      const updatedPost: Post = (
        await client.query(
          "update posts set upvotes = upvotes + 1, votes = array_append(votes, $1) where id = $2 returning *",
          [userid, postid]
        )
      ).rows[0];
      res
        .status(200)
        .json(postsResponseCreator(false, "Added a like", updatedPost));
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(votesResponseCreator(true, (error as Error).message));
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const post: Post = (
      await client.query(
        "select p.*, u.username from posts p join users u on p.authorid = u.id where p.id = $1",
        [postId]
      )
    ).rows[0];

    res
      .status(200)
      .json(
        postsResponseCreator(false, `Post received with id: ${postId}`, post)
      );
  } catch (error) {
    console.log(error);
    res.status(400).json(postsResponseCreator(false, (error as Error).message));
  }
};
