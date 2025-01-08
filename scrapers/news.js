const { scrapeBleepingComputer } = require("./bleepingcomputer");
const { EmbedBuilder } = require("discord.js");
const { scrapeGBHackers } = require("./gbhackers");
const { scrapeGenDigital } = require("./gendigital");
const { scrapeForbes } = require("./forbes");

const getSentMessages = async (channel, n) => {
  try {
    const messages = await channel.messages.fetch({ limit: n }); // Fetch the last n messages
    const sentNews = messages.map((msg) => {
      return msg.embeds?.[0]?.url;
    });
    return new Set(sentNews); // Use a Set for quick lookup
  } catch (err) {
    console.error("Error fetching sent messages:", err);
    return new Set();
  }
};

async function sendNews(channel) {
  const bleepingcomputerArticles = await scrapeBleepingComputer(1);
  const gbhackersArticles = await scrapeGBHackers(1);
  const forbes = await scrapeForbes();
  const gendigital = await scrapeGenDigital(1);
  const articles = [
    ...bleepingcomputerArticles,
    ...gbhackersArticles,
    ...forbes,
    ...gendigital,
  ];
  const dispatchedArticles = await getSentMessages(channel, 100);
  for (const article of articles) {
    if (!dispatchedArticles.has(article.link)) {
      const embeddedNews = new EmbedBuilder()
        .setTitle(article.headline)
        .setAuthor({
          name: `${article.category || "Miscellaneous"}`,
        })
        .setImage(article.imageUrl)
        //   .setThumbnail(article.imageUrl)
        .setDescription(`${article.summary}\n@everyone`)
        .setURL(article.link)
        //   .setTimestamp(new Date().toISOString())
        .setFooter({
          text: `by ${article.author}\n${article.date} ${article.time}`,
        });
      console.log(
        article.dateTime,
        article.date,
        article.time,
        article.headline
      );
      await channel.send({ embeds: [embeddedNews] });
      break;
    }
  }
}

module.exports = {
  sendNews,
};
