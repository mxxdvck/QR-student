"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { useTransition } from "react";
import { cn } from "@/lib/cn";

type PendingLinkProps = ComponentProps<typeof Link> & {
  pendingText?: string;
};

export function PendingLink({
  children,
  className,
  href,
  onClick,
  pendingText = "Открываем...",
  ...props
}: PendingLinkProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0 ||
      props.target
    ) {
      return;
    }

    event.preventDefault();
    startTransition(() => {
      router.push(String(href));
    });
  }

  return (
    <Link
      href={href}
      className={cn(isPending && "pointer-events-none opacity-60", className)}
      aria-busy={isPending}
      onClick={handleClick}
      {...props}
    >
      {isPending ? pendingText : children}
    </Link>
  );
}
