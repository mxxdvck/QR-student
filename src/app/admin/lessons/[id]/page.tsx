import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { deleteLessonAction, updateLessonAction } from "@/app/actions";
import { Badge, ConfirmSubmitButton, PageHeader, QrCard } from "@/components/ui";
import { getLessonById } from "@/lib/admin-data";
import {
  buildScanUrl,
  getLessonCheckInStatus,
  type LessonCheckInStatus,
} from "@/lib/lessons";
import QRCode from "qrcode";

type LessonPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function LessonPage({ params, searchParams }: LessonPageProps) {
  const { id } = await params;
  const [lesson, requestHeaders, query] = await Promise.all([
    getLessonById(id),
    headers(),
    searchParams,
  ]);

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
            <Badge className={getLessonStatusClassName(status)}>
              {getLessonStatusLabel(status)}
            </Badge>
            <Link
              href={`/admin/classes/${lesson.classId}`}
              className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
            >
              Назад к классу
            </Link>
            <form action={deleteLessonAction}>
              <input type="hidden" name="lessonId" value={lesson.id} />
              <ConfirmSubmitButton confirmText="Удалить занятие? Вместе с ним удалятся отметки посещаемости по этому занятию.">
                Удалить занятие
              </ConfirmSubmitButton>
            </form>
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

      <section className="rounded-lg border border-zinc-200 bg-white p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-zinc-950">Редактировать занятие</h2>
          <p className="mt-1 text-sm text-zinc-600">
            QR-ссылка и отметки посещаемости сохраняются.
          </p>
        </div>
        <form
          action={updateLessonAction}
          className="grid gap-4 lg:grid-cols-[1fr_160px_140px_150px_auto] lg:items-end"
        >
          <input type="hidden" name="lessonId" value={lesson.id} />
          <EditField
            id="lesson-title"
            name="title"
            label="Название"
            defaultValue={lesson.title}
          />
          <EditField
            id="lesson-date"
            name="date"
            type="date"
            label="Дата"
            defaultValue={lesson.date}
          />
          <EditField
            id="lesson-start-time"
            name="startTime"
            type="time"
            label="Время начала"
            defaultValue={formatLessonTime(lesson.startTime)}
          />
          <EditField
            id="lesson-check-in"
            name="checkInMinutes"
            type="number"
            label="Окно, мин"
            defaultValue={String(lesson.checkInMinutes)}
            min={1}
            step={1}
          />
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Сохранить
          </button>
        </form>
        {query.error === "lesson-fields" ? (
          <p className="mt-3 text-sm font-medium text-red-600">
            Заполните название, дату, время и положительное окно отметки.
          </p>
        ) : null}
      </section>
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

function EditField({
  id,
  name,
  label,
  defaultValue,
  type = "text",
  min,
  step,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue: string;
  type?: "date" | "number" | "text" | "time";
  min?: number;
  step?: number;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1 block text-sm font-medium text-zinc-700">{label}</span>
      <input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        min={min}
        step={step}
        className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
      />
    </label>
  );
}

function getLessonStatusClassName(status: LessonCheckInStatus): string {
  if (status === "open") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "not-started") {
    return "border-sky-200 bg-sky-50 text-sky-700";
  }

  return "border-zinc-200 bg-zinc-100 text-zinc-700";
}

function getLessonStatusLabel(status: LessonCheckInStatus): string {
  if (status === "open") {
    return "Отметка открыта";
  }

  if (status === "not-started") {
    return "Отметка ещё не началась";
  }

  return "Отметка закрыта";
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
