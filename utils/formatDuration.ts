export function formatDuration(
  seconds: number,
  lang: "ar" | "en" = "ar"
): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts: string[] = [];

  if (lang === "ar") {
    if (hours > 0) {
      parts.push(`${hours} ${hours === 1 ? "ساعة" : "ساعات"}`);
    }

    if (minutes > 0 || hours === 0) {
      parts.push(`${minutes} ${minutes === 1 ? "دقيقة" : "دقائق"}`);
    }

    return parts.join(" و ");
  } else {
    if (hours > 0) {
      parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
    }

    if (minutes > 0 || hours === 0) {
      parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);
    }

    return parts.join(" and ");
  }
}
