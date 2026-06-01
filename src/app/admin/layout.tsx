import { AppShell } from "@/components/layout/app-shell";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireRole("admin");

  return (
    <AppShell
      navItems={[
        { href: "/admin", label: "Панель" },
        { href: "/admin/classes", label: "Классы" },
        { href: "/admin/classes", label: "Посещаемость" },
      ]}
      roleLabel="Администратор"
      userName={session.name}
      variant="sidebar"
    >
      {children}
    </AppShell>
  );
}
