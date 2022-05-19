// create an express app
import express from "express";
import axios from "axios";
import { Parser } from "xml2js";

import {selectRandomItemFromArray} from "./utils"

const app = express();
// use the express-static middleware
app.use(express.static("public"));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

interface IALLData{
  newsData: {time: number, data: Array<any>}
}

const allData: IALLData = {
  newsData: { time: 0, data: [] },
};

// define the first route
app.get("/", function (req, res) {
  res.send("<h1>~Blings Homepage Server~</h1>");
});

app.get("/news", async (req, res) => {
  // check if newsData is not old
  const now = new Date().getTime();
  if (Math.floor((now - allData.newsData.time) / 60000) < 10) {
    res.json(selectRandomItemFromArray(allData.newsData.data));
  } else {
    const parser = new Parser();
    const newsUrl =
      "https://news.google.com/rss/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRGx6TVdZU0JXVnVMVWRDR2dKSlRDZ0FQAQ?hl=en-IL&gl=IL&ceid=IL:en";
    try {
      const news = await axios.get(newsUrl);
      const data = await parser.parseStringPromise(news.data);
      const items = data.rss.channel[0].item;
      allData.newsData = {
        time: Date.now(),
        data: items,
      };
      res.json(selectRandomItemFromArray(items));
    } catch (error) {
      res.json(error);
    }
  }
});

// start the server listening for requests
app.listen(process.env.PORT || 3000, () => console.log("Server is running..."));
