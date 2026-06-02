import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Badge, Card, CardContent } from "@/components/ui";
import { getDb, isDemoDatabase } from "@/db/client";
import { attendance, classes, lessons, users } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";
import { createDatabaseId } from "@/lib/database-id";
import { createDemoAttendanceIfMissing, getDemoScanContext } from "@/lib/demo-store";
import { resolveScanResult } from "@/lib/scan";

export const dynamic = "force-dynamic";

type ScanPageProps = {
  params: Promise<{
    qrToken: string;
  }>;
};

type ScanUiState = {
  tone: "success" | "info" | "warning" | "error";
  label: string;
  title: string;
  description: string;
};

const scanUiStates: Record<string, ScanUiState> = {
  success: {
    tone: "success",
    label: "Отмечено",
    title: "Вы отмечены",
    description: "Ваша отметка посещения для этого занятия сохранена.",
  },
  "already-marked": {
    tone: "info",
    label: "Уже отмечено",
    title: "Вы уже отмечались",
    description: "Посещение этого занятия уже было записано ранее.",
  },
  "not-started": {
    tone: "info",
    label: "Рано",
    title: "Отметка ещё не началась",
    description: "QR-код уже доступен, но отметиться можно только после начала занятия.",
  },
  closed: {
    tone: "warning",
    label: "Закрыто",
    title: "Время отметки закончилось",
    description: "Разрешённое время для отметки уже закончилось.",
  },
  "wrong-class": {
    tone: "error",
    label: "Другой класс",
    title: "Этот QR-код не для вашего класса",
    description: "Попросите администратора показать QR-код для вашего класса.",
  },
  "student-only": {
    tone: "error",
    label: "Нужен студент",
    title: "Войдите как студент",
    description:
      "Отмечаться по QR-коду могут только студенты. Используйте логин, выданный администратором.",
  },
  "not-found": {
    tone: "error",
    label: "Не найдено",
    title: "QR-код не найден",
    description: "Этот QR-код не относится к существующему занятию.",
  },
};

export default async function ScanPage({ params }: ScanPageProps) {
  const { qrToken } = await params;
  const scanPath = `/scan/${encodeURIComponent(qrToken)}`;
  const session = await getCurrentSession();

  if (!session) {
    redirect(`/login?next=${encodeURIComponent(scanPath)}`);
  }

  if (session.role !== "student") {
    return <ScanResultCard state={scanUiStates["student-only"]} />;
  }

  if (isDemoDatabase()) {
    const { hasAttendance, lesson, student } = await getDemoScanContext(
      qrToken,
      session.userId,
    );

    if (!lesson) {
      return <ScanResultCard state={scanUiStates["not-found"]} />;
    }

    if (!student || student.role !== "student") {
      return <ScanResultCard state={scanUiStates["student-only"]} lessonTitle={lesson.title} />;
    }

    const result = resolveScanResult({
      lesson,
      studentClassId: student.classId,
      hasAttendance,
    });

    if (result !== "ready") {
      return <ScanResultCard state={scanUiStates[result]} lessonTitle={lesson.title} />;
    }

    const createdAttendance = await createDemoAttendanceIfMissing(lesson.id, student.id);

    return (
      <ScanResultCard
        state={createdAttendance ? scanUiStates.success : scanUiStates["already-marked"]}
        lessonTitle={lesson.title}
      />
    );
  }

  const db = getDb();
  const lessonRows = await db
    .select({
      id: lessons.id,
      classId: lessons.classId,
      className: classes.name,
      title: lessons.title,
      date: lessons.date,
      startTime: lessons.startTime,
      checkInMinutes: lessons.checkInMinutes,
    })
    .from(lessons)
    .innerJoin(classes, eq(lessons.classId, classes.id))
    .where(eq(lessons.qrToken, qrToken))
    .limit(1);
  const lesson = lessonRows[0];

  if (!lesson) {
    return <ScanResultCard state={scanUiStates["not-found"]} />;
  }

  const student = await db.query.users.findFirst({
    columns: {
      id: true,
      classId: true,
      role: true,
    },
    where: eq(users.id, session.userId),
  });

  if (!student || student.role !== "student") {
    return <ScanResultCard state={scanUiStates["student-only"]} lessonTitle={lesson.title} />;
  }

  const existingAttendance = await db.query.attendance.findFirst({
    columns: {
      id: true,
    },
    where: and(eq(attendance.lessonId, lesson.id), eq(attendance.studentId, student.id)),
  });

  const result = resolveScanResult({
    lesson,
    studentClassId: student.classId,
    hasAttendance: Boolean(existingAttendance),
  });

  if (result !== "ready") {
    return <ScanResultCard state={scanUiStates[result]} lessonTitle={lesson.title} />;
  }

  const [createdAttendance] = await db
    .insert(attendance)
    .values({
      id: createDatabaseId(),
      lessonId: lesson.id,
      studentId: student.id,
      status: "present",
      scannedAt: new Date(),
    })
    .onConflictDoNothing({
      target: [attendance.lessonId, attendance.studentId],
    })
    .returning({ id: attendance.id });

  return (
    <ScanResultCard
      state={createdAttendance ? scanUiStates.success : scanUiStates["already-marked"]}
      lessonTitle={lesson.title}
    />
  );
}

function ScanResultCard({
  lessonTitle,
  state,
}: {
  lessonTitle?: string;
  state: ScanUiState;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10 text-zinc-950">
      <Card className="w-full max-w-lg">
        <CardContent className="p-6 text-center sm:p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-sm font-semibold uppercase text-zinc-600">
            {state.label.slice(0, 2)}
          </div>
          <Badge className={`mt-5 ${getToneClassName(state.tone)}`}>{state.label}</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">{state.title}</h1>
          {lessonTitle ? (
            <p className="mt-3 text-base font-medium text-zinc-800">{lessonTitle}</p>
          ) : null}
          <p className="mt-3 text-sm leading-6 text-zinc-600">{state.description}</p>
          <Link
            href="/student"
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-md border border-zinc-950 bg-zinc-950 px-5 text-sm font-medium text-white transition hover:bg-zinc-800 sm:w-auto"
          >
            Перейти в кабинет студента
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}

function getToneClassName(tone: ScanUiState["tone"]): string {
  if (tone === "success") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (tone === "warning") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (tone === "error") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-sky-200 bg-sky-50 text-sky-700";
}
