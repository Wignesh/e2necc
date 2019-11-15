const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const app = express();
const port = 3000;

const url = "http://www.e2necc.com/EGGDailyAndMontlyPrices.aspx";

app.get("/", (req, res) => {
  const header = [];
  const namakkal = {}
  res.setHeader("Content-Type", "application/json");
  axios
    .get("http://www.e2necc.com/EGGDailyAndMontlyPrices.aspx")
    .then(response => response.data)
    .then(data => cheerio.load(data))
    .then(chere => {
      chere("span > table > tbody > tr")
        .eq(0)
        .find("th")
        .each(function(i, elem) {
          if (i === 0) {
            header[i] = "Zone";
          } else {
            header[i] = chere(this)
              .text()
              .toString();
          }
        });
        chere("span > table > tbody > tr")
        .eq(15)
        .find("td")
        .each(function(i, elem) {
            namakkal[header[i]] = chere(this).text().toString();
        });
        res.end(JSON.stringify(namakkal, null, 3));
    })
    .catch(err => {
      res.send(err);
    });
});

app.listen(process.env.PORT || 3000, () => console.log(`App listening on port ${port}!`));
