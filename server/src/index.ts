import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { devFrontendUrl, prodFrontendUrl } from "./utils/appUrl";
// routers
import authRouter from "./routes/authRouter";
import postsRouter from "./routes/postsRouter";
import dotenv from "dotenv";
dotenv.config();

const port: number = 5000;

const app: Express = express();

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production" ? prodFrontendUrl : devFrontendUrl,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to reddit-clone server✨");
});

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.NODE_ENV === "production" ? prodFrontendUrl : devFrontendUrl
  );
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);

app.listen(port, () => {
  console.log(`Enviroment ${process.env.NODE_ENV}`);
  console.log(`App running on port ${port}`);
});
