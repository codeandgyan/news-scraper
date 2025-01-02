const { isValidKeyword, getFormattedDateTime } = require("../common/utils");
const { generateMarkdownArticle } = require("../gen-ai/gemini");
const { publishArticle } = require("../publishers/github-pages");

async function writeABlog(keyword) {
  if (!isValidKeyword(keyword)) {
    throw new Error(
      `${keyword} is an invalid keyword. Pass a valid keyword with at least 3 characters long`
    );
  }

  const { generatedMarkdown, title, summary, author, dateTime, imageUrl } =
    await generateMarkdownArticle(keyword);
  const articleUrl = await publishArticle(
    title,
    summary,
    generatedMarkdown,
    author,
    dateTime,
    imageUrl
  );
  return articleUrl;
}

// // Example usage
// (async () => {
//   const keyword = "SSL Stripping";
//   await writeABlog(keyword);
// })();

module.exports = {
  writeABlog,
};
