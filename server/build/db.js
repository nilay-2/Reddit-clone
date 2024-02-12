"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = __importDefault(require("pg"));
dotenv_1.default.config();
const db_url = process.env.DB_URL;
const client = new pg_1.default.Client(db_url);
client
    .connect()
    .then(() => console.log("Database connected successfully"))
    .catch((error) => {
    console.log(error);
});
exports.default = client;
