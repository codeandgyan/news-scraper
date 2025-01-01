require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { searchImageUrl } = require("./image-url-lookup");
const { generateSlug } = require("random-word-slugs");
const { getFormattedDateTime } = require("../common/utils");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to generate a prompt and call Google Gemini API
async function generateMarkdownArticle(keyword) {
  try {
    const imageUrl = await searchImageUrl(keyword);
    const author = generateSlug(2, {
      format: "title",
      categories: {
        adjective: ["personality"],
        noun: ["people", "technology"],
      },
    });
    const dateTime = getFormattedDateTime();
    // System and user context for the article
    const systemContext = `
      You are a cybersecurity and hacking expert who explains concepts in an engaging way.
      You create markdown articles that break down complex topics into beginner-friendly explanations.
      Articles include a title, summary, description, use cases, and case studies, presented professionally.
      `;

    const userPrompt = `
      The user has provided the keyword: ${keyword}.
      If the keyword is not related to cybersecurity, hacking, or privacy, respond with the following:
      "INVALID KEYWORD"
  
      Otherwise, write a markdown article following this structure:
  
      1. # An intriguing title, up to 10 words.
      2. ***Author***: *${author}*\n
      3. ***Date***: *${dateTime}*\n
      4. ![${keyword}](${imageUrl})
      5. ## Summary: 4-5 lines summarizing the article in around 25 words.
      6. ## Sections (upto N Sections) : A 3-5 minute read breaking down the concept with use cases, applications, a short case study, and any necessary details to trigger interest.
      Ensure the formatting is professional with paragraphs, bullet points, and other necessary elements.
      `;

    const prompt = `${systemContext}\n${userPrompt}`;
    const result = await model.generateContent(prompt);

    // Extract and return the generated content
    const generatedMarkdown = result.response.text().trim();

    // Check if the response indicates an invalid keyword
    if (generatedMarkdown.includes("INVALID KEYWORD")) {
      throw new Error(`${keyword} provided is not related to cybersecurity`);
    }

    // Extract title and summary from the markdown
    const titleMatch = generatedMarkdown.match(/^#\s+(.*)$/m);
    const summaryMatch = generatedMarkdown.match(
      /##\s+Summary:\s*\n\n(.*?)(?=\n\n|\n?$)/s
    );

    const title = titleMatch ? titleMatch[1] : "Title not found";
    const summary = summaryMatch ? summaryMatch[1] : "Summary not found";

    return { generatedMarkdown, title, summary, author, dateTime, imageUrl };
  } catch (error) {
    console.error("Error generating markdown article:", error);
    throw error;
  }
}

module.exports = {
  generateMarkdownArticle,
};
