import { Badge, Card, CardContent, EmptyState, PageHeader, StatCard } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import type { AttendanceCellStatus } from "@/lib/lessons";
import { getStudentAttendanceOverview } from "@/lib/student-data";

export default async function StudentPage() {
  const session = await requireRole("student");
  const overview = await getStudentAttendanceOverview(session.userId);
  const studentName = overview.student?.name ?? session.name;
  const className = overview.student?.className ?? "Класс не назначен";

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Кабинет студента"
        title={studentName}
        description={className}
        actions={<Badge>Моя посещаемость</Badge>}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <StatCard label="Посещения" value={overview.summary.present} />
        <StatCard label="Пропуски" value={overview.summary.absent} />
      </div>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">Занятия</h2>
          <p className="text-sm text-zinc-600">Ваши занятия и статус посещаемости.</p>
        </div>

        {overview.lessons.length === 0 ? (
          <EmptyState
            marker="LS"
            title="Занятий пока нет"
            description="Занятия вашего класса появятся здесь после того, как администратор их создаст."
          />
        ) : (
          <div className="space-y-3">
            {overview.lessons.map((lesson) => (
              <Card key={lesson.id}>
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-zinc-950">
                        {lesson.title}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-600">
                        {formatLessonDate(lesson.date)} в {formatLessonTime(lesson.startTime)}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        Окно отметки: {lesson.checkInMinutes} мин
                      </p>
                    </div>
                    <div className="sm:pt-1">
                      <AttendanceStatusBadge status={lesson.status} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function AttendanceStatusBadge({ status }: { status: AttendanceCellStatus }) {
  if (status === "present") {
    return <Badge tone="green" className="text-sm">Присутствовал</Badge>;
  }

  if (status === "absent") {
    return (
      <Badge className="border-red-200 bg-red-50 text-sm text-red-700">
        Пропуск
      </Badge>
    );
  }

  return <Badge tone="amber" className="text-sm">Ещё не прошло</Badge>;
}

function formatLessonDate(value: string): string {
  return new Date(`${value}T00:00:00`).toLocaleDateString("ru-RU", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatLessonTime(value: string): string {
  return value.slice(0, 5);
}
