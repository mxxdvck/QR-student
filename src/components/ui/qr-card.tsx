import Image from "next/image";
import type { ReactNode } from "react";
import { Card, CardContent } from "./card";

type QrCardProps = {
  alt: string;
  children?: ReactNode;
  qrCodeDataUrl: string;
  scanUrl: string;
};

export function QrCard({ alt, children, qrCodeDataUrl, scanUrl }: QrCardProps) {
  return (
    <Card className="mx-auto max-w-3xl">
      <CardContent className="space-y-6 p-6 sm:p-8">
        {children}
        <div className="flex flex-col items-center gap-5 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center sm:p-6">
          <div>
            <p className="text-base font-semibold text-zinc-950">Сканируйте для отметки</p>
            <p className="mt-1 text-sm text-zinc-500">
              Покажите этот QR-код студентам на экране.
            </p>
          </div>
          <Image
            src={qrCodeDataUrl}
            alt={alt}
            width={420}
            height={420}
            unoptimized
            priority
            className="h-auto w-full max-w-[420px] rounded-md bg-white"
          />
          <a
            href={scanUrl}
            className="max-w-full break-all rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
          >
            {scanUrl}
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
