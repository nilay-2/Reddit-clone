import dotenv from "dotenv";
import pg from "pg";
dotenv.config();

const db_url: string = process.env.DB_URL as string;

const client: pg.Client = new pg.Client(db_url);

client
  .connect()
  .then(() => console.log("Database connected successfully"))
  .catch((error) => {
    console.log(error);
  });

export default client;
