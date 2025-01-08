require("dotenv").config();
const axios = require("axios");
const https = require("https");

const staticImageUrls = [
  "https://dwtyzx6upklss.cloudfront.net/Pictures/460x307/4/2/3/5423_cybersecurity_880937.png",
  "https://vitbhopal.ac.in/wp-content/uploads/2022/04/Cyber-Security1.jpg",
  "https://www.vaughn.edu/wp-content/uploads/2024/05/vaughn-Cybersecurity-blog-header-1200x630-1.png",
  "https://cdn.builtin.com/cdn-cgi/image/f=auto,fit=cover,w=1200,h=635,q=80/https://builtin.com/sites/www.builtin.com/files/2024-10/cybersecurity.png",
  "https://www.rklcpa.com/wp-content/uploads/2022/09/Top-10-Cybersecurity-Threats-Featured.png",
  "https://www.2n.com/-/media/Images/Web/Cybersecurity/Simplify-Cybersecurity_1646x964.png",
  "https://www.mccormick.northwestern.edu/electrical-computer/images/graduate/masters/cybersecurity-header.png",
  "https://eccweb.s3.ap-south-1.amazonaws.com/wp-content/uploads/2023/05/26103827/The-Ethics-of-Hacking-Navigating-the-Gray-Area-of-Cybersecurity-1.png",
];

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false, // Disable SSL validation
    keepAlive: true,
  }),
});

async function searchImageUrl(keyword) {
  try {
    const query = `${keyword} Cybersecurity`.trim();
    const apiUrl = `https://www.googleapis.com/customsearch/v1?q=${query}&cx=${process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID_CX}&searchType=image&key=${process.env.GOOGLE_CUSTOM_SEARCH_API_KEY}&imageType=photo`;
    const { data } = await axiosInstance.get(apiUrl, {
      maxBodyLength: Infinity,
    });
    if (data?.items && data?.items.length > 0) {
      return data.items[0].link;
    }
  } catch (error) {
    console.error(`Error fetching image for query: ${query}`, error.message);
  }
  return staticImageUrls[Math.floor(Math.random() * staticImageUrls.length)];
}

module.exports = {
  searchImageUrl,
};
