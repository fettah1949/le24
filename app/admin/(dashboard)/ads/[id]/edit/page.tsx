import { notFound } from "next/navigation";
import { AdForm } from "@/components/admin/AdForm";
import { getAdminAdById } from "@/lib/queries/ads";

interface PageProps {
  params: Promise<{ id: string }>;
}

function toLocalDatetime(date: Date | null): string {
  if (!date) return "";
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export default async function EditAdPage({ params }: PageProps) {
  const { id } = await params;
  const ad = await getAdminAdById(id);
  if (!ad) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Éditer la publicité</h1>
      <AdForm
        editId={ad.id}
        initialData={{
          name: ad.name,
          slot: ad.slot,
          type: ad.type,
          imageUrl: ad.imageUrl ?? "",
          linkUrl: ad.linkUrl ?? "",
          htmlCode: ad.htmlCode ?? "",
          isActive: ad.isActive,
          priority: ad.priority,
          startDate: toLocalDatetime(ad.startDate),
          endDate: toLocalDatetime(ad.endDate),
        }}
      />
    </div>
  );
}
