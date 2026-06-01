import Link from "next/link";
import { createClassAction } from "@/app/actions";
import {
  Button,
  Badge,
  Card,
  CardContent,
  CardHeader,
  EmptyState,
  Input,
  PageHeader,
  TableWrapper,
} from "@/components/ui";
import { getClassesWithStats } from "@/lib/admin-data";

type ClassesPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function ClassesPage({ searchParams }: ClassesPageProps) {
  const [classRows, params] = await Promise.all([getClassesWithStats(), searchParams]);
  const errorMessage =
    params.error === "missing-name" ? "Введите название класса перед созданием." : null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Админка"
        title="Классы"
        description="Создавайте учебные группы, а затем добавляйте студентов и занятия внутри класса."
      />

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-zinc-950">Создать класс</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Используйте короткое название, которое легко узнать в таблице посещаемости.
          </p>
        </CardHeader>
        <CardContent>
          <form action={createClassAction} className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <Input
              id="class-name"
              label="Название класса"
              name="name"
              placeholder="Группа А-101"
              error={errorMessage}
              required
            />
            <Button type="submit" className="h-11">
              Создать класс
            </Button>
          </form>
        </CardContent>
      </Card>

      {classRows.length === 0 ? (
        <EmptyState
          marker="CL"
          title="Классов пока нет"
          description="Создайте первый класс. Студенты, занятия, QR-коды и посещаемость будут управляться внутри класса."
        />
      ) : (
        <TableWrapper>
          <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Класс</th>
                <th className="px-4 py-3 font-medium">Студенты</th>
                <th className="px-4 py-3 font-medium">Занятия</th>
                <th className="px-4 py-3 font-medium">Создан</th>
                <th className="px-4 py-3 text-right font-medium">Переход</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              {classRows.map((classItem) => (
                <tr key={classItem.id} className="hover:bg-zinc-50">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-zinc-950">
                    {classItem.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-zinc-700">
                    <Badge>{classItem.stats.students}</Badge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-zinc-700">
                    <Badge>{classItem.stats.lessons}</Badge>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {classItem.createdAt.toLocaleDateString("ru-RU")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/classes/${classItem.id}`}
                      className="text-sm font-medium text-zinc-950 underline-offset-4 hover:underline"
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
    </div>
  );
}
