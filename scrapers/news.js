const { scrapeBleepingComputer } = require("./bleepingcomputer");
const { EmbedBuilder } = require("discord.js");
// const { scrapeCyberSecurityNews } = require("./cybersecuritynews");
const { scrapeGBHackers } = require("./gbhackers");

const getSentMessages = async (channel, limit) => {
  try {
    const messages = await channel.messages.fetch({ limit: limit }); // Fetch the last 100 messages
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
  //   const cybersecuritynewsArticles = await scrapeCyberSecurityNews(1);
  const gbhackersArticles = await scrapeGBHackers(1);
  const articles = [...bleepingcomputerArticles, ...gbhackersArticles];
  const dispatchedArticles = await getSentMessages(channel, 100);
  for (const article of articles) {
    const embeddedNews = new EmbedBuilder()
      .setTitle(article.headline)
      .setAuthor({
        name: `${article.category}`,
      })
      .setImage(article.imageUrl)
      //   .setThumbnail(article.imageUrl)
      .setDescription(article.summary)
      .setURL(article.link)
      //   .setTimestamp(new Date().toISOString())
      .setFooter({
        text: `by ${article.author}\n${article.date} ${article.time}`,
      });

    if (!dispatchedArticles.has(article.link)) {
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
