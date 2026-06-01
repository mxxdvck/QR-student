import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

const variants = {
  primary: "border-blue-800 bg-blue-800 text-white hover:border-blue-900 hover:bg-blue-900",
  secondary: "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-900",
  ghost: "border-transparent bg-transparent text-slate-600 hover:bg-blue-50 hover:text-blue-900",
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
