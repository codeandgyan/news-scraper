const axios = require("axios");
const cheerio = require("cheerio");
const { convertToDateTime } = require("../common/utils");

const url = "https://cybernews.com/security/";

const scrapeNews = async (pageNumber = 1) => {
  try {
    const websiteUrl = pageNumber === 1 ? url : `${url}page/${pageNumber}/`;

    const { data } = await axios.get(websiteUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "en-US,en;q=0.9",
        Referrer: "https://cybernews.com/security",
        Origin: "https://cybernews.com",
      },
    });
    const $ = cheerio.load(data);

    const articles = $("div.cells__item.cells__item_width")
      .map((index, element) => {
        const category = "Security";

        const headline =
          $(element).find("a.link h3.heading").text().trim() || "";

        const link = $(element).find("a.link").attr("href") || "";

        const imageUrl =
          $(element).find("div.cells__item img").attr("src") || "";

        const summary =
          $(element)
            .find("div.text.text_size_small.text_line-height_big")
            .text()
            .trim() || "";

        const author =
          $(element)
            .find("a.link.text_color_important")
            .first()
            .text()
            .trim() || "";

        const date = $(element).find("time.meta-item").attr("datetime") || "";

        const time =
          $(element)
            .find("time.meta-item")
            .text()
            .trim()
            .replace(date, "")
            .trim() || "";

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
      })
      .get();

    return articles;
  } catch (error) {
    console.error("Error scraping cybernews:", error.message);
    return [];
  }
};

module.exports = {
  scrapeCyberNews: scrapeNews,
};
