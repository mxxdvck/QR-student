import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Badge, PageHeader, QrCard } from "@/components/ui";
import { getLessonById } from "@/lib/admin-data";
import { buildScanUrl, getLessonCheckInStatus } from "@/lib/lessons";
import QRCode from "qrcode";

type LessonPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = await params;
  const [lesson, requestHeaders] = await Promise.all([getLessonById(id), headers()]);

  if (!lesson) {
    notFound();
  }

  const origin = getRequestOrigin(requestHeaders);
  const scanUrl = buildScanUrl(origin, lesson.qrToken);
  const qrCodeDataUrl = await QRCode.toDataURL(scanUrl, {
    color: {
      dark: "#18181b",
      light: "#ffffff",
    },
    errorCorrectionLevel: "M",
    margin: 2,
    width: 420,
  });
  const status = getLessonCheckInStatus(lesson);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Занятие"
        title={lesson.title}
        description={`${lesson.className} | ${formatLessonDate(lesson.date)} в ${formatLessonTime(lesson.startTime)}`}
        actions={
          <>
            <Badge
              className={
                status === "open"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-zinc-200 bg-zinc-100 text-zinc-700"
              }
            >
              {status === "open" ? "Отметка открыта" : "Отметка закрыта"}
            </Badge>
            <Link
              href={`/admin/classes/${lesson.classId}`}
              className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
            >
              Назад к классу
            </Link>
          </>
        }
      />

      <QrCard
        alt={`QR-код для занятия ${lesson.title}`}
        qrCodeDataUrl={qrCodeDataUrl}
        scanUrl={scanUrl}
      >
          <div className="grid gap-3 text-sm sm:grid-cols-4">
            <InfoItem label="Класс" value={lesson.className} />
            <InfoItem label="Дата" value={formatLessonDate(lesson.date)} />
            <InfoItem label="Начало" value={formatLessonTime(lesson.startTime)} />
            <InfoItem label="Окно" value={`${lesson.checkInMinutes} мин`} />
          </div>
      </QrCard>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 font-semibold text-zinc-950">{value}</p>
    </div>
  );
}

function getRequestOrigin(requestHeaders: Headers): string {
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";

  return host ? `${protocol}://${host}` : "";
}

function formatLessonDate(value: string): string {
  return new Date(`${value}T00:00:00`).toLocaleDateString("ru-RU", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatLessonTime(value: string): string {
  return value.slice(0, 5);
}
