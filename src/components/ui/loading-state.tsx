import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type LoadingStateProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description?: string;
};

export function LoadingState({
  className,
  description = "Загружаем данные.",
  title = "Пожалуйста, подождите",
  ...props
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-48 flex-col items-center justify-center rounded-lg border border-zinc-200 bg-white px-5 py-10 text-center shadow-sm",
        className,
      )}
      {...props}
    >
      <div className="h-8 w-8 rounded-full border-2 border-zinc-200 border-t-zinc-900" />
      <h2 className="mt-4 text-base font-semibold text-zinc-950">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-600">{description}</p>
    </div>
  );
}
