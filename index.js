const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const app = express();
const port = 3000;

const url = "http://www.e2necc.com/EGGDailyAndMontlyPrices.aspx";

app.get("/", (req, res) => {
  const header = [];
  const namakkal = {};
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
      chere("span > table > tbody > tr").each((p, elem) => {
        elem = cheerio.load(elem);
        if (
          elem("td")
            .eq(0)
            .text()
            .toString()
            .trim() == "Namakkal"
        ) {
          elem("td").each(function(k, el) {
            namakkal[header[k]] = elem("td")
              .eq(k)
              .text()
              .toString();
          });
        }
      });
      res.end(JSON.stringify(namakkal, null, 3));
    })
    .catch(err => {
      res.send(err);
    });
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`App listening on port ${port}!`)
);
