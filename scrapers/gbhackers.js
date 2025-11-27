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
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: url,
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
    });
    const $ = cheerio.load(data);

    const result = $("div[id='tdi_44']")?.[0]?.childNodes;

    const articles = result
      ?.filter((e) => e.name === "div")
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

    return articles?.sort((a, b) => a.dateTime - b.dateTime) ?? [];
  } catch (error) {
    console.error("Error scraping gbhackers:", error.message, error.data);
    return [];
  }
};

module.exports = {
  scrapeGBHackers: scrapeNews,
};
