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

function formatTextToUrl(text) {
  return text
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9\s]/g, "-") // Replace any non-alphanumeric character (except space) with '-'
    .replace(/\s+/g, "-") // Replace spaces (one or more) with '-'
    .replace(/-+$/g, ""); // Remove trailing hyphens if any
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

module.exports = {
  convertToDateTime,
  getFormattedDateTime,
  formatTextToUrl,
  isValidKeyword,
};
