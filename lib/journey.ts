import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getAllContent, getContent } from "@/lib/content";
import { withBasePath } from "@/lib/site";
import type {
  BaseContent,
  JourneyGallery,
  JourneyGalleryImage,
  JourneyGalleryLayout,
  JourneyGallerySection,
  JourneyStory,
} from "@/types/content";

const journeyRoot = path.join(process.cwd(), "content", "journey");
const galleriesRoot = path.join(journeyRoot, "galleries");
const storiesRoot = path.join(journeyRoot, "stories");
const galleryLayouts = new Set<JourneyGalleryLayout>(["wide", "left", "right", "offset"]);

type GalleryImageInput = string | {
  src?: unknown;
  caption?: unknown;
  featured?: unknown;
  alt?: unknown;
  width?: unknown;
  height?: unknown;
  layout?: unknown;
};

type GalleryFile = {
  presentation?: string;
  label?: string;
  introduction?: string;
  coverImages?: string[];
  images?: GalleryImageInput[];
  sections?: Array<{
    title?: unknown;
    description?: unknown;
    images?: GalleryImageInput[];
  }>;
};

function isExternalImage(src: string) {
  return /^(https?:)?\/\//.test(src) || src.startsWith("data:");
}

export function resolveJourneyImage(src: string) {
  if (isExternalImage(src)) return src;
  return withBasePath(src.startsWith("/") ? src : `/${src}`);
}

function normalizeGalleryImage(image: GalleryImageInput): JourneyGalleryImage | undefined {
  if (typeof image === "string") {
    return image.trim() ? { src: image } : undefined;
  }

  if (!image || typeof image.src !== "string" || !image.src.trim()) return undefined;

  const width = Number(image.width);
  const height = Number(image.height);
  const layout = typeof image.layout === "string" && galleryLayouts.has(image.layout as JourneyGalleryLayout)
    ? image.layout as JourneyGalleryLayout
    : undefined;

  return {
    src: image.src,
    caption: typeof image.caption === "string" ? image.caption : undefined,
    featured: image.featured === true,
    alt: typeof image.alt === "string" ? image.alt : undefined,
    width: Number.isFinite(width) && width > 0 ? width : undefined,
    height: Number.isFinite(height) && height > 0 ? height : undefined,
    layout,
  };
}

function normalizeGalleryImages(images?: GalleryImageInput[]) {
  return (images ?? [])
    .map(normalizeGalleryImage)
    .filter((image): image is JourneyGalleryImage => Boolean(image));
}

export function getJourneyPreviewImages(item: BaseContent) {
  if (item.previewImages?.length) {
    return item.previewImages.slice(0, 6).map(resolveJourneyImage);
  }

  const legacyImages = item.images?.length ? item.images : item.photos ?? [];
  const sources = item.cover && !legacyImages.includes(item.cover)
    ? [item.cover, ...legacyImages]
    : legacyImages;

  return sources.slice(0, 6).map(resolveJourneyImage);
}

export function getJourneyGallery(slug: string): JourneyGallery | undefined {
  const filePath = path.join(galleriesRoot, `${slug}.json`);
  if (!fs.existsSync(filePath)) return undefined;

  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8")) as GalleryFile;
  const sections: JourneyGallerySection[] = [];
  const ungroupedImages = normalizeGalleryImages(parsed.images);

  if (ungroupedImages.length) sections.push({ images: ungroupedImages });

  for (const section of parsed.sections ?? []) {
    const images = normalizeGalleryImages(section.images);
    if (!images.length) continue;

    sections.push({
      title: typeof section.title === "string" ? section.title : undefined,
      description: typeof section.description === "string" ? section.description : undefined,
      images,
    });
  }

  const images = sections.flatMap((section) => section.images);
  if (!images.length) return undefined;

  return {
    slug, sections, images,
    presentation: parsed.presentation === "chapters" ? "chapters" : undefined,
    label: parsed.label,
    introduction: parsed.introduction,
    coverImages: parsed.coverImages,
  };
}

export function getJourneyStory(slug: string): JourneyStory | undefined {
  const filePath = path.join(storiesRoot, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;

  const parsed = matter(fs.readFileSync(filePath, "utf8"));
  return {
    slug,
    title: typeof parsed.data.title === "string" ? parsed.data.title : undefined,
    description: typeof parsed.data.description === "string" ? parsed.data.description : undefined,
    body: parsed.content,
  };
}

export function getJourneyReadingTime(source: string) {
  const plainText = source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/[#_*`>~-]/g, " ")
    .replaceAll("[", " ")
    .replaceAll("]", " ");
  const cjkCount = (plainText.match(/[\u3400-\u9fff]/g) ?? []).length;
  const latinWords = plainText
    .replace(/[\u3400-\u9fff]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil((cjkCount / 400) + (latinWords / 220)));

  return `${minutes} min read`;
}

export function getJourneySlugs() {
  return getAllContent("journey").map(({ slug }) => ({ slug }));
}

export function getJourneyEntry(slug: string) {
  return getContent("journey", slug);
}
