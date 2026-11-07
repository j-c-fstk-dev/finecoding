/**
 * Dates are rendered on the server (UTC) and again in the reader's browser
 * (their local time zone). Formatting with the runtime's default zone makes the
 * two disagree near midnight, which breaks React hydration (error #418).
 * Always format in one fixed zone so server and browser produce the same text.
 */
export const BLOG_TIME_ZONE = process.env.NEXT_PUBLIC_BLOG_TIMEZONE || 'America/Sao_Paulo';

const longFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: BLOG_TIME_ZONE,
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

const shortFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: BLOG_TIME_ZONE,
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

/** "November 6, 2026" */
export function formatPostDate(date: Date | string | number): string {
  return longFormat.format(new Date(date));
}

/** "Nov 6, 2026" */
export function formatShortDate(date: Date | string | number): string {
  return shortFormat.format(new Date(date));
}
