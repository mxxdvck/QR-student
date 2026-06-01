import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type FormErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  message?: string | null;
};

export function FormError({ className, message, ...props }: FormErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p
      role="alert"
      className={cn(
        "rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700",
        className,
      )}
      {...props}
    >
      {message}
    </p>
  );
}
