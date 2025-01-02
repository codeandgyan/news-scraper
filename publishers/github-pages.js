const axios = require("axios");
const https = require("https");
const { formatTextToUrl, getFormattedDateTime } = require("../common/utils");
require("dotenv").config();

const githubToken = process.env.GITHUB_TOKEN;
const username = process.env.GITHUB_USERNAME; // Your GitHub username
const repo = process.env.GITHUB_REPO; // Your GitHub repository name
const branch = process.env.GITHUB_BRANCH; // Branch for GitHub Pages
const mainPageReadmePath = process.env.GITHUB_README_PATH; // Path to the main page

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false, // Disable SSL validation
    keepAlive: true,
  }),
});

async function publishArticle(
  title,
  summary,
  content,
  author,
  dateTime,
  imageUrl
) {
  const fileName = `${formatTextToUrl(title)}.md`;
  // Generate a unique path for the file
  const filePath = `articles/${fileName}`; // Store in an "articles" folder
  const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${filePath}`;

  try {
    // Encode the file content in Base64 (required by GitHub API)
    const encodedContent = Buffer.from(content).toString("base64");
    let sha = undefined;

    try {
      const { data } = await axiosInstance.get(apiUrl, {
        headers: {
          Authorization: `token ${githubToken}`,
          "Content-Type": "application/json",
        },
      });
      sha = data.sha;
    } catch (e) {}

    // Create the file via the GitHub API
    const response = await axiosInstance.put(
      apiUrl,
      {
        message: `Add article: ${fileName}`, // Commit message
        content: encodedContent, // File content
        branch, // Target branch
        sha: sha,
      },
      {
        headers: {
          Authorization: `token ${githubToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    const pageUrl = `https://${username}.github.io/${repo}/${
      filePath.split(".")[0]
    }`;
    console.log(`Article Published on: ${pageUrl}`);
    await updateMainPage(pageUrl, title, summary, author, dateTime, imageUrl);
    return pageUrl;
  } catch (error) {
    console.error(
      `Error publishing article "${title}}":`,
      error.response?.data || error.message
    );
  }
}

async function updateMainPage(
  articleUrl,
  articleTitle,
  summary,
  author,
  dateTime,
  imageUrl
) {
  const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${mainPageReadmePath}`;

  try {
    // Fetch the current content of the main page
    const { data } = await axiosInstance.get(apiUrl, {
      headers: {
        Authorization: `token ${githubToken}`,
      },
    });

    // Decode the current content
    const currentContent = Buffer.from(data.content, "base64").toString(
      "utf-8"
    );

    const newContent = `| <img src="${imageUrl}" alt="${articleTitle}"> | [${articleTitle}](${articleUrl}) | ${summary} | ${dateTime} | ${author} |`;

    // Append the new article content to current content
    const updatedContent = `${currentContent}${newContent}\n`;

    // Encode the updated content
    const encodedContent = Buffer.from(updatedContent).toString("base64");

    // Update the main page
    await axiosInstance.put(
      apiUrl,
      {
        message: `Adding article: ${articleTitle}`, // Commit message
        content: encodedContent, // New content
        sha: data.sha, // Required to update the file
        branch,
      },
      {
        headers: {
          Authorization: `token ${githubToken}`,
        },
      }
    );
  } catch (error) {
    console.error(
      "Error updating main page:",
      error.response?.data || error.message
    );
  }
}

module.exports = {
  publishArticle,
};
