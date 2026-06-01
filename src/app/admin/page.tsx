import Link from "next/link";
import { Card, CardContent, EmptyState, PageHeader } from "@/components/ui";
import { getAdminDashboardStats } from "@/lib/admin-data";

const quickActions = [
  {
    href: "/admin/classes",
    title: "Создать класс",
    description: "Откройте раздел классов и добавьте новую учебную группу.",
    variant: "primary",
  },
  {
    href: "/admin/classes",
    title: "Перейти к классам",
    description: "Посмотреть классы, студентов, занятия и таблицу посещаемости.",
    variant: "secondary",
  },
] as const;

export default async function AdminPage() {
  const stats = await getAdminDashboardStats();
  const isEmpty = stats.classes === 0 && stats.students === 0 && stats.lessons === 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Админка"
        title="Панель администратора"
        description="Короткая сводка по классам, студентам и занятиям в системе посещаемости."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardStatCard
          label="Классы"
          value={stats.classes}
          description="Учебные группы в системе."
        />
        <DashboardStatCard
          label="Студенты"
          value={stats.students}
          description="Студенческие аккаунты."
        />
        <DashboardStatCard
          label="Занятия"
          value={stats.lessons}
          description="Занятия с QR-отметкой."
        />
      </div>

      {isEmpty ? (
        <EmptyState
          marker="QR"
          title="Данных пока нет"
          description="Начните с создания класса. После этого здесь появятся студенты, занятия и статистика посещаемости."
          action={
            <Link
              href="/admin/classes"
              className="inline-flex h-10 items-center justify-center rounded-md border border-blue-800 bg-blue-800 px-4 text-sm font-semibold text-white transition hover:border-blue-900 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
            >
              Создать класс
            </Link>
          }
        />
      ) : null}

      <Card>
        <CardContent>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold tracking-tight text-slate-950">
              Быстрые действия
            </h2>
            <p className="text-sm leading-6 text-slate-600">
              Основные переходы для подготовки классов и занятий.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className={
                  action.variant === "primary"
                    ? "rounded-lg border border-blue-800 bg-blue-800 p-4 text-white transition hover:border-blue-900 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    : "rounded-lg border border-slate-200 bg-white p-4 text-slate-950 transition hover:border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
                }
              >
                <p className="font-semibold">{action.title}</p>
                <p
                  className={
                    action.variant === "primary"
                      ? "mt-2 text-sm leading-6 text-blue-50"
                      : "mt-2 text-sm leading-6 text-slate-600"
                  }
                >
                  {action.description}
                </p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardStatCard({
  description,
  label,
  value,
}: {
  description: string;
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardContent>
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <p className="mt-4 text-4xl font-bold tracking-tight text-blue-800">{value}</p>
        <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      </CardContent>
    </Card>
  );
}
