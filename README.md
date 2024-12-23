# news-scraper

Scrapes News from the world of Cyber Security, Hacking and related topics and sends the feed via a discord bot

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

- Add a `.env` file at the root folder
- You would need a valid discord token and your discord channelId to make the discord bot work
  ```
  DISCORD_TOKEN=<YourDiscordToken>
  NEWS_FEED_CHANNEL_ID=<YourChannelId>
  ```
- Run the server in dev mode (locally)

  ```
  pnpm discord-dev
  ```

- Run the server in prod mode (deployed)
  ```
  pnpm discord-prod
  ```

# Receive latest Cyber Security News feed on your mobile using discord server

- Download and Install Discord App from Google Playstore or App store
- Create a Discord Account, if you already don't have
- Join _Cyber Security News Server_ Discord Server by clicking this link: https://discord.gg/Hx6DJxYPtc (Upto 5 allowed)
- You'll receive latest cyber security news updates on `#news-feed` channel
- Turn on the notifications on `#news-feed` channel to receive instant news on your mobile

# More Info

- Running on: https://dashboard.katabump.com/dashboard
- Control on: https://control.katabump.com/auth/login
