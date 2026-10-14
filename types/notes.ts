import type { BaseContent } from "./content";
export const noteCategories = ["Learning", "Exploring", "Thinking"] as const;
export const noteTypes = ["Moment", "Log", "Article"] as const;
export type NoteCategory = typeof noteCategories[number];
export type NoteType = typeof noteTypes[number];
export interface NoteContent extends BaseContent {
  date: string;
  category: NoteCategory;
  type: NoteType;
  draft: boolean;
}
export type NoteSummary = Omit<NoteContent, "body">;
