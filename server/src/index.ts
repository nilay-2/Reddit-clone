import express, { Express, Request, Response } from "express";
import cors from "cors";
import authRouter from "./routes/authRouter";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const port: number = 5000;

const app: Express = express();

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to reddit-clone server✨");
});

app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
