export function timeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime(); // difference in milliseconds

  if (diffMs < 0) return "in the future";

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours} ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 5) return `${weeks}w ago`;
  if (months < 12) return `${months}mon ago`;

  return `${years}y ago`;
}

export function formatTime(
  date: string | Date,
  options?: {
    showSeconds?: boolean;
  }
) {
  const d = new Date(date);

  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    ...(options?.showSeconds && { second: "2-digit" }),
    hour12: true,
  });
}
