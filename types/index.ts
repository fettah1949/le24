export interface ArticleCardData {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  publishedAt: Date | null;
  isBreaking: boolean;
  views: number;
  category: {
    name: string;
    slug: string;
  };
  author: {
    name: string;
    slug: string;
  };
}

export interface PaginationMeta {
  page: number;
  pages: number;
  total: number;
  limit: number;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface AdminStats {
  totalArticles: number;
  published: number;
  drafts: number;
  scheduled: number;
  categories: number;
  authors: number;
  tags: number;
}

export interface ArticleFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED";
  publishedAt: string;
  categoryId: string;
  authorId: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  isBreaking: boolean;
  tagIds: string[];
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
}

export interface TagFormData {
  name: string;
  slug: string;
}

export interface AuthorFormData {
  name: string;
  slug: string;
  bio: string;
  avatar: string;
  email: string;
  twitter: string;
  website: string;
}
