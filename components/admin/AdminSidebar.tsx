"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/articles", label: "Articles", icon: "📰" },
  { href: "/admin/categories", label: "Catégories", icon: "📁" },
  { href: "/admin/tags", label: "Tags", icon: "🏷️" },
  { href: "/admin/authors", label: "Auteurs", icon: "✍️" },
  { href: "/admin/ads", label: "Publicités", icon: "📢" },
];

interface AdminSidebarProps {
  userName: string;
}

export function AdminSidebar({ userName }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-gray-900 text-white min-h-screen">
      <div className="p-6">
        <Link href="/admin" className="text-xl font-bold">
          Admin Panel
        </Link>
        <p className="mt-1 text-xs text-gray-400">{userName}</p>
      </div>

      <nav className="flex-1 px-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors mb-1",
              pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                ? "bg-brand-600 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            )}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-gray-800 p-4 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="block text-sm text-gray-400 hover:text-white transition-colors"
        >
          → Voir le site
        </Link>
        <button
          onClick={handleLogout}
          className="text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
