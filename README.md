# news-scraper

Scrapes News from the world of Cyber Security, Hacking and related topics.

# Steps to setup and run the app

- Install pnpm CLI, if you don't already have in your machine
  ```
  npm install -g pnpm
  ```
- Clone this repository
  ```
  git clone https://github.com/codeandgyan/news-scraper.git
  ```
- Go to the new-scraper folder and install the dependencies
  ```
  cd news-scraper
  pnpm install
  ```
- Run the server in dev mode (locally)

  ```
  pnpm dev
  ```

- Run the following API
  ```
  curl --location 'http://localhost:3000/api/news?page=20'
  ```
