import Link from "next/link";
import type { ReactNode } from "react";
import { Badge, Button } from "@/components/ui";
import { logoutAction } from "@/app/actions";
import { cn } from "@/lib/cn";

type NavItem = {
  href: string;
  label: string;
};

type AppShellProps = {
  children: ReactNode;
  navItems: NavItem[];
  roleLabel: string;
  userName: string;
  variant?: "top" | "sidebar";
};

export function AppShell({
  children,
  navItems,
  roleLabel,
  userName,
  variant = "top",
}: AppShellProps) {
  if (variant === "sidebar") {
    return (
      <main className="min-h-dvh bg-[#f7f9fb] text-slate-950 lg:flex lg:h-dvh lg:overflow-hidden">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white px-5 py-6 lg:flex lg:h-dvh lg:flex-col lg:overflow-y-auto">
          <ShellBrand />

          <nav aria-label="Админка" className="mt-8 space-y-2">
            {navItems.map((item) => (
              <SidebarNavLink key={`${item.href}:${item.label}`} href={item.href}>
                {item.label}
              </SidebarNavLink>
            ))}
          </nav>

          <div className="mt-auto space-y-4 border-t border-slate-100 pt-5">
            <div>
              <p className="truncate text-sm font-semibold text-slate-950">{userName}</p>
              <p className="text-xs text-slate-500">{roleLabel}</p>
            </div>
            <form action={logoutAction}>
              <Button type="submit" variant="ghost" className="w-full justify-start px-3">
                Выйти
              </Button>
            </form>
          </div>
        </aside>

        <div className="min-w-0 flex-1 lg:h-dvh lg:overflow-y-auto">
          <MobileShellHeader navItems={navItems} roleLabel={roleLabel} userName={userName} />
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
            {children}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9fb] text-slate-950">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-0">
          <div className="flex items-center justify-between gap-4">
            <ShellBrand />
            <Badge className="lg:hidden">{roleLabel}</Badge>
          </div>

          <nav className="-mx-1 flex gap-1 overflow-x-auto px-1">
            {navItems.map((item) => (
              <TopNavLink key={`${item.href}:${item.label}`} href={item.href}>
                {item.label}
              </TopNavLink>
            ))}
          </nav>

          <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 lg:border-t-0 lg:pt-0">
            <div className="min-w-0 text-left lg:text-right">
              <p className="truncate text-sm font-semibold text-slate-950">{userName}</p>
              <p className="text-xs text-slate-500">{roleLabel}</p>
            </div>
            <form action={logoutAction}>
              <Button type="submit" variant="secondary">
                Выйти
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
    </main>
  );
}

function MobileShellHeader({
  navItems,
  roleLabel,
  userName,
}: {
  navItems: NavItem[];
  roleLabel: string;
  userName: string;
}) {
  return (
    <div className="border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
      <div className="flex items-center justify-between gap-4">
        <ShellBrand />
        <Badge tone="blue">{roleLabel}</Badge>
      </div>

      <nav aria-label="Админка" className="mt-3 flex gap-1 overflow-x-auto">
        {navItems.map((item) => (
          <TopNavLink key={`${item.href}:${item.label}`} href={item.href}>
            {item.label}
          </TopNavLink>
        ))}
      </nav>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <p className="truncate text-sm font-semibold text-slate-950">{userName}</p>
        <form action={logoutAction}>
          <Button type="submit" variant="secondary">
            Выйти
          </Button>
        </form>
      </div>
    </div>
  );
}

function ShellBrand() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-800 ring-1 ring-blue-100">
        QR
      </span>
      <span>
        <span className="block text-sm font-bold leading-5 text-slate-950">QR-учет</span>
        <span className="block text-xs text-slate-500">Посещаемость</span>
      </span>
    </Link>
  );
}

function SidebarNavLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <Link
      href={href}
      className="flex h-11 items-center rounded-lg px-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
    >
      {children}
    </Link>
  );
}

function TopNavLink({ children, className, href }: { children: ReactNode; className?: string; href: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "shrink-0 rounded-md px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-100",
        className,
      )}
    >
      {children}
    </Link>
  );
}
