import Link from "next/link";
import { getAdminCategories } from "@/lib/queries/articles";
import { DeleteButton } from "@/components/admin/CrudForm";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Catégories</h1>
        <Link href="/admin/categories/new" className="btn-primary">
          + Nouvelle catégorie
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Nom</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Slug</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Articles</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{cat.name}</td>
                <td className="px-4 py-3 text-gray-500">{cat.slug}</td>
                <td className="px-4 py-3 text-gray-500">{cat._count.articles}</td>
                <td className="px-4 py-3 text-right space-x-3">
                  <Link href={`/admin/categories/${cat.id}/edit`} className="text-brand-600 hover:underline">
                    Éditer
                  </Link>
                  <DeleteButton id={cat.id} type="categories" name={cat.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
