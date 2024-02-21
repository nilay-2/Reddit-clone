import { Response, Request, NextFunction } from "express";
import client from "../db";
import { ServiceResponse } from "../utils/ResponseInterface";
import jwt from "jsonwebtoken";
import { localDomain, prodDomain } from "../utils/appUrl";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET as string;
const COOKIE_EXPIRY: number = parseInt(process.env.COOKIE_EXPIRY as string);

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  photo?: string;
  passwordChangedat?: string;
}

interface AuthResponse extends ServiceResponse {
  data: User | null;
}

const authResponseCreator = (
  error: boolean,
  message: string,
  data: User | null = null
): AuthResponse => {
  return { error: error, message: message, data: data };
};

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

interface CookieOpts {
  httpOnly: boolean;
  secure: boolean;
  path: string;
  domain: string;
  expires: Date;
  sameSite: boolean | "none" | "lax" | "strict" | undefined;
}

const cookieOptions: CookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" ? true : false,
  path: "/",
  domain: process.env.NODE_ENV === "production" ? prodDomain : localDomain,
  expires: new Date(Date.now() + COOKIE_EXPIRY * 24 * 60 * 60 * 1000),
  sameSite: "none",
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
    const user: User = (
      await client.query(
        "select id, username, email, photo from users where email = $1",
        [email]
      )
    ).rows[0];

    if (user) {
      return res
        .status(409)
        .json(authResponseCreator(true, "You already have an account."));
    }
    // if user does not exist then create new user, create jwt token and pass it in cookies
    const newUser: User = (
      await client.query(
        "Insert into users (email, username, password) values ($1, $2, $3) returning id, email, username, photo",
        [email, username, password]
      )
    ).rows[0];

    const token = generateToken(email, username, password);

    return res
      .cookie("jwt", token, cookieOptions)
      .status(201)
      .json(authResponseCreator(false, "Registerd successfully", newUser));
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json(
        authResponseCreator(
          true,
          "Authentication failed please try again later"
        )
      );
  }
};

export const logIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user: User = (
      await client.query("select * from users where email = $1", [email])
    ).rows[0];

    // check if users exists
    if (!user) {
      return res
        .status(404)
        .json(
          authResponseCreator(
            true,
            "Email not found, please create an account."
          )
        );
    }
    // check if passwords match
    if (user.password !== password) {
      return res
        .status(401)
        .json(authResponseCreator(true, "Invalid credentials."));
    }

    // remove password property from the object while sending response
    const token = generateToken(user.email, user.username, user.password);
    user.password = "";

    return res
      .cookie("jwt", token, cookieOptions)
      .status(200)
      .json(authResponseCreator(false, "Log in successful", user));
  } catch (error) {
    return res
      .json(400)
      .json(
        authResponseCreator(
          true,
          "Authentication failed please try again later"
        )
      );
  }
};

export const verify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // check if token exists
    const token: string = req.cookies.jwt;
    if (!token) {
      return res.status(401).json(authResponseCreator(true, "Please login"));
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { email?: string };

    const user: User = (
      await client.query(
        "select id, username, email, photo from users where email = $1",
        [decoded.email]
      )
    ).rows[0];

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(400)
      .json(
        authResponseCreator(
          true,
          "Authentication failed please try again later"
        )
      );
  }
};

export const allowUsersOnDashboard = async (req: Request, res: Response) => {
  res
    .status(200)
    .json(authResponseCreator(false, "Authorized successfully", req.user));
};
