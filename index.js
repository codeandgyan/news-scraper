// Required modules
const express = require("express");
const { scrapeBleepingComputer } = require("./scrapers/bleepingcomputer");

const app = express();
const PORT = 3000;

// API endpoint with pagination
app.get("/api/news", async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;

  const articles = await scrapeBleepingComputer(page);

  res.json({
    currentPage: page,
    totalArticles: articles.length,
    articles: articles,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
