// create an express app
import {Router} from "express";
import axios from "axios";
import { Parser } from "xml2js";

import { selectRandomItemFromArray, shouldRefetch } from "../utils";

export const newsRoute = Router();
newsRoute.get("/", async (req, res) => {
  if (shouldRefetch(req.app.locals.allData.newsData.time)) {
    console.log('from cache');
    res.json(selectRandomItemFromArray(req.app.locals.allData.newsData.data));
  } else {
    const parser = new Parser();
    const newsUrl =
      "https://news.google.com/rss/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRGx6TVdZU0JXVnVMVWRDR2dKSlRDZ0FQAQ?hl=en-IL&gl=IL&ceid=IL:en";
    try {
      const news = await axios.get(newsUrl);
      const data = await parser.parseStringPromise(news.data);
      const items = data.rss.channel[0].item;
      req.app.locals.allData.newsData = {
        time: Date.now(),
        data: items,
      };
      console.log('from api');
      res.json(selectRandomItemFromArray(items));
    } catch (error) {
      res.json(error);
    }
  }
});