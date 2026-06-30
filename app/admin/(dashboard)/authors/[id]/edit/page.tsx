import { notFound } from "next/navigation";
import { CrudForm } from "@/components/admin/CrudForm";
import { getAdminAuthorById } from "@/lib/queries/articles";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAuthorPage({ params }: PageProps) {
  const { id } = await params;
  const author = await getAdminAuthorById(id);
  if (!author) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Éditer : {author.name}</h1>
      <CrudForm
        type="authors"
        editId={author.id}
        initialData={{
          name: author.name,
          slug: author.slug,
          bio: author.bio ?? "",
          email: author.email ?? "",
          twitter: author.twitter ?? "",
          website: author.website ?? "",
          avatar: author.avatar ?? "",
        }}
      />
    </div>
  );
}
