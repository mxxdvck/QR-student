import Link from "next/link";
import { notFound } from "next/navigation";
import { createLessonAction, createStudentAction, deleteStudentAction } from "@/app/actions";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  ConfirmSubmitButton,
  EmptyState,
  FormError,
  Input,
  PageHeader,
  StatCard,
  TableWrapper,
} from "@/components/ui";
import {
  getClassById,
  getClassAttendanceMatrix,
  getClassLessons,
  getClassStats,
  getClassStudents,
} from "@/lib/admin-data";
import { getAttendanceCellStatus, type AttendanceCellStatus } from "@/lib/lessons";

type ClassDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

const studentErrorMessages: Record<string, string> = {
  "student-fields": "Заполните имя, логин и пароль минимум из 6 символов.",
  "student-login": "Пользователь с таким логином уже существует.",
};

const lessonErrorMessages: Record<string, string> = {
  "lesson-fields": "Заполните название, дату, время и положительное окно отметки.",
};

export default async function ClassDetailPage({
  params,
  searchParams,
}: ClassDetailPageProps) {
  const { id } = await params;
  const classItem = await getClassById(id);

  if (!classItem) {
    notFound();
  }

  const [stats, students, lessons, attendanceMatrix, query] = await Promise.all([
    getClassStats(classItem.id),
    getClassStudents(classItem.id),
    getClassLessons(classItem.id),
    getClassAttendanceMatrix(classItem.id),
    searchParams,
  ]);
  const studentError = query.error ? studentErrorMessages[query.error] : null;
  const lessonError = query.error ? lessonErrorMessages[query.error] : null;
  const completedLessons = lessons.filter(
    (lesson) => getAttendanceCellStatus(lesson, false) === "absent",
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Класс"
        title={classItem.name}
        description="Управление студентами, занятиями и посещаемостью этого класса."
        actions={
          <>
            <Badge>Класс</Badge>
            <Link
              href="/admin/classes"
              className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
            >
              Назад к классам
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Студенты"
          value={stats.students}
          description="Студенты, привязанные к классу."
        />
        <StatCard
          label="Занятия"
          value={stats.lessons}
          description="Занятия, созданные для класса."
        />
        <StatCard
          label="Прошедшие"
          value={completedLessons}
          description="Занятия с закрытым окном отметки."
        />
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-zinc-950">Добавить студента</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Студенты не регистрируются сами. Задайте им логин и стартовый пароль.
          </p>
        </CardHeader>
        <CardContent>
          <form
            action={createStudentAction}
            className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end"
          >
            <input type="hidden" name="classId" value={classItem.id} />
            <Input id="student-name" name="name" label="Имя" placeholder="Анна Петрова" />
            <Input id="student-login" name="login" label="Логин" placeholder="anna.petrova" />
            <Input
              id="student-password"
              name="password"
              type="password"
              label="Пароль"
              placeholder="Минимум 6 символов"
            />
            <Button type="submit" className="w-full lg:w-auto">
              Добавить
            </Button>
          </form>
          <FormError message={studentError} className="mt-4" />
        </CardContent>
      </Card>

      <section className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">Студенты</h2>
            <p className="text-sm text-zinc-600">Текущий список студентов этого класса.</p>
          </div>
        </div>

        {students.length === 0 ? (
          <EmptyState
            marker="ST"
            title="Студентов пока нет"
            description="Добавьте студентов с выданными логинами и паролями. Они появятся здесь и в таблице посещаемости."
          />
        ) : (
          <TableWrapper>
            <table className="min-w-full divide-y divide-zinc-200 text-sm">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-zinc-600">Имя</th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-600">Логин</th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-600">Создан</th>
                  <th className="px-4 py-3 text-right font-medium text-zinc-600">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 bg-white">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-zinc-50">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-zinc-950">
                      {student.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-700">
                      {student.login}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-600">
                      {student.createdAt.toLocaleDateString("ru-RU")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/students/${student.id}`}
                          className="font-medium text-zinc-700 transition hover:text-zinc-950"
                        >
                          Карточка
                        </Link>
                      <form action={deleteStudentAction}>
                        <input type="hidden" name="classId" value={classItem.id} />
                        <input type="hidden" name="studentId" value={student.id} />
                        <ConfirmSubmitButton
                          confirmText={`Удалить студента ${student.name}? Его отметки посещаемости тоже будут удалены.`}
                        >
                          Удалить
                        </ConfirmSubmitButton>
                      </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrapper>
        )}
      </section>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-zinc-950">Создать занятие</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Добавьте занятие и окно отметки. QR-токен будет создан автоматически.
          </p>
        </CardHeader>
        <CardContent>
          <form
            action={createLessonAction}
            className="grid gap-4 lg:grid-cols-[1fr_160px_140px_150px_auto] lg:items-end"
          >
            <input type="hidden" name="classId" value={classItem.id} />
            <Input
              id="lesson-title"
              name="title"
              label="Название"
              placeholder="Практика по математике"
            />
            <Input id="lesson-date" name="date" type="date" label="Дата" />
            <Input id="lesson-start-time" name="startTime" type="time" label="Время начала" />
            <Input
              id="lesson-check-in"
              name="checkInMinutes"
              type="number"
              min={1}
              step={1}
              defaultValue={15}
              label="Окно, мин"
            />
            <Button type="submit" className="w-full lg:w-auto">
              Создать
            </Button>
          </form>
          <FormError message={lessonError} className="mt-4" />
        </CardContent>
      </Card>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">Занятия</h2>
          <p className="text-sm text-zinc-600">Занятия, созданные для этого класса.</p>
        </div>

        {lessons.length === 0 ? (
          <EmptyState
            marker="LS"
            title="Занятий пока нет"
            description="Создайте первое занятие. На его странице будет QR-код для отметки студентов."
          />
        ) : (
          <TableWrapper>
            <table className="min-w-full divide-y divide-zinc-200 text-sm">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-zinc-600">Название</th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-600">Дата</th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-600">Начало</th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-600">Окно</th>
                  <th className="px-4 py-3 text-right font-medium text-zinc-600">Переход</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 bg-white">
                {lessons.map((lesson) => (
                  <tr key={lesson.id} className="hover:bg-zinc-50">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-zinc-950">
                      {lesson.title}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-700">
                      {formatLessonDate(lesson.date)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-700">
                      {formatLessonTime(lesson.startTime)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-700">
                      {lesson.checkInMinutes} мин
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/lessons/${lesson.id}`}
                        className="font-medium text-zinc-700 transition hover:text-zinc-950"
                      >
                        Открыть
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrapper>
        )}
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">Посещаемость</h2>
          <p className="text-sm text-zinc-600">
            Строки - студенты. Столбцы - занятия по датам.
          </p>
        </div>

        {attendanceMatrix.students.length === 0 || attendanceMatrix.lessons.length === 0 ? (
          <EmptyState
            marker="AT"
            title="Таблица посещаемости пока не готова"
            description="Добавьте хотя бы одного студента и одно занятие, чтобы увидеть таблицу."
          />
        ) : (
          <TableWrapper>
            <table className="min-w-full divide-y divide-zinc-200 text-sm">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="sticky left-0 z-10 min-w-48 bg-zinc-50 px-4 py-3 text-left font-medium text-zinc-600">
                    Студент
                  </th>
                  {attendanceMatrix.lessons.map((lesson) => (
                    <th
                      key={lesson.id}
                      className="min-w-36 px-4 py-3 text-left font-medium text-zinc-600"
                    >
                      <Link
                        href={`/admin/lessons/${lesson.id}`}
                        className="block text-zinc-800 transition hover:text-zinc-950"
                      >
                        {formatShortLessonDate(lesson.date)}
                      </Link>
                      <span className="mt-1 block text-xs font-normal text-zinc-500">
                        {formatLessonTime(lesson.startTime)}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 bg-white">
                {attendanceMatrix.students.map((student) => (
                  <tr key={student.id} className="hover:bg-zinc-50">
                    <td className="sticky left-0 z-10 whitespace-nowrap bg-white px-4 py-3 shadow-[1px_0_0_#e4e4e7]">
                      <p className="font-medium text-zinc-950">{student.name}</p>
                      <p className="text-xs text-zinc-500">{student.login}</p>
                    </td>
                    {student.cells.map((cell) => (
                      <td key={cell.lessonId} className="whitespace-nowrap px-4 py-3">
                        <AttendanceStatusBadge status={cell.status} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrapper>
        )}
      </section>
    </div>
  );
}

function AttendanceStatusBadge({ status }: { status: AttendanceCellStatus }) {
  if (status === "present") {
    return <Badge tone="green">Присутствовал</Badge>;
  }

  if (status === "absent") {
    return (
      <Badge className="border-red-200 bg-red-50 text-red-700">
        Пропуск
      </Badge>
    );
  }

  return <Badge tone="amber">Ещё не прошло</Badge>;
}

function formatLessonDate(value: string): string {
  return new Date(`${value}T00:00:00`).toLocaleDateString("ru-RU", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatShortLessonDate(value: string): string {
  return new Date(`${value}T00:00:00`).toLocaleDateString("ru-RU", {
    month: "short",
    day: "numeric",
  });
}

function formatLessonTime(value: string): string {
  return value.slice(0, 5);
}
