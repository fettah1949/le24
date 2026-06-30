import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const optionalImageUrl = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val || val === "") return true;
      if (val.startsWith("/") && !val.includes("..")) return true;
      try {
        const u = new URL(val);
        return u.protocol === "https:" || (u.protocol === "http:" && u.hostname === "localhost");
      } catch {
        return false;
      }
    },
    { message: "URL d'image invalide (https ou chemin local uniquement)" }
  );

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const articleSchema = z.object({
  title: z.string().min(3, "Titre requis (min 3 caractères)").max(300),
  slug: z.string().min(3).max(200).regex(slugRegex, "Slug invalide (a-z, 0-9, tirets)"),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(10, "Contenu requis").max(100_000),
  featuredImage: optionalImageUrl,
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]),
  publishedAt: z.string().optional(),
  categoryId: z.string().min(1, "Catégorie requise"),
  authorId: z.string().min(1, "Auteur requis"),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().max(300).optional(),
  ogImage: optionalImageUrl,
  isBreaking: z.boolean().default(false),
  tagIds: z.array(z.string()).max(20).default([]),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Nom requis").max(100),
  slug: z.string().min(2).max(100).regex(slugRegex, "Slug invalide"),
  description: z.string().max(500).optional(),
});

export const tagSchema = z.object({
  name: z.string().min(2, "Nom requis").max(50),
  slug: z.string().min(2).max(50).regex(slugRegex, "Slug invalide"),
});

export const authorSchema = z.object({
  name: z.string().min(2, "Nom requis").max(100),
  slug: z.string().min(2).max(100).regex(slugRegex, "Slug invalide"),
  bio: z.string().max(1000).optional(),
  avatar: optionalImageUrl,
  email: z.string().email().optional().or(z.literal("")),
  twitter: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal("")),
});

export const newsletterSchema = z.object({
  email: z.string().email("Email invalide").max(254),
});

export const adSchema = z.object({
  name: z.string().min(2, "Nom requis").max(100),
  slot: z.enum([
    "header-banner",
    "home-mid",
    "article-top",
    "article-bottom",
    "sidebar",
    "category-top",
  ]),
  type: z.enum(["IMAGE", "HTML"]),
  imageUrl: optionalImageUrl,
  linkUrl: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true;
        try {
          const u = new URL(val);
          return u.protocol === "https:" || (u.protocol === "http:" && u.hostname === "localhost");
        } catch {
          return false;
        }
      },
      { message: "URL de lien invalide" }
    ),
  htmlCode: z.string().max(5000).optional(),
  isActive: z.boolean().default(true),
  priority: z.number().int().min(0).max(100).default(0),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
});

export type AdInput = z.infer<typeof adSchema>;

export function parsePageParam(value: string | null, max = 100): number {
  const page = parseInt(value ?? "1", 10);
  if (Number.isNaN(page) || page < 1) return 1;
  return Math.min(page, max);
}

export type LoginInput = z.infer<typeof loginSchema>;
export type ArticleInput = z.infer<typeof articleSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type TagInput = z.infer<typeof tagSchema>;
export type AuthorInput = z.infer<typeof authorSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
