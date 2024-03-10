export default function formatTimeAgo(timestamp: number) {
  const secondsAgo = Math.floor((Date.now() - timestamp) / 1000);

  if (secondsAgo < 60) {
    return secondsAgo + "s ago";
  } else if (secondsAgo < 3600) {
    const minutesAgo = Math.floor(secondsAgo / 60);
    return minutesAgo + "m ago";
  } else if (secondsAgo < 86400) {
    const hoursAgo = Math.floor(secondsAgo / 3600);
    return hoursAgo + "hr ago";
  } else if (secondsAgo < 2592000) {
    const daysAgo = Math.floor(secondsAgo / 86400);
    return daysAgo === 1 ? "1 day ago" : daysAgo + " days ago";
  } else if (secondsAgo < 31536000) {
    const monthsAgo = Math.floor(secondsAgo / 2592000);
    return monthsAgo === 1 ? "1 month ago" : monthsAgo + " months ago";
  } else {
    const yearsAgo = Math.floor(secondsAgo / 31536000);
    return yearsAgo === 1 ? "1 year ago" : yearsAgo + " years ago";
  }
}
