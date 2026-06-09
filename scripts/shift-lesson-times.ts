import postgres from "postgres";

type LessonRow = {
  id: string;
  title: string;
  date: string | Date;
  start_time: string;
};

const SHIFT_HOURS = 4;
const APPLY = process.env.APPLY_LESSON_TIME_SHIFT === "1";
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to shift lesson times in PostgreSQL.");
}

const sql = postgres(databaseUrl, { max: 1 });

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});

async function main(): Promise<void> {
  try {
    const rows = await sql<LessonRow[]>`
      select id, title, date, start_time
      from lessons
      order by date, start_time, title
    `;

    if (!APPLY) {
      console.log("Dry run only. Set APPLY_LESSON_TIME_SHIFT=1 to update PostgreSQL.");
    }

    if (rows.length === 0) {
      console.log("No lessons found.");
    }

    const changes = rows.map((lesson) => {
      const oldDate = formatDate(lesson.date);
      const oldTime = formatTime(lesson.start_time);
      const shifted = shiftLocalDateTime(oldDate, oldTime, SHIFT_HOURS);

      console.log(
        [
          `lesson id: ${lesson.id}`,
          `title: ${lesson.title}`,
          `old date/time: ${oldDate} ${oldTime}`,
          `new date/time: ${shifted.date} ${shifted.time}`,
        ].join("\n"),
      );
      console.log("");

      return {
        id: lesson.id,
        date: shifted.date,
        time: shifted.time,
      };
    });

    if (APPLY && changes.length > 0) {
      await sql.begin(async (transaction) => {
        for (const change of changes) {
          await transaction`
            update lessons
            set date = ${change.date}, start_time = ${change.time}
            where id = ${change.id}
          `;
        }
      });

      console.log(`Applied +${SHIFT_HOURS} hour shift to ${changes.length} lessons.`);
    }
  } finally {
    await sql.end();
  }
}

function shiftLocalDateTime(date: string, time: string, hours: number) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute, second] = time.split(":").map(Number);
  const shifted = new Date(
    Date.UTC(year, month - 1, day, hour + hours, minute, second || 0),
  );

  return {
    date: shifted.toISOString().slice(0, 10),
    time: shifted.toISOString().slice(11, 19),
  };
}

function formatDate(value: string | Date): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return value.slice(0, 10);
}

function formatTime(value: string): string {
  const [hours = "00", minutes = "00", seconds = "00"] = value.split(":");

  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:${seconds
    .slice(0, 2)
    .padStart(2, "0")}`;
}
