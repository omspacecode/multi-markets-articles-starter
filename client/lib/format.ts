const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const relativeFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export const formatDate = (timestamp: number | null) =>
  timestamp ? dateFormatter.format(new Date(timestamp)) : "Not published yet";

export function formatRelative(timestamp: number | null, now = Date.now()) {
  if (!timestamp) return "Draft";
  const seconds = Math.round((timestamp - now) / 1000);
  const abs = Math.abs(seconds);
  if (abs < 45) return "Just now";
  if (abs < 3600) return relativeFormatter.format(Math.round(seconds / 60), "minute");
  if (abs < 86400) return relativeFormatter.format(Math.round(seconds / 3600), "hour");
  if (abs < 86400 * 7) return relativeFormatter.format(Math.round(seconds / 86400), "day");
  return formatDate(timestamp);
}

export function secondsAgo(timestamp: number, now = Date.now()) {
  return Math.max(0, Math.round((now - timestamp) / 1000));
}

export function readingMinutes(html: string) {
  const words = html
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
