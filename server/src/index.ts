import express, { Express, Request, Response } from "express";
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

app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);

app.listen(port, () => {
  console.log(`Enviroment ${process.env.NODE_ENV}`);
  console.log(`App running on port ${port}`);
});
