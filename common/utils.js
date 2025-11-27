const { generateSlug } = require("random-word-slugs");
const moment = require("moment");
const os = require("os");

function convertToDateTime(dateString, timeString) {
  // Combine the date and time strings
  const dateTimeString = `${dateString} ${timeString}`.trim();

  // Parse the combined string into a Date object
  const dateTime = dateTimeString ? new Date(dateTimeString) : new Date();

  // Return the Date object
  return dateTime;
}

function getFormattedDateTime() {
  const now = new Date();

  // Define an array for three-letter month abbreviations
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Extract date components
  const month = months[now.getMonth()];
  const day = now.getDate();
  const year = now.getFullYear();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  // Determine AM/PM
  const ampm = hours >= 12 ? "PM" : "AM";
  const hourIn12Format = hours % 12 || 12; // Converts 0 to 12 for AM/PM format

  // Format the date and time string
  return `${month} ${day}, ${year} ${hourIn12Format}:${minutes}:${seconds} ${ampm}`;
}

function parseDateFormats(input) {
  // Try to parse the input as a relative time or an absolute date
  let parsedTime;

  // If the input is already in the format "MMM D, YYYY" (e.g., "Jan 6, 2025")
  if (moment(input, "MMM D, YYYY", true).isValid()) {
    parsedTime = moment(input, "MMM D, YYYY");
  } else {
    // Try to parse relative time inputs like "1 second ago", "3 minutes ago"
    parsedTime = moment(input, true);
  }

  // Default to current date/time if the input is invalid
  if (!parsedTime.isValid()) {
    parsedTime = moment();
  }

  // Return the result in the specified formats
  return {
    date: parsedTime.format("MMM DD, YYYY"), // "Jan 04, 2025"
    time: parsedTime.format("hh:mm A"), // "06:30 PM"
    dateTime: parsedTime.toISOString(), // "2025-01-04T18:30:00.000Z"
  };
}

function formatTextToUrl(text) {
  return text
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9\s]/g, "-") // Replace any non-alphanumeric character (except space) with '-'
    .replace(/\s+/g, "-") // Replace spaces (one or more) with '-'
    .replace(/-+$/g, ""); // Remove trailing hyphens if any
}

function escapeSingleQuotes(str) {
  return str.replace(/'/g, "&apos;");
}

// Function to validate the keyword
function isValidKeyword(keyword) {
  if (!keyword || typeof keyword !== "string" || keyword.trim().length < 3) {
    return false;
  }

  const alphanumericRegex = /[a-zA-Z0-9]/;
  const symbolOnlyRegex = /^[^a-zA-Z0-9]*$/;

  if (!alphanumericRegex.test(keyword) || symbolOnlyRegex.test(keyword)) {
    return false;
  }

  return true;
}

function getNewSlug(suffix) {
  const slug = generateSlug(2, {
    format: "title",
    categories: {
      adjective: ["personality", "color", "sounds", "shapes", "appearance"],
      noun: [
        "people",
        "technology",
        "media",
        "science",
        "business",
        "profession",
      ],
    },
  });
  return suffix ? `${slug} ${suffix}` : slug;
}

// Return the first non-internal IPv4 address or 'unknown'
function getServerIp() {
  let serverIp = "unknown";
  try {
    const ifaces = os.networkInterfaces();
    for (const name of Object.keys(ifaces)) {
      for (const iface of ifaces[name]) {
        if (iface.family === "IPv4" && !iface.internal) {
          serverIp = iface.address;
          break;
        }
      }
      if (serverIp !== "unknown") break;
    }
  } catch (e) {
    // keep 'unknown'
  }
  return serverIp;
}

// Return a random realistic desktop User-Agent string
function getRandomUserAgent() {
  const uas = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
  ];
  return uas[Math.floor(Math.random() * uas.length)];
}

// Sleep for ms milliseconds
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  convertToDateTime,
  getFormattedDateTime,
  parseDateFormats,
  formatTextToUrl,
  escapeSingleQuotes,
  isValidKeyword,
  getNewSlug,
  getServerIp,
  getRandomUserAgent,
  sleep,
};
