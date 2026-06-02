import Link from "next/link";
import { notFound } from "next/navigation";
import { updateStudentPasswordAction } from "@/app/actions";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  EmptyState,
  FormError,
  Input,
  PageHeader,
  StatCard,
} from "@/components/ui";
import { getAdminStudentDetail } from "@/lib/admin-data";
import { cn } from "@/lib/cn";
import type { AttendanceCellStatus } from "@/lib/lessons";
import {
  buildStudentAttendanceCalendar,
  type StudentAttendanceCalendarDaySummary,
} from "@/lib/student-attendance";

type AdminStudentPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
    password?: string;
  }>;
};

const passwordErrorMessages: Record<string, string> = {
  password: "Введите новый пароль минимум из 8 символов.",
};

export default async function AdminStudentPage({
  params,
  searchParams,
}: AdminStudentPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const detail = await getAdminStudentDetail(id);

  if (!detail) {
    notFound();
  }

  const calendar = buildStudentAttendanceCalendar(detail.lessons);
  const backHref = detail.student.classId
    ? `/admin/classes/${detail.student.classId}`
    : "/admin/classes";
  const passwordError = query.error ? passwordErrorMessages[query.error] : null;
  const isPasswordUpdated = query.password === "updated";

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Студент"
        title={detail.student.name}
        description={`Логин: ${detail.student.login}${
          detail.student.className ? ` · класс ${detail.student.className}` : ""
        }`}
        actions={
          <Link
            href={backHref}
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
          >
            Назад к классу
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Посещения"
          value={detail.summary.present}
          description="Занятия, где студент отметился по QR."
        />
        <StatCard
          label="Пропуски"
          value={detail.summary.absent}
          description="Прошедшие занятия без отметки."
        />
        <StatCard
          label="Ещё не прошло"
          value={detail.summary.pending}
          description="Будущие занятия или открытое окно отметки."
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-zinc-950">Данные студента</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Основная карточка без чужих данных и лишних ролей.
            </p>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 text-sm">
              <div>
                <dt className="text-zinc-500">Имя</dt>
                <dd className="mt-1 font-medium text-zinc-950">{detail.student.name}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Логин</dt>
                <dd className="mt-1 font-medium text-zinc-950">{detail.student.login}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Класс</dt>
                <dd className="mt-1 font-medium text-zinc-950">
                  {detail.student.className ?? "Класс не назначен"}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Создан</dt>
                <dd className="mt-1 font-medium text-zinc-950">
                  {detail.student.createdAt.toLocaleDateString("ru-RU")}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-zinc-950">Пароль и доступ</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Текущий пароль не хранится в открытом виде и не может быть
              просмотрен. Если студент забыл пароль, задайте новый и передайте
              его студенту.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {isPasswordUpdated ? (
              <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                Пароль обновлён. Теперь студент входит с новым паролем.
              </div>
            ) : null}
            <form action={updateStudentPasswordAction} className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <input type="hidden" name="studentId" value={detail.student.id} />
              <Input
                id="student-new-password"
                name="password"
                type="password"
                label="Новый пароль"
                placeholder="Минимум 8 символов"
              />
              <Button type="submit" className="w-full sm:w-auto">
                Сменить пароль
              </Button>
            </form>
            <FormError message={passwordError} />
          </CardContent>
        </Card>
      </div>

      <section className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">
              Календарь посещаемости
            </h2>
            <p className="text-sm text-zinc-600">
              Дни подсвечиваются по статусу занятий этого студента.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <AttendanceStatusBadge status="present" />
            <AttendanceStatusBadge status="absent" />
            <AttendanceStatusBadge status="pending" />
          </div>
        </div>

        {calendar.length === 0 ? (
          <EmptyState
            marker="CL"
            title="Занятий пока нет"
            description="Когда в классе появятся занятия, здесь будет персональный календарь посещаемости студента."
          />
        ) : (
          <div className="space-y-4">
            {calendar.map((month) => (
              <Card key={month.monthKey}>
                <CardHeader>
                  <h3 className="text-base font-semibold capitalize text-zinc-950">
                    {month.title}
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                    {month.days.map((day) => (
                      <CalendarDay key={day.date} day={day} />
                    ))}
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

function CalendarDay({
  day,
}: {
  day: ReturnType<typeof buildStudentAttendanceCalendar>[number]["days"][number];
}) {
  return (
    <div
      className={cn(
        "min-h-20 rounded-md border p-2 text-left text-xs transition sm:min-h-24",
        getCalendarDayClassName(day.summary),
      )}
    >
      <div className="flex items-start justify-between gap-1">
        <div>
          <div className="text-sm font-semibold text-zinc-950">{day.day}</div>
          <div className="text-[11px] text-zinc-500">{day.weekday}</div>
        </div>
        {day.summary !== "empty" ? (
          <span className={cn("mt-1 size-2 rounded-full", getStatusDotClassName(day.summary))} />
        ) : null}
      </div>

      {day.lessons.length > 0 ? (
        <div className="mt-2 space-y-1">
          {day.lessons.slice(0, 2).map((lesson) => (
            <div key={lesson.id} className="truncate text-[11px] text-zinc-700">
              {lesson.startTime.slice(0, 5)} · {lesson.title}
            </div>
          ))}
          {day.lessons.length > 2 ? (
            <div className="text-[11px] text-zinc-500">
              ещё {day.lessons.length - 2}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function AttendanceStatusBadge({ status }: { status: AttendanceCellStatus }) {
  if (status === "present") {
    return <Badge tone="green">Посещение</Badge>;
  }

  if (status === "absent") {
    return <Badge className="border-red-200 bg-red-50 text-red-700">Пропуск</Badge>;
  }

  return <Badge tone="amber">Ещё не прошло</Badge>;
}

function getCalendarDayClassName(summary: StudentAttendanceCalendarDaySummary) {
  if (summary === "present") {
    return "border-emerald-200 bg-emerald-50";
  }

  if (summary === "absent") {
    return "border-red-200 bg-red-50";
  }

  if (summary === "pending") {
    return "border-amber-200 bg-amber-50";
  }

  return "border-zinc-200 bg-white";
}

function getStatusDotClassName(summary: StudentAttendanceCalendarDaySummary) {
  if (summary === "present") {
    return "bg-emerald-500";
  }

  if (summary === "absent") {
    return "bg-red-500";
  }

  if (summary === "pending") {
    return "bg-amber-500";
  }

  return "bg-zinc-300";
}
