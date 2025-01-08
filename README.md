# news-scraper

Scrapes News from the world of Cyber Security, Hacking and related topics and sends the feed via a discord bot
![image](https://github.com/user-attachments/assets/b4052a8d-12f2-4fc2-9037-0d30187ebdad)

# Steps to setup and run the app

- Install pnpm CLI, if you don't already have in your machine
  ```
  npm install -g pnpm
  ```
- Clone this repository
  ```
  git clone https://github.com/codeandgyan/news-scraper.git
  ```
- Go to the news-scraper folder and install the dependencies
  ```
  cd news-scraper
  pnpm install
  ```
- Add a `.env` file at the root folder with following environment variables.
  You would need a valid discord token and your discord channelId to make the discord bot work
  ```.env
  PORT=3001
  INTERVAL=15
  DISCORD_TOKEN=<YourDiscordToken>
  NEWS_FEED_CHANNEL_ID=<DiscordNewsChannelId>
  GEMINI_API_KEY=<YourGoogleGeminiApiKeyForGenAI>
  GOOGLE_CUSTOM_SEARCH_API_KEY=<GoogleApiKeyForImageSearch>
  GOOGLE_CUSTOM_SEARCH_ENGINE_ID_CX=<GoogleSearchEngineIdForImageSearch>
  OPENAI_API_KEY=<OpenAIAPIKey-NotUsed>
  GITHUB_TOKEN=<GithubTokenToCommitArticleFiles>
  GITHUB_USERNAME=<GithubUserName>
  GITHUB_REPO=<GithubRepoNameOnWhichArticlesWillBePublished>
  GITHUB_BRANCH=<GithubBranchOnWhichArticlesWillBeCommitted>
  GITHUB_README_PATH=README.md
  DISCORD_ADMIN_USERNAME=<DiscordAdminUserName>
  DISCORD_TOPIC_LIST_CHANNEL_ID=<DiscordChannelIdToPassKeyword>
  ```
  _\*INTERVAL is the news polling frequency in minutes_
- Run the server in dev mode (locally)
  ```
  pnpm discord-dev
  ```

# Receive latest Cyber Security News feed on your mobile using discord server

- Download and Install Discord App from Google Playstore or App store.
- Create a Discord Account, if you already don't have.
- Join _Cyber Security News Server_ Discord Server by clicking on this link: https://discord.gg/Hx6DJxYPtc (Upto 5 allowed).
- You'll receive latest cyber security news updates on `#news-feed` channel.
- Turn on the notifications on `#news-feed` channel to receive instant news on your mobile.

# AI powered Cybersecurity tech writer, who would publish tech articles in real time

> Currently, this feature is not supported by _Cyber Security News Server_ Discord Server public.
> However, you can host this feature on your own server from this source code if you have your own discord configurations.

https://github.com/user-attachments/assets/780bff5a-59d8-409d-8950-115230eef552

- Create a `#topic-list` channel whose channelID to be configured in `DISCORD_TOPIC_LIST_CHANNEL_ID` .env variable.
- Ensure the discord app and bot you have created has necessary permissions to send messages, send reactions, etc.
- After setting up the channel and running this application, here's a demo video.
- Send a keyword related to cybersecurity to the `#topic-list` channel.
- Within a few moments, the bot will reply with the article link published in github pages.
- The article published in realtime can be accessed. Also, the home page with other published articles will can be accessed.

# More Info

- Running on: https://dashboard.katabump.com/dashboard
- Control on: https://control.katabump.com/auth/login
