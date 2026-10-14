import { getAllContent } from "@/lib/content";
import { noteCategories, noteTypes, type NoteContent, type NoteSummary } from "@/types/notes";
function validDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}
export function getNotes(): NoteContent[] {
  return getAllContent("notes").map((raw) => {
    const item = raw as NoteContent;
    const fail = (field: string): never => { throw new Error(`[notes/${item.slug}] Invalid ${field}`); };
    if (!item.title.trim()) fail("title");
    if (!item.description.trim()) fail("description");
    if (!validDate(item.date)) fail("date (YYYY-MM-DD)");
    if (item.updated && !validDate(item.updated)) fail("updated (YYYY-MM-DD)");
    if (!noteCategories.includes(item.category)) fail("category");
    if (!noteTypes.includes(item.type)) fail("type");
    if (!Array.isArray(item.tags) || item.tags.some((tag) => typeof tag !== "string")) fail("tags");
    if (item.draft !== undefined && typeof item.draft !== "boolean") fail("draft");
    if (item.cover && !item.coverAlt?.trim()) fail("coverAlt");
    const tags = new Map<string, string>();
    for (const rawTag of item.tags) {
      const tag = rawTag.trim().replace(/^#+/, "").trim();
      if (tag) tags.set(tag.toLocaleLowerCase(), tags.get(tag.toLocaleLowerCase()) ?? tag);
    }
    return { ...item, draft: item.draft ?? false, tags: [...tags.values()] };
  }).sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug, "en"));
}
export function getNote(slug: string) { return getNotes().find((item) => item.slug === slug); }
export function getNoteSummaries(): NoteSummary[] {
  return getNotes().map((item) => {
    const { body, ...summary } = item;
    void body;
    return summary;
  });
}
