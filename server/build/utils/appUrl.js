"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsQuery = exports.prodDomain = exports.localDomain = exports.prodFrontendUrl = exports.devFrontendUrl = void 0;
exports.devFrontendUrl = "http://localhost:3000";
exports.prodFrontendUrl = "https://reddit-clone-rosy-six.vercel.app";
exports.localDomain = "localhost";
exports.prodDomain = "reddit-clone-rosy-six.vercel.app";
const tsQuery = (query) => {
    const arr = query.split(" ");
    for (let i = 0; i < arr.length - 1; i++) {
        arr[i] += " &";
    }
    const andStr = arr.join(" ");
    const orStr = andStr.replace(/&/g, "|");
    return {
        andStr,
        orStr,
    };
};
exports.tsQuery = tsQuery;
