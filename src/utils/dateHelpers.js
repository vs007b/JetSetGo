import moment from 'moment';

export function get24HourTimeFromDate(dateString) {
  const dateObject = new Date(dateString);

  if (isNaN(dateObject.getTime())) {
    // Handle invalid date string
    return null;
  }

  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  return dateObject.toLocaleTimeString("en-US", options);
}

export function convertHoursMinutesToSeconds(timeString) {
  const regex = /(\d+)h\s*(\d*)m/;
  const match = timeString.match(regex);

  if (!match) {
    // Handle invalid input
    return null;
  }

  const hours = parseInt(match[1], 10) || 0;
  const minutes = parseInt(match[2], 10) || 0;

  const totalSeconds = hours * 3600 + minutes * 60;
  return totalSeconds;
}

export function extractDateFromDateAndTime(dateTimeString) {
  const formattedDate = moment(dateTimeString).format('YYYY-MM-DD');
  return formattedDate;
}

export function convertToAlphanumericDateFormat(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    // Handle invalid date string
    return null;
  }

  const alphanumericDate = date.toLocaleDateString('en-US', options);
  return alphanumericDate;
}
