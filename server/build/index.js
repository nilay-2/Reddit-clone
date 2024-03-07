"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const appUrl_1 = require("./utils/appUrl");
// routers
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const postsRouter_1 = __importDefault(require("./routes/postsRouter"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const env = process.env.NODE_ENV;
app.use((0, cors_1.default)({
    origin: env === "production" ? appUrl_1.prodFrontendUrl : appUrl_1.devFrontendUrl,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
}));
app.get("/", (req, res) => {
    res.send(`Welcome to reddit-clone server✨ env: ${env}.`);
});
app.use((req, res, next) => {
    // console.log(req.headers);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", env === "production" ? appUrl_1.prodFrontendUrl : appUrl_1.devFrontendUrl);
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");
    next();
});
app.use("/api/auth", authRouter_1.default);
app.use("/api/posts", postsRouter_1.default);
app.listen(port, () => {
    console.log(`Enviroment ${env}`);
    console.log(`App running on port ${port}`);
});
