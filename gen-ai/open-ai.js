const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to generate a prompt and call OpenAI API
async function generateMarkdownArticle(keyword) {
  try {
    // System and user context for the article
    const systemContext = `
      You are a cybersecurity and hacking expert who explains concepts in an engaging way.
      You create markdown articles that break down complex topics into beginner-friendly technical explanations.
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
      6. ## Sections (up to N Sections) : A 3-5 minute read breaking down the concept with use cases, applications, a short case study, and any necessary details to trigger interest.
      Ensure the formatting is professional with paragraphs, bullet points, and other necessary elements.
      `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        { role: "system", content: systemContext },
        { role: "user", content: userPrompt },
      ],
    });

    // Extract and return the generated content
    const generatedMarkdown = response.choices[0].message.trim();

    // Check if the response indicates an invalid keyword
    if (generatedMarkdown.includes("INVALID KEYWORD")) {
      return {
        generatedMarkdown: "",
        title: "Invalid Keyword",
        summary: "INVALID KEYWORD. Please provide a valid keyword.",
      };
    }

    // Extract title and summary from the markdown
    const titleMatch = generatedMarkdown.match(/^#\s+(.*)$/m);
    const summaryMatch = generatedMarkdown.match(/^##\s+Summary\n\n(.*)$/m);

    const title = titleMatch ? titleMatch[1] : "Title not found";
    const summary = summaryMatch ? summaryMatch[1] : "Summary not found";

    return { generatedMarkdown, title, summary };
  } catch (error) {
    console.error("Error generating markdown article:", error);
    throw error;
  }
}

// Example usage
(async () => {
  const keyword = "Steganography"; // Replace with dynamic user input if needed
  const { generatedMarkdown, title, summary } = await generateMarkdownArticle(
    keyword
  );
  console.log("Generated Markdown:", generatedMarkdown);
  console.log("Extracted Title:", title);
  console.log("Extracted Summary:", summary);
})();
