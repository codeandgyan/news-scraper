const axios = require("axios");
const cheerio = require("cheerio");
const { convertToDateTime } = require("../common/utils");

const url = "https://gbhackers.com/";

const scrapeNews = async (pageNumber = 1) => {
  try {
    const websiteUrl = pageNumber === 1 ? url : `${url}page/${pageNumber}/`;

    const { data } = await axios.get(websiteUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      },
    });
    const $ = cheerio.load(data);

    const result = $("div[id='tdi_45']")[0].childNodes;

    const articles = result
      .filter((e) => e.name === "div")
      .map((element) => {
        const category = "Security";

        const itemElement = $(element).find("div.item-details");

        const headline =
          itemElement.find("h3.entry-title a").text().trim() || "";

        const link = itemElement.find("a").attr("href") || "";

        const imageElement = $(element).find("div.td-module-thumb a img");
        const imageUrl =
          imageElement.attr("data-img-url") || imageElement.attr("src") || "";

        const summary = itemElement.find("div.td-excerpt").text().trim() || "";

        const author =
          itemElement.find("span.td-post-author-name a").text().trim() || "";

        const date =
          $(element).find("span.td-post-date time").text().trim() || "";

        const datetimeValue =
          $(element).find("span.td-post-date time").attr("datetime").trim() ||
          "";
        const time = new Date(datetimeValue).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        return {
          category,
          imageUrl,
          headline,
          summary,
          link: link?.startsWith("http") ? link : `${url}${link}`,
          author,
          date,
          time,
          dateTime: convertToDateTime(date, time),
        };
      });

    return articles.sort((a, b) => a.dateTime - b.dateTime);
  } catch (error) {
    console.error("Error scraping gbhackers:", error.message, error.data);
    return [];
  }
};

module.exports = {
  scrapeGBHackers: scrapeNews,
};
