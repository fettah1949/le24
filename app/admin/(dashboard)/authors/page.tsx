import Link from "next/link";
import { getAdminAuthors } from "@/lib/queries/articles";
import { DeleteButton } from "@/components/admin/CrudForm";

export default async function AdminAuthorsPage() {
  const authors = await getAdminAuthors();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Auteurs</h1>
        <Link href="/admin/authors/new" className="btn-primary">
          + Nouvel auteur
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
            {authors.map((author) => (
              <tr key={author.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{author.name}</td>
                <td className="px-4 py-3 text-gray-500">{author.slug}</td>
                <td className="px-4 py-3 text-gray-500">{author._count.articles}</td>
                <td className="px-4 py-3 text-right space-x-3">
                  <Link href={`/admin/authors/${author.id}/edit`} className="text-brand-600 hover:underline">
                    Éditer
                  </Link>
                  <DeleteButton id={author.id} type="authors" name={author.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
