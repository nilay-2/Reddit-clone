import { Response, Request } from "express";
import client from "../db";
import jwt, { decode } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET as string;
const COOKIE_EXPIRY: number = parseInt(process.env.COOKIE_EXPIRY as string);

interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  photo?: string;
  passwordChangedat?: string;
}

interface CookieOpts {
  httpOnly: boolean;
  secure: boolean;
  path: string;
  domain: string;
  expires: Date;
}

interface SeriveResponse {
  error: boolean;
  message: string;
  data: Record<string, any> | null;
}

const cookieOptions: CookieOpts = {
  httpOnly: true,
  secure: false,
  path: "/",
  domain: "localhost",
  expires: new Date(Date.now() + COOKIE_EXPIRY * 24 * 60 * 60 * 1000),
};

const generateToken = (
  email: string,
  username: string,
  password: string
): string => {
  const token = jwt.sign({ email, username, password }, JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;

    // check if user already exists
    const user = (
      await client.query(
        "select id, username, email, photo from users where email = $1",
        [email]
      )
    ).rows[0] as User;

    if (user) {
      return res.status(409).json({
        error: true,
        message: "You already have an account.",
        data: user,
      } as SeriveResponse);
    }
    // if user does not exist then create new user, create jwt token and pass it in cookies
    const newUser = (
      await client.query(
        "Insert into users (email, username, password) values ($1, $2, $3) returning id, email, username, photo",
        [email, username, password]
      )
    ).rows[0] as User;

    const token = generateToken(email, username, password);

    return res
      .cookie("jwt", token, cookieOptions)
      .status(201)
      .json({
        error: false,
        message: "Registerd successfully",
        data: newUser,
      } as SeriveResponse);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Authentication failed please try again later",
      data: null,
    } as SeriveResponse);
  }
};

export const logIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = (
      await client.query("select * from users where email = $1", [email])
    ).rows[0] as User;

    // check if users exists
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "Email not found, please create an accout.",
        data: null,
      } as SeriveResponse);
    }
    // check if passwords match
    if (user.password !== password) {
      return res.status(401).json({
        error: true,
        message: "Invalid credentials.",
        data: null,
      } as SeriveResponse);
    }

    // remove password property from the object while sending response
    const token = generateToken(user.email, user.username, user.password);
    user.password = "";

    return res
      .cookie("jwt", token)
      .status(200)
      .json({
        error: false,
        message: "Log in successful",
        data: user,
      } as SeriveResponse);
  } catch (error) {
    return res.json(400).json({
      error: true,
      message: "Authentication failed please try again later",
      data: null,
    } as SeriveResponse);
  }
};

export const verify = async (req: Request, res: Response) => {
  try {
    // check if token exists
    const token: string = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        error: true,
        message: "Please login",
        data: null,
      } as SeriveResponse);
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { email?: string };

    const user = (
      await client.query(
        "select id, username, email, photo from users where email = $1",
        [decoded.email]
      )
    ).rows[0] as User;

    return res.status(200).json({
      error: false,
      message: "Authorized successfully",
      data: user,
    } as SeriveResponse);
  } catch (error) {
    return res.json(400).json({
      error: true,
      message: "Authentication failed please try again later",
      data: null,
    } as SeriveResponse);
  }
};
