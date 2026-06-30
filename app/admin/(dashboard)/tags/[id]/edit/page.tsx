import { notFound } from "next/navigation";
import { CrudForm } from "@/components/admin/CrudForm";
import { getAdminTagById } from "@/lib/queries/articles";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTagPage({ params }: PageProps) {
  const { id } = await params;
  const tag = await getAdminTagById(id);
  if (!tag) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Éditer : {tag.name}</h1>
      <CrudForm
        type="tags"
        editId={tag.id}
        initialData={{ name: tag.name, slug: tag.slug }}
      />
    </div>
  );
}
