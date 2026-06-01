import { AppShell } from "@/components/layout/app-shell";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireRole("student");

  return (
    <AppShell
      navItems={[{ href: "/student", label: "Кабинет" }]}
      roleLabel="Студент"
      userName={session.name}
    >
      {children}
    </AppShell>
  );
}
