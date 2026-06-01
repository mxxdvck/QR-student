import { Button, Card, CardContent, FormError, Input } from "@/components/ui";
import { getCurrentSession } from "@/lib/auth";
import { getRoleHomePath, getSafeRedirectPath } from "@/lib/session";
import { redirect } from "next/navigation";
import { loginAction } from "../actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  missing: "Введите логин и пароль.",
  invalid: "Неверный логин или пароль. Проверьте данные и попробуйте еще раз.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, next } = await searchParams;
  const nextPath = getSafeRedirectPath(next, "");
  const session = await getCurrentSession();

  if (session) {
    const homePath = getRoleHomePath(session.role);
    redirect(session.role === "student" && nextPath.startsWith("/scan/") ? nextPath : homePath);
  }

  const errorMessage = error ? errorMessages[error] : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f9fb] px-4 py-10 text-slate-950 sm:px-6">
      <Card className="w-full max-w-[420px] border-slate-300 bg-white">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-lg font-bold text-blue-800 ring-1 ring-blue-200">
              QR
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-600">
              Система посещаемости
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
              Вход в систему
            </h1>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
              Используйте логин и пароль, выданные администратором.
            </p>
          </div>

          {nextPath.startsWith("/scan/") ? (
            <div className="mt-5 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm leading-6 text-blue-900">
              Войдите как студент, чтобы продолжить отметку посещения по QR-коду.
            </div>
          ) : null}

          <form action={loginAction} className="mt-6 space-y-4">
            <input type="hidden" name="next" value={nextPath} />
            <Input
              id="login"
              label="Логин"
              name="login"
              type="text"
              autoComplete="username"
              placeholder="Введите логин"
              autoFocus
              required
            />

            <Input
              id="password"
              label="Пароль"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Введите пароль"
              required
            />

            <FormError message={errorMessage} className="text-left" />

            <Button type="submit" className="h-11 w-full">
              Войти
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
