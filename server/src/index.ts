import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { devFrontendUrl, prodFrontendUrl } from "./utils/appUrl";
// routers
import authRouter from "./routes/authRouter";
import postsRouter from "./routes/postsRouter";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 5000;

const app: Express = express();

app.use(express.json());

app.use(cookieParser());

const env: string = process.env.NODE_ENV as string;

app.use(
  cors({
    origin: env === "production" ? prodFrontendUrl : devFrontendUrl,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send(`Welcome to reddit-clone server✨ env: ${env}`);
});

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(req.headers);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://reddit-clone-rosy-six.vercel.app"
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
  console.log(`Enviroment ${env}`);
  console.log(`App running on port ${port}`);
});
