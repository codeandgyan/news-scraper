const axios = require("axios");
const cheerio = require("cheerio");

const url = "https://www.bleepingcomputer.com/";

const scrapeNews = async (pageNumber = 1) => {
  try {
    const websiteUrl = pageNumber === 1 ? url : `${url}page/${pageNumber}/`;

    const { data } = await axios.get(websiteUrl);
    const $ = cheerio.load(data);

    const result = $("ul[id='bc-home-news-main-wrap']")[0].childNodes;

    const articles = result
      .filter((e) => e.name === "li")
      .map((element) => {
        const imageElement = $(element)
          .find("div[class='bc_latest_news_img']")
          .find("a")
          .find("img");

        const imageUrl =
          imageElement.attr("data-src") || imageElement.attr("src");
        const newsItem = $(element).find("div[class='bc_latest_news_text']");
        const category = newsItem
          .find(".bc_latest_news_category")
          .find("a")
          .text();
        const headlineItem = newsItem.find("h4").find("a");
        const headline = headlineItem.text();
        const link = headlineItem.attr("href");
        const summary = newsItem.find("p").text();

        const newsMetadata = newsItem.find("ul");

        const author = newsMetadata
          .find("li[class='bc_news_author']")
          .find("a")
          .text();
        const date = newsMetadata.find("li[class='bc_news_date']").text();
        const time = newsMetadata.find("li[class='bc_news_time']").text();

        return {
          category,
          imageUrl,
          headline,
          summary,
          link: link?.startsWith("http") ? link : `${url}${link}`,
          author,
          date,
          time,
        };
      })
      .filter((item) => item.category !== "Deals");

    return articles;
  } catch (error) {
    console.error("Error scraping news:", error);
    return [];
  }
};

module.exports = {
  scrapeBleepingComputer: scrapeNews,
};
