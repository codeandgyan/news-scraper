const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.all("/", async (req, res) => {
  res.send("Bot is running");
});

function keepAlive() {
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
}

module.exports = keepAlive;
