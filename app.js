// create an express app
import express from "express";
import axios from "axios";
import { Parser } from "xml2js";
const app = express();
// use the express-static middleware
app.use(express.static("public"));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

// define the first route
app.get("/", function (req, res) {
  res.send("<h1>~Blings Homepage Server~</h1>");
});

app.get("/news", async (req, res) => {
  const parser = new Parser();
  const newsUrl =
    "https://news.google.com/rss/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRGx6TVdZU0JXVnVMVWRDR2dKSlRDZ0FQAQ?hl=en-IL&gl=IL&ceid=IL:en";
  try {
    const news = await axios.get(newsUrl);
    const data = await parser.parseStringPromise(news.data);
    const items  = data.rss.channel[0].item;
    const item = items[Math.floor(Math.random()*items.length)]
    res.json(item);
  } catch (error) {
    res.json(error);
  }
});

// start the server listening for requests
app.listen(process.env.PORT || 3000, () => console.log("Server is running..."));
