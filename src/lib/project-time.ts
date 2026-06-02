export const projectTimeZone = "Europe/Moscow";

type ProjectDateTimeParts = {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
};

export function parseProjectDateTime(
  date: string,
  time: string,
  timeZone = projectTimeZone,
): Date {
  const parts = parseDateTimeParts(date, time);
  const utcGuess = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hours,
    parts.minutes,
  );
  let instant = new Date(utcGuess);

  for (let index = 0; index < 3; index += 1) {
    const offset = getTimeZoneOffsetMs(timeZone, instant);
    const nextInstant = new Date(utcGuess - offset);

    if (nextInstant.getTime() === instant.getTime()) {
      return nextInstant;
    }

    instant = nextInstant;
  }

  return instant;
}

function parseDateTimeParts(date: string, time: string): ProjectDateTimeParts {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.slice(0, 5).split(":").map(Number);

  return {
    year,
    month,
    day,
    hours,
    minutes,
  };
}

function getTimeZoneOffsetMs(timeZone: string, instant: Date): number {
  const parts = getTimeZoneParts(timeZone, instant);
  const localAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hours,
    parts.minutes,
    parts.seconds,
  );

  return localAsUtc - instant.getTime();
}

function getTimeZoneParts(timeZone: string, instant: Date) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(instant).map((part) => [part.type, part.value]),
  );

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hours: Number(parts.hour),
    minutes: Number(parts.minute),
    seconds: Number(parts.second),
  };
}
