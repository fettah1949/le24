import Link from "next/link";
import { getAdminArticles } from "@/lib/queries/articles";
import { formatDate } from "@/lib/utils";
import { DeleteArticleButton } from "@/components/admin/DeleteArticleButton";

export default async function AdminArticlesPage() {
  const { articles } = await getAdminArticles();

  const statusColors: Record<string, string> = {
    PUBLISHED: "bg-green-100 text-green-700",
    DRAFT: "bg-yellow-100 text-yellow-700",
    SCHEDULED: "bg-purple-100 text-purple-700",
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Articles</h1>
        <Link href="/admin/articles/new" className="btn-primary">
          + Nouvel article
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Titre</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Catégorie</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Statut</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Vues</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/articles/${article.id}/edit`}
                    className="font-medium hover:text-brand-600"
                  >
                    {article.title}
                  </Link>
                  {article.isBreaking && (
                    <span className="ml-2 rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-600">
                      Breaking
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500">{article.category.name}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[article.status]}`}>
                    {article.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {formatDate(article.publishedAt ?? article.createdAt)}
                </td>
                <td className="px-4 py-3 text-gray-500">{article.views}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/articles/${article.id}/edit`}
                    className="text-brand-600 hover:underline mr-3"
                  >
                    Éditer
                  </Link>
                  <DeleteArticleButton id={article.id} title={article.title} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
