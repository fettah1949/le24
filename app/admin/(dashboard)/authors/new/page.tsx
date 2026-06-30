import { CrudForm } from "@/components/admin/CrudForm";

export default function NewAuthorPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nouvel auteur</h1>
      <CrudForm type="authors" />
    </div>
  );
}
