/**
 * Helpers to present post content. Pure functions, safe on server and client.
 */

/** "Fine Coding", "fine coding" and "fine-coding" all become "fine-coding". */
export function normalizeTag(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Unique, normalized tags of a post, in their original order. */
export function postTags(tags: string[] | undefined): string[] {
  return [...new Set((tags || []).map(normalizeTag).filter(Boolean))];
}

/** Tags that describe the whole blog, not a specific post. */
const GENERIC_TAGS = new Set(['fine-coding']);

/** The tag that best describes a post: the first non-generic one. */
export function primaryTag(tags: string[] | undefined): string | undefined {
  const all = postTags(tags);
  return all.find((t) => !GENERIC_TAGS.has(t)) ?? all[0];
}

/** The most used tags across posts, most frequent first. */
export function topTags(allTags: string[][], limit = 6): string[] {
  const counts = new Map<string, number>();
  for (const tags of allTags) for (const t of postTags(tags)) counts.set(t, (counts.get(t) || 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([t]) => t);
}

export function readingMinutes(markdown: string): number {
  const words = markdown.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[`*_~[\]()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Level-2 headings, for the "On this page" list. */
export function extractToc(markdown: string): { id: string; text: string }[] {
  const out: { id: string; text: string }[] = [];
  let inCode = false;
  for (const line of markdown.split('\n')) {
    if (line.trim().startsWith('```')) inCode = !inCode;
    if (inCode) continue;
    const m = /^##\s+(.+?)\s*#*\s*$/.exec(line);
    if (m) {
      const text = m[1].replace(/[*_`]/g, '');
      out.push({ id: slugifyHeading(text), text });
    }
  }
  return out;
}

/**
 * Posts often start with the cover image and a "# Title" line. The article
 * page already shows a title and a cover, so those are lifted out of the body:
 * the H1 becomes the page headline and the rest is rendered as the body.
 */
export function splitPostContent(markdown: string): { headline: string | null; body: string } {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  let i = 0;
  const skipBlank = () => { while (i < lines.length && lines[i].trim() === '') i++; };

  skipBlank();
  if (i < lines.length && /^!\[[^\]]*\]\([^)]+\)\s*$/.test(lines[i].trim())) { i++; skipBlank(); }

  let headline: string | null = null;
  const h1 = i < lines.length ? /^#\s+(.+?)\s*#*\s*$/.exec(lines[i]) : null;
  if (h1) { headline = h1[1].trim(); i++; }

  return { headline, body: lines.slice(i).join('\n').trim() };
}
