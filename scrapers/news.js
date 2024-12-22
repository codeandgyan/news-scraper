const { scrapeBleepingComputer } = require("./bleepingcomputer");
const { EmbedBuilder } = require("discord.js");

const newsCache = new Set();

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
  const articles = await scrapeBleepingComputer(1);
  const dispatchedArticles = await getSentMessages(channel, 100);
  //   console.log("Dispatched Articles -->", dispatchedArticles);
  for (const article of articles) {
    // // const news = `${article.link}`;
    // const news = `
    //     ${article.category}: ${article.headline} \n
    //     ${article.link} \n
    //     @everyone
    // `.trim();
    // if (!dispatchedArticles.has(news)) {
    //   // Check if the news is already sent
    // //   await channel.send(news); // Send the new news
    //   console.log(`Sent news: ${news}`);
    //   break; // Send one news item at a time
    // }

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
