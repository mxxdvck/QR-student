"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ConfirmSubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  confirmText: string;
};

export function ConfirmSubmitButton({
  className,
  confirmText,
  onClick,
  type = "submit",
  ...props
}: ConfirmSubmitButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md border border-transparent bg-transparent px-4 text-sm font-medium text-red-700 transition hover:bg-red-50 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented && !window.confirm(confirmText)) {
          event.preventDefault();
        }
      }}
      {...props}
    />
  );
}
