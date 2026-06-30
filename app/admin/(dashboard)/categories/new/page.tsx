import { CrudForm } from "@/components/admin/CrudForm";

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nouvelle catégorie</h1>
      <CrudForm type="categories" />
    </div>
  );
}
