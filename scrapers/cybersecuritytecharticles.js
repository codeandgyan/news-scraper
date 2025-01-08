const axios = require("axios");
const cheerio = require("cheerio");
const { convertToDateTime, getFormattedDateTime } = require("../common/utils");
const { searchImageUrl } = require("../gen-ai/image-url-lookup");

const url = "https://oactestram.github.io/tech-blogs/";

const scrapeNews = async () => {
  try {
    const websiteUrl = url;

    const { data } = await axios.get(websiteUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      },
    });
    const $ = cheerio.load(data);

    const result = $("table");

    const articles = result
      .map((index, element) => {
        const headline = $(element).find("thead a").text().trim() || "";
        const link = $(element).find("thead a").attr("href") || "";

        const imageUrl =
          $(element).find("tbody img.image").attr("src") ||
          "https://dwtyzx6upklss.cloudfront.net/Pictures/460x307/4/2/3/5423_cybersecurity_880937.png";

        const summary =
          $(element).find("tbody span.summary").text().trim() || "";

        const author =
          $(element).find("tbody span.publication span.author").text().trim() ||
          "";

        const category =
          $(element).find("tbody span.publication em.category").text().trim() ||
          "";

        const dateTimeValue =
          $(element).find("tbody span.publication span.date").text().trim() ||
          "";

        const date = new Date(dateTimeValue).toLocaleDateString("en-US", {
          dateStyle: "long",
        });

        const time = new Date(dateTimeValue).toLocaleTimeString("en-US", {
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
      })
      .toArray();

    return articles.sort((a, b) => a.dateTime - b.dateTime);
  } catch (error) {
    console.error(
      "Error scraping cybersecuritytecharticles:",
      error.message,
      error.data
    );
    return [];
  }
};

// Example usage
(async () => {
  const articles = await scrapeNews();
  console.log(articles);
})();

module.exports = {
  scrapeTechArticles: scrapeNews,
};
