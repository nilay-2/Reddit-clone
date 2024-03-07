"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowUsersOnDashboard = exports.verify = exports.logIn = exports.signUp = void 0;
const db_1 = __importDefault(require("../db"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_EXPIRY = parseInt(process.env.COOKIE_EXPIRY);
const authResponseCreator = (error, message, data = null) => {
    return { error: error, message: message, data: data };
};
// cookie options
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    path: "/",
    // domain: process.env.NODE_ENV === "production" ? prodDomain : localDomain, // don't add 'domain' property if the frontend and backend have different domains
    expires: new Date(Date.now() + COOKIE_EXPIRY * 24 * 60 * 60 * 1000),
    sameSite: "none", // add this attribute only during deployment
};
const generateToken = (email, username, password) => {
    const token = jsonwebtoken_1.default.sign({ email, username, password }, JWT_SECRET, {
        expiresIn: "2d",
    });
    return token;
};
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, username } = req.body;
        // check if user already exists
        const user = (yield db_1.default.query("select id, username, email, photo from users where email = $1", [email])).rows[0];
        if (user) {
            return res
                .status(409)
                .json(authResponseCreator(true, "You already have an account."));
        }
        // if user does not exist then create new user, create jwt token and pass it in cookies
        const newUser = (yield db_1.default.query("Insert into users (email, username, password) values ($1, $2, $3) returning id, email, username, photo", [email, username, password])).rows[0];
        const token = generateToken(email, username, password);
        return res
            .cookie("jwt", token, cookieOptions)
            .status(201)
            .json(authResponseCreator(false, "Registerd successfully", newUser));
    }
    catch (error) {
        console.log(error);
        res
            .status(400)
            .json(authResponseCreator(true, "Authentication failed please try again later"));
    }
});
exports.signUp = signUp;
const logIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = (yield db_1.default.query("select * from users where email = $1", [email])).rows[0];
        // check if users exists
        if (!user) {
            return res
                .status(404)
                .json(authResponseCreator(true, "Email not found, please create an account."));
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
    }
    catch (error) {
        return res
            .json(400)
            .json(authResponseCreator(true, "Authentication failed please try again later"));
    }
});
exports.logIn = logIn;
const verify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // check if token exists
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json(authResponseCreator(true, "Please login"));
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = (yield db_1.default.query("select id, username, email, photo from users where email = $1", [decoded.email])).rows[0];
        req.user = user;
        next();
    }
    catch (error) {
        return res
            .status(400)
            .json(authResponseCreator(true, "Authentication failed please try again later"));
    }
});
exports.verify = verify;
const allowUsersOnDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res
        .status(200)
        .json(authResponseCreator(false, "Authorized successfully", req.user));
});
exports.allowUsersOnDashboard = allowUsersOnDashboard;
