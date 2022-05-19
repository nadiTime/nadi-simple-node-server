// create an express app
import express from "express";
import { IALLData } from "./types";

import {newsRoute , weatherRoute} from "./routes"

const app = express();

app.use(express.static("public"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

const allData: IALLData = {
  newsData: { time: 0, data: [] },
  weatherData: {time: 0, data: {}}
};

app.locals.allData = allData;

// define the first route
app.get("/", (req, res) => {
  res.send("<h1>~Blings Homepage Server~</h1>");
});

app.use("/news", newsRoute);
app.use("/weather", weatherRoute)

app.listen(process.env.PORT || 3982, () => console.log("Server is running..."));
