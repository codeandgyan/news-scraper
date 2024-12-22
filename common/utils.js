function convertToDateTime(dateString, timeString) {
  // Combine the date and time strings
  const dateTimeString = `${dateString} ${timeString}`;

  // Parse the combined string into a Date object
  const dateTime = new Date(dateTimeString);

  // Return the Date object
  return dateTime;
}

module.exports = {
  convertToDateTime,
};
