require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const cron = require("cron");
const keepAlive = require("./server.js");
const { sendNews } = require("./scrapers/news");

const JOB_INTERVAL = process.env.INTERVAL || 20;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// client.on("message", (message) => {
//   //   console.log(message);
// });

const sendFeed = async () => {
  console.log("sending news feed...");
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

keepAlive();

client.login(process.env.DISCORD_TOKEN);
