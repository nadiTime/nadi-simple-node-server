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
// create an express app
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const xml2js_1 = require("xml2js");
const utils_1 = require("./utils");
const app = (0, express_1.default)();
// use the express-static middleware
app.use(express_1.default.static("public"));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
const allData = {
    newsData: { time: 0, data: [] },
};
// define the first route
app.get("/", function (req, res) {
    res.send("<h1>~Blings Homepage Server~</h1>");
});
app.get("/news", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // check if newsData is not old
    const now = new Date().getTime();
    if (Math.floor((now - allData.newsData.time) / 60000) < 10) {
        res.json((0, utils_1.selectRandomItemFromArray)(allData.newsData.data));
    }
    else {
        const parser = new xml2js_1.Parser();
        const newsUrl = "https://news.google.com/rss/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRGx6TVdZU0JXVnVMVWRDR2dKSlRDZ0FQAQ?hl=en-IL&gl=IL&ceid=IL:en";
        try {
            const news = yield axios_1.default.get(newsUrl);
            const data = yield parser.parseStringPromise(news.data);
            const items = data.rss.channel[0].item;
            allData.newsData = {
                time: Date.now(),
                data: items,
            };
            res.json((0, utils_1.selectRandomItemFromArray)(items));
        }
        catch (error) {
            res.json(error);
        }
    }
}));
// start the server listening for requests
app.listen(process.env.PORT || 3000, () => console.log("Server is running..."));
