import Link from "next/link";
import { getAdminAds } from "@/lib/queries/ads";
import { AD_SLOTS } from "@/lib/ads/slots";
import { DeleteButton } from "@/components/admin/CrudForm";

export default async function AdminAdsPage() {
  const ads = await getAdminAds();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Publicités</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez les bannières affichées sur le site public
          </p>
        </div>
        <Link href="/admin/ads/new" className="btn-primary">
          + Nouvelle publicité
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Nom</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Emplacement</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Type</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Priorité</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Statut</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {ads.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Aucune publicité. Créez-en une ou configurez Google AdSense dans .env
                </td>
              </tr>
            ) : (
              ads.map((ad) => (
                <tr key={ad.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{ad.name}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {AD_SLOTS[ad.slot as keyof typeof AD_SLOTS]?.label ?? ad.slot}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{ad.type}</td>
                  <td className="px-4 py-3 text-gray-500">{ad.priority}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        ad.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {ad.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link
                      href={`/admin/ads/${ad.id}/edit`}
                      className="text-brand-600 hover:underline"
                    >
                      Éditer
                    </Link>
                    <DeleteButton id={ad.id} type="ads" name={ad.name} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
