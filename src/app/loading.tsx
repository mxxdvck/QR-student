import { LoadingState } from "@/components/ui";

export default function Loading() {
  return (
    <main className="min-h-screen bg-zinc-50 px-5 py-8 text-zinc-950 sm:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <LoadingState title="Загружаем страницу" description="Данные скоро появятся." />
      </div>
    </main>
  );
}
