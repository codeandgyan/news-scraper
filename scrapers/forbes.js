const axios = require("axios");
const cheerio = require("cheerio");
const { parseDateFormats } = require("../common/utils");

const url = "https://www.forbes.com/cybersecurity/";

const scrapeNews = async () => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      },
    });
    const $ = cheerio.load(data);

    const result = $("div[data-test-e2e='stream articles']")[0].childNodes;

    const articles = result.map((element) => {
      const category = "Cybersecurity";

      const headline = ($(element).find("h3 a").text() || "").trim();

      const link = $(element).find("h3 a").attr("href") || "";

      const imageUrl =
        $(element).find("div[data-test-e2e='card stream'] img").attr("src") ||
        "";

      const summary = ($(element).find("p span").text() || "").trim();

      const author =
        $(element).find("p").next().find("a").text().trim() || "Forbes";

      const dateValue = $(element).find("h3").prev().find("span").text() || "";

      const { date, time, dateTime } = parseDateFormats(dateValue);

      return {
        category,
        imageUrl,
        headline,
        summary,
        link: link?.startsWith("http") ? link : `${url}${link}`,
        author,
        date,
        time,
        dateTime,
      };
    });

    return articles
      .filter((article) => article.headline && article.summary)
      .sort((a, b) => a.dateTime - b.dateTime);
  } catch (error) {
    console.error("Error scraping forbes:", error.message, error.data);
    return [];
  }
};

module.exports = {
  scrapeForbes: scrapeNews,
};
