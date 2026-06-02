import { createAdminAction, deleteAdminUserAction } from "@/app/actions";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  ConfirmSubmitButton,
  EmptyState,
  FormError,
  GeneratedPasswordField,
  Input,
  PageHeader,
  TableWrapper,
} from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { canDeleteAdminUser } from "@/lib/admin-users";
import { getAdminUsers } from "@/lib/admin-data";

type AdminUsersPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  "admin-fields": "Заполните имя, логин и пароль минимум из 12 символов.",
  "admin-login": "Пользователь с таким логином уже существует.",
  "delete-user": "Этого пользователя нельзя удалить.",
};

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const session = await requireRole("admin");
  const [adminUsers, query] = await Promise.all([getAdminUsers(), searchParams]);
  const errorMessage = query.error ? errorMessages[query.error] : null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Админка"
        title="Пользователи"
        description="Управление владельцем и администраторами системы."
      />

      {session.role === "owner" ? (
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-zinc-950">
              Создать администратора
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Администратор сможет входить в админку и управлять классами, студентами и занятиями.
            </p>
          </CardHeader>
          <CardContent>
            <form
              action={createAdminAction}
              className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end"
            >
              <Input id="admin-name" name="name" label="Имя" placeholder="Иван Иванов" />
              <Input id="admin-login" name="login" label="Логин" placeholder="admin.login" />
              <GeneratedPasswordField id="admin-password" />
              <Button type="submit" className="w-full lg:w-auto">
                Создать
              </Button>
            </form>
            <FormError message={errorMessage} className="mt-4" />
          </CardContent>
        </Card>
      ) : (
        <FormError message={errorMessage} />
      )}

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">Администраторы</h2>
          <p className="text-sm text-zinc-600">
            Владелец отображается в списке, но не удаляется через интерфейс.
          </p>
        </div>

        {adminUsers.length === 0 ? (
          <EmptyState
            marker="US"
            title="Администраторов пока нет"
            description="После seed здесь появится владелец системы."
          />
        ) : (
          <TableWrapper>
            <table className="min-w-full divide-y divide-zinc-200 text-sm">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-zinc-600">Имя</th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-600">Логин</th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-600">Роль</th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-600">Создан</th>
                  <th className="px-4 py-3 text-right font-medium text-zinc-600">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 bg-white">
                {adminUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-50">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-zinc-950">
                      {user.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-700">
                      {user.login}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Badge tone={user.role === "owner" ? "amber" : "blue"}>
                        {user.role === "owner" ? "Владелец" : "Администратор"}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-600">
                      {user.createdAt.toLocaleDateString("ru-RU")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {canDeleteAdminUser(session.role, user.role) ? (
                        <form action={deleteAdminUserAction}>
                          <input type="hidden" name="userId" value={user.id} />
                          <ConfirmSubmitButton
                            confirmText={`Удалить администратора ${user.name}?`}
                          >
                            Удалить
                          </ConfirmSubmitButton>
                        </form>
                      ) : (
                        <span className="text-sm text-zinc-500">Недоступно</span>
                      )}
                    </td>
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
