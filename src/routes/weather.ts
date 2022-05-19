// create an express app
import { Router } from "express";
import axios from "axios";
import { Parser } from "xml2js";

import { shouldRefetch } from "../utils";

const weatherLocations = {
  tokyo: "1850147",
  newYork: "5128581",
  tlv: "293397",
};

export const weatherRoute = Router();
weatherRoute.get("/", async (req, res) => {
  if (shouldRefetch(req.app.locals.allData.weatherData.time)) {
    console.log("from cache");
    res.json(req.app.locals.allData.weatherData.data);
  } else {
    const parser = new Parser();
    const weatherUrl =
      "https://weather-broker-cdn.api.bbci.co.uk/en/observation/rss/";
    try {
      const allRssRes = await Promise.allSettled(
        Object.values(weatherLocations).map((val) =>
          axios.get(`${weatherUrl}${val}`)
        )
      );
      const allRssParsed = await Promise.allSettled(
        allRssRes.map((val) =>
          parser.parseStringPromise((val as any).value.data)
        )
      );
      const items = allRssParsed.map((parsedRss) => {
        const data = (parsedRss as any).value.rss.channel[0];
        const temp = data.item[0].title[0].substr(
          data.item[0].title[0].indexOf(",") + 2
        );
        return { title: data.title[0], temp };
      });
      req.app.locals.allData.weatherData = {
        time: Date.now(),
        data: items,
      };
      console.log("from api");
      res.json(items);
    } catch (error) {
      console.log(error);

      res.json(error);
    }
  }
});
