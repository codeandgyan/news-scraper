const axios = require("axios");
const cheerio = require("cheerio");
const { convertToDateTime, getServerIp, getRandomUserAgent, sleep } = require("../common/utils");
const { scrapeGBHackersPuppeteer, initBrowser, closeBrowser } = require("./gbhackers_puppeteer");

const url = "https://gbhackers.com/";

const scrapeNews = async (pageNumber = 1) => {
  try {
    const websiteUrl = pageNumber === 1 ? url : `${url}page/${pageNumber}/`;

    // Try initial fetch with axios using random UA and simple headers. If blocked, fall back to puppeteer.
    const maxAttempts = 3;
    let data = null;
    let lastErr = null;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const headers = {
          "User-Agent": getRandomUserAgent(),
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "Accept-Language": "en-US,en;q=0.9",
          Referer: url,
          Connection: "keep-alive",
        };

        const resp = await axios.get(websiteUrl, { headers, timeout: 15000 });
        if (resp && resp.status === 200 && resp.data) {
          data = resp.data;
          break;
        }
        lastErr = new Error(`Unexpected status ${resp.status}`);
      } catch (err) {
        lastErr = err;
        // If 403, break and try puppeteer immediately
        if (err.response && err.response.status === 403) break;
        // randomized backoff before next attempt
        await sleep(500 + Math.floor(Math.random() * 1000));
      }
    }

    // If axios failed or returned 403, fallback to puppeteer (reuse browser)
    if (!data) {
      try {
        await initBrowser({ headless: true });
        const html = await scrapeGBHackersPuppeteer(pageNumber, { reuseBrowser: true, postLoadWait: 700 });
        data = html;
      } catch (err) {
        // final failure, log and return empty
        const serverIp = typeof getServerIp === "function" ? getServerIp() : "unknown";
        console.warn("Error scraping gbhackers (puppeteer fallback failed):", lastErr?.message || err.message, { serverIp });
        try { await closeBrowser(); } catch (e) {}
        return [];
      }
    }
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
  // include server IP from shared utils (best-effort)
  const serverIp = typeof getServerIp === "function" ? getServerIp() : "unknown";

  console.warn("Error scraping gbhackers:", error.message, error.data, { serverIp });
    return [];
  }
};

module.exports = {
  scrapeGBHackers: scrapeNews,
};
