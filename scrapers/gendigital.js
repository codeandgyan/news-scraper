const axios = require("axios");
const cheerio = require("cheerio");
const { convertToDateTime } = require("../common/utils");

const url = "https://www.gendigital.com/blog/insights/research";
const urlObject = new URL(url);
const baseUrl = `${urlObject.protocol}//${urlObject.host}`;

const scrapeNews = async (pageNumber = 1) => {
  try {
    const websiteUrl = `${url}?page=${pageNumber}`;

    const { data } = await axios.get(websiteUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      },
    });
    const $ = cheerio.load(data);

    const result = $("div.mantine-SimpleGrid-root")[0].childNodes;

    const articles = result
      .filter((e) => e.name === "div")
      .map((element) => {
        const category = "Security Research";

        const headline = $(element).find("h2").text().trim() || "";

        const link = $(element).find("a").attr("href") || "";

        const imageElement = $(element).find("picture img");
        const imageUrl =
          imageElement.attr("data-img-url") || imageElement.attr("src") || "";

        const metaDataElement = $(element).find("div.mantine-Group-root");

        const summary = "Read more from gendigital blog...";

        const author = metaDataElement.find("span").text();
        const date = metaDataElement
          .find("span")
          .next()
          .text()
          .split("•")[0]
          .trim();

        const datetimeValue = new Date().getTime();
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
          link: link?.startsWith("http") ? link : `${baseUrl}${link}`,
          author,
          date,
          time,
          dateTime: convertToDateTime(date, time),
        };
      });

    return articles.sort((a, b) => a.dateTime - b.dateTime);
  } catch (error) {
    console.error("Error scraping genDigital:", error.message, error.data);
    return [];
  }
};

module.exports = {
  scrapeGenDigital: scrapeNews,
};
