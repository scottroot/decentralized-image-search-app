const timeSince = (dt, short) => {
  const seconds = short ? "s" : " seconds";
  const minute = short ? "m" : " minute";
  const minutes = short ? "m" : " minutes";
  const hour = short ? "hr" : " hour";
  const hours = short ? "hr" : " hours";
  const day = short ? "d" : " day";
  const days = short ? "d" : " days";
  const weeks = short ? "wk" : " weeks";
  const month = short ? "mo" : " month";
  const months = short ? "mo" : " months";

  const sourceTime = String(dt)?.length > 10 ? Math.floor(dt / 1000) : dt;
  const secondsSince = (Date.now()/1000) - sourceTime;
  if (secondsSince <= 60) {
    if (secondsSince === 1) return `${Math.floor(secondsSince)}${seconds} ago`;
    return `${Math.floor(secondsSince)}${seconds} ago`;
  }
  const minutesSince = secondsSince/60;
  if (minutesSince <= 60) {
    if (minutesSince < 1) return `just now`;
    if (minutesSince < 2) return `${Math.floor(minutesSince)}${minute} ago`;
    return `${Math.floor(minutesSince)}${minutes} ago`;
  }
  const hoursSince = minutesSince/60;
  if (hoursSince <= 24) {
    if (hoursSince === 1) return `${Math.floor(hoursSince)}${hour} ago`;
    return `${Math.floor(hoursSince)}${hours} ago`;
  }
  const daysSince = hoursSince/24;
  if (daysSince < 2) return `1${day} ago`;
  if (daysSince <= 13) return `${Math.floor(daysSince)}${days} ago`;
  const weeksSince = daysSince/7;
  if (weeksSince <= 3) return `${Math.floor(daysSince/7)}${weeks} ago`;
  const monthsSince = daysSince/30.5;
  if (monthsSince < 2) return `1${month} ago`;
  return `${Math.floor(monthsSince)}${months} ago`;
}

export default timeSince