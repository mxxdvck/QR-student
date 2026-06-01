import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  marker?: string;
};

export function EmptyState({ action, description, marker = "QR", title }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-5 py-10 text-center shadow-none">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-xs font-semibold uppercase tracking-wide text-blue-800">
        {marker}
      </div>
      <h2 className="mt-4 text-base font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
