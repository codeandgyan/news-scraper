require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const cron = require("cron");
const keepAlive = require("./server.js");
const { sendNews } = require("./scrapers/news");
const { getFormattedDateTime, isValidKeyword } = require("./common/utils.js");
const { writeABlog } = require("./bloggers/virtual-blogger.js");

const JOB_INTERVAL = process.env.INTERVAL || 20;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

const sendFeed = async () => {
  console.log(`${getFormattedDateTime()} >> `, "Polling for news feed...");
  const channel = await client.channels.fetch(process.env.NEWS_FEED_CHANNEL_ID);
  await sendNews(channel);
};

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  // Cron job
  const job = new cron.CronJob(`0 */${JOB_INTERVAL} * * * *`, sendFeed); // Every 20 minutes
  // send the feed for the first time
  (async () => {
    await sendFeed();
  })();
  // start the feed scheduled job
  job.start();
});

client.on("messageCreate", async (message) => {
  try {
    if (message?.author?.bot) return;
    if (
      message?.channelId === process.env.DISCORD_TOPIC_LIST_CHANNEL_ID &&
      message?.author?.username === process.env.DISORD_ADMIN_USERNAME
    ) {
      const keyword = message?.content;
      if (!isValidKeyword(keyword)) {
        await message.reply({
          content: "Invalid message",
        });
        await message.react("❗");
        return;
      }

      console.log(`Processing Message: ${keyword}...`);
      const articleUrl = await writeABlog(keyword);
      await message.reply({
        content: articleUrl,
      });
      await message.react("✅");
    }
  } catch (error) {
    await message.reply({
      content: `Error: ${error.message}`,
    });
    await message.react("❌");
  }
});

keepAlive();

client.login(process.env.DISCORD_TOKEN);
