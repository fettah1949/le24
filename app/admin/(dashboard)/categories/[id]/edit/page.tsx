import { notFound } from "next/navigation";
import { CrudForm } from "@/components/admin/CrudForm";
import { getAdminCategoryById } from "@/lib/queries/articles";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const category = await getAdminCategoryById(id);
  if (!category) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Éditer : {category.name}</h1>
      <CrudForm
        type="categories"
        editId={category.id}
        initialData={{
          name: category.name,
          slug: category.slug,
          description: category.description ?? "",
        }}
      />
    </div>
  );
}
