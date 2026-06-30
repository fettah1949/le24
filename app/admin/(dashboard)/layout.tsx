import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar userName={session.name} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
