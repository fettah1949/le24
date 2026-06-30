import { CrudForm } from "@/components/admin/CrudForm";

export default function NewTagPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nouveau tag</h1>
      <CrudForm type="tags" />
    </div>
  );
}
