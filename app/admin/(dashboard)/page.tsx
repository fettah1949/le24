import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAdminStats } from "@/lib/queries/articles";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const stats = await getAdminStats();

  const cards = [
    { label: "Total articles", value: stats.totalArticles, href: "/admin/articles", color: "bg-blue-500" },
    { label: "Publiés", value: stats.published, href: "/admin/articles", color: "bg-green-500" },
    { label: "Brouillons", value: stats.drafts, href: "/admin/articles", color: "bg-yellow-500" },
    { label: "Planifiés", value: stats.scheduled, href: "/admin/articles", color: "bg-purple-500" },
    { label: "Catégories", value: stats.categories, href: "/admin/categories", color: "bg-indigo-500" },
    { label: "Auteurs", value: stats.authors, href: "/admin/authors", color: "bg-pink-500" },
    { label: "Tags", value: stats.tags, href: "/admin/tags", color: "bg-orange-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-gray-500">Bienvenue, {session.name}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className={`inline-block rounded-lg ${card.color} px-2 py-1 text-xs font-bold text-white`}>
              {card.label}
            </div>
            <p className="mt-3 text-3xl font-bold">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
