import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function TableWrapper({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-slate-200 bg-white shadow-none [&_tbody]:divide-y [&_tbody]:divide-slate-100 [&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-3 [&_thead]:border-b [&_thead]:border-slate-200 [&_thead]:bg-slate-50 [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-slate-500 [&_tr]:transition-colors [&_tbody_tr:hover]:bg-slate-50",
        className,
      )}
    >
      <div className="w-full overflow-x-auto" {...props} />
    </div>
  );
}
