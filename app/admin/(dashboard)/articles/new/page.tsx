import { ArticleForm } from "@/components/admin/ArticleForm";
import {
  getAllCategoriesForSelect,
  getAllAuthorsForSelect,
  getAllTagsForSelect,
} from "@/lib/queries/articles";

export default async function NewArticlePage() {
  const [categories, authors, tags] = await Promise.all([
    getAllCategoriesForSelect(),
    getAllAuthorsForSelect(),
    getAllTagsForSelect(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nouvel article</h1>
      <ArticleForm categories={categories} authors={authors} tags={tags} />
    </div>
  );
}
