/**
 * Parser para el formato OpenStreetMap de opening_hours
 * Formato: "Mo-Fr 15:00-20:00; Sa-Su 11:00-23:00"
 *
 * Documentacion OSM: https://wiki.openstreetmap.org/wiki/Key:opening_hours
 */

const DAY_MAP: Record<string, string> = {
  Mo: "Lunes",
  Tu: "Martes",
  We: "Miércoles",
  Th: "Jueves",
  Fr: "Viernes",
  Sa: "Sábado",
  Su: "Domingo",
};

const DAY_ORDER = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export interface ParsedSchedule {
  days: string;
  hours: string;
  startTime: string;
  endTime: string;
  daysArray: string[];
}

export interface OpeningHoursResult {
  schedules: ParsedSchedule[];
  isCurrentlyOpen: boolean;
  closingTime: string | null;
  timeUntilClose: { hours: number; minutes: number } | null;
}

function formatTime24to12(time24: string): string {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "pm" : "am";
  const hours12 = hours % 12 || 12;
  return `${hours12}${minutes > 0 ? `:${minutes.toString().padStart(2, "0")}` : ""} ${period}`;
}

function expandDayRange(dayRange: string): string[] {
  if (dayRange.includes("-")) {
    const [start, end] = dayRange.split("-");
    const startIdx = DAY_ORDER.indexOf(start);
    const endIdx = DAY_ORDER.indexOf(end);
    if (startIdx !== -1 && endIdx !== -1) {
      return DAY_ORDER.slice(startIdx, endIdx + 1);
    }
  }
  if (dayRange.includes(",")) {
    return dayRange.split(",").filter(d => DAY_ORDER.includes(d));
  }
  if (DAY_ORDER.includes(dayRange)) {
    return [dayRange];
  }
  return [];
}

function formatDaysToSpanish(days: string[]): string {
  if (days.length === 0) return "";
  if (days.length === 1) return DAY_MAP[days[0]];
  if (days.length === 7) return "Todos los días";

  const indices = days.map(d => DAY_ORDER.indexOf(d));
  const isConsecutive = indices.every((val, i, arr) =>
    i === 0 || val === arr[i - 1] + 1
  );

  if (isConsecutive && days.length > 2) {
    return `${DAY_MAP[days[0]]} a ${DAY_MAP[days[days.length - 1]]}`;
  }

  return days.map(d => DAY_MAP[d]).join(", ");
}

function getCurrentColombiaTime(): { day: string; hour: number; minute: number } {
  const now = new Date();
  const colombiaOptions: Intl.DateTimeFormatOptions = {
    timeZone: "America/Bogota",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  const formatter = new Intl.DateTimeFormat("en-US", colombiaOptions);
  const parts = formatter.formatToParts(now);

  const weekdayMap: Record<string, string> = {
    Mon: "Mo", Tue: "Tu", Wed: "We", Thu: "Th", Fri: "Fr", Sat: "Sa", Sun: "Su"
  };

  const day = weekdayMap[parts.find(p => p.type === "weekday")?.value || ""] || "";
  const hour = parseInt(parts.find(p => p.type === "hour")?.value || "0");
  const minute = parseInt(parts.find(p => p.type === "minute")?.value || "0");

  return { day, hour, minute };
}

function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function parseOpeningHours(openingHours: string): OpeningHoursResult {
  const schedules: ParsedSchedule[] = [];

  if (!openingHours || openingHours.trim() === "") {
    return { schedules, isCurrentlyOpen: false, closingTime: null, timeUntilClose: null };
  }

  const rules = openingHours.split(";").map(r => r.trim());

  for (const rule of rules) {
    const match = rule.match(/^([A-Za-z,\-]+)\s+(\d{1,2}:\d{2})-(\d{1,2}:\d{2})$/);

    if (match) {
      const [, daysPart, startTime, endTime] = match;
      const daysArray = expandDayRange(daysPart);

      schedules.push({
        days: formatDaysToSpanish(daysArray),
        hours: `${formatTime24to12(startTime)} / ${formatTime24to12(endTime)}`,
        startTime,
        endTime,
        daysArray,
      });
    }
  }

  const { day, hour, minute } = getCurrentColombiaTime();
  const currentMinutes = hour * 60 + minute;

  let isCurrentlyOpen = false;
  let closingTime: string | null = null;
  let timeUntilClose: { hours: number; minutes: number } | null = null;

  for (const schedule of schedules) {
    if (schedule.daysArray.includes(day)) {
      const startMinutes = parseTimeToMinutes(schedule.startTime);
      const endMinutes = parseTimeToMinutes(schedule.endTime);

      if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
        isCurrentlyOpen = true;
        closingTime = schedule.endTime;

        const minutesUntilClose = endMinutes - currentMinutes;
        timeUntilClose = {
          hours: Math.floor(minutesUntilClose / 60),
          minutes: minutesUntilClose % 60,
        };
        break;
      }
    }
  }

  return { schedules, isCurrentlyOpen, closingTime, timeUntilClose };
}

export function formatTimeUntilClose(time: { hours: number; minutes: number } | null): string {
  if (!time) return "";
  const { hours, minutes } = time;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}
