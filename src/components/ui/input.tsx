import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string | null;
};

export function Input({ className, error, id, label, ...props }: InputProps) {
  return (
    <div>
      {label ? (
        <label htmlFor={id} className="text-sm font-semibold text-slate-800">
          {label}
        </label>
      ) : null}
      <input
        id={id}
        className={cn(
          "mt-2 h-11 min-w-0 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100",
          error && "border-red-300 focus:border-red-600 focus:ring-red-100",
          className,
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error && id ? `${id}-error` : undefined}
        {...props}
      />
      {error && id ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
