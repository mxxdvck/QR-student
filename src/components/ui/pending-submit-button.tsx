"use client";

import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./button";

type PendingSubmitButtonProps = ComponentProps<typeof Button> & {
  pendingText: string;
};

export function PendingSubmitButton({
  children,
  disabled,
  pendingText,
  type = "submit",
  ...props
}: PendingSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type={type}
      disabled={pending || disabled}
      aria-busy={pending}
      {...props}
    >
      {pending ? pendingText : children}
    </Button>
  );
}
