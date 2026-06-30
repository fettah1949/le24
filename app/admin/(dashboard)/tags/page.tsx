import Link from "next/link";
import { getAdminTags } from "@/lib/queries/articles";
import { DeleteButton } from "@/components/admin/CrudForm";

export default async function AdminTagsPage() {
  const tags = await getAdminTags();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tags</h1>
        <Link href="/admin/tags/new" className="btn-primary">
          + Nouveau tag
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
            {tags.map((tag) => (
              <tr key={tag.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{tag.name}</td>
                <td className="px-4 py-3 text-gray-500">{tag.slug}</td>
                <td className="px-4 py-3 text-gray-500">{tag._count.articles}</td>
                <td className="px-4 py-3 text-right space-x-3">
                  <Link href={`/admin/tags/${tag.id}/edit`} className="text-brand-600 hover:underline">
                    Éditer
                  </Link>
                  <DeleteButton id={tag.id} type="tags" name={tag.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
