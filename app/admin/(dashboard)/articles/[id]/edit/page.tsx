import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/admin/ArticleForm";
import {
  getAdminArticleById,
  getAllCategoriesForSelect,
  getAllAuthorsForSelect,
  getAllTagsForSelect,
} from "@/lib/queries/articles";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: PageProps) {
  const { id } = await params;

  const [article, categories, authors, tags] = await Promise.all([
    getAdminArticleById(id),
    getAllCategoriesForSelect(),
    getAllAuthorsForSelect(),
    getAllTagsForSelect(),
  ]);

  if (!article) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Éditer : {article.title}</h1>
      <ArticleForm
        categories={categories}
        authors={authors}
        tags={tags}
        initialData={{
          id: article.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt ?? "",
          content: article.content,
          featuredImage: article.featuredImage ?? "",
          status: article.status,
          publishedAt: article.publishedAt?.toISOString() ?? "",
          categoryId: article.categoryId,
          authorId: article.authorId,
          seoTitle: article.seoTitle ?? "",
          seoDescription: article.seoDescription ?? "",
          ogImage: article.ogImage ?? "",
          isBreaking: article.isBreaking,
          tagIds: article.tags.map((t) => t.tagId),
        }}
      />
    </div>
  );
}
