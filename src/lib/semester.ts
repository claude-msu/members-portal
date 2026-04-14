import { parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { formatInTimeZone, toDate } from 'date-fns-tz';
import { supabase } from '@/integrations/supabase/client';

/** IANA zone for club calendar boundaries (matches Members coworking). */
export const CLUB_TIMEZONE = 'America/New_York';

type ActiveSemesterRow = { start_date: string; end_date: string };

function calendarDateKeyInTimeZone(date: Date, timeZone: string): string {
    return formatInTimeZone(date, timeZone, 'yyyy-MM-dd', { locale: enUS });
}

function addDaysToYmdKey(key: string, deltaDays: number): string {
    const [y, m, d] = key.split('-').map(Number);
    const t = Date.UTC(y, m - 1, d + deltaDays);
    const dt = new Date(t);
    const yy = dt.getUTCFullYear();
    const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(dt.getUTCDate()).padStart(2, '0');
    return `${yy}-${mm}-${dd}`;
}

function diffCalendarDays(fromKey: string, toKey: string): number {
    const parse = (s: string) => {
        const [y, m, d] = s.split('-').map(Number);
        return Date.UTC(y, m - 1, d);
    };
    return Math.round((parse(toKey) - parse(fromKey)) / 86400000);
}

/** 0 = Sunday … 6 = Saturday in `timeZone` for this instant. */
export function getWeekdayIndexInTimeZone(date: Date, timeZone: string): number {
    const w = formatInTimeZone(date, timeZone, 'eee', { locale: enUS });
    const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return map[w] ?? 0;
}

/**
 * Week index from semester anchor: week 0 = first Sun–Sat; weeks 1–12 follow.
 * `start_date` should be the Sunday that begins week 0 (club calendar in CLUB_TIMEZONE).
 */
export function computeWeekNumberFromStartDate(startDateIso: string, now: Date = new Date()): number {
    const startKey = calendarDateKeyInTimeZone(parseISO(startDateIso), CLUB_TIMEZONE);
    const todayKey = calendarDateKeyInTimeZone(now, CLUB_TIMEZONE);
    const dayIndex = diffCalendarDays(startKey, todayKey);
    if (dayIndex < 0) return 0;
    if (dayIndex <= 6) return 0;
    return Math.floor((dayIndex - 7) / 7) + 1;
}

/** Next Sunday 9:00 club time after the current Sun–Sat bucket; advances if already passed. */
export function getNextDropDeadline(startDateIso: string | null, now: Date = new Date()): Date {
    if (!startDateIso) {
        return getNextGenericSundayNineAm(now);
    }
    const startKey = calendarDateKeyInTimeZone(parseISO(startDateIso), CLUB_TIMEZONE);
    const todayKey = calendarDateKeyInTimeZone(now, CLUB_TIMEZONE);
    const dayIndex = diffCalendarDays(startKey, todayKey);
    let blocks = Math.floor(dayIndex / 7) + 1;
    let boundaryKey = addDaysToYmdKey(startKey, 7 * blocks);
    let target = toDate(`${boundaryKey}T09:00:00`, { timeZone: CLUB_TIMEZONE });
    while (target.getTime() <= now.getTime() && blocks < 500) {
        blocks += 1;
        boundaryKey = addDaysToYmdKey(startKey, 7 * blocks);
        target = toDate(`${boundaryKey}T09:00:00`, { timeZone: CLUB_TIMEZONE });
    }
    return target;
}

function getNextGenericSundayNineAm(now: Date): Date {
    const todayKey = calendarDateKeyInTimeZone(now, CLUB_TIMEZONE);
    const dow = getWeekdayIndexInTimeZone(now, CLUB_TIMEZONE);
    let daysUntilSunday = (7 - dow) % 7;
    if (daysUntilSunday === 0) {
        const thisSundayNine = toDate(`${todayKey}T09:00:00`, { timeZone: CLUB_TIMEZONE });
        if (thisSundayNine.getTime() <= now.getTime()) {
            daysUntilSunday = 7;
        }
    }
    const sundayKey = addDaysToYmdKey(todayKey, daysUntilSunday);
    return toDate(`${sundayKey}T09:00:00`, { timeZone: CLUB_TIMEZONE });
}

async function fetchActiveSemester(): Promise<ActiveSemesterRow | null> {
    const now = new Date().toISOString();
    const { data } = await supabase
        .from('semesters')
        .select('start_date, end_date')
        .lte('start_date', now)
        .gte('end_date', now)
        .order('start_date', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (!data?.start_date || !data?.end_date) return null;
    return { start_date: data.start_date, end_date: data.end_date };
}

/**
 * Club week index: 0 = first Sun–Sat from `start_date`; 1–12 = following weeks.
 * Returns 1 when there is no active semester (callers often clamp to course length).
 */
export async function getCurrent(): Promise<number> {
    const row = await fetchActiveSemester();
    if (!row?.start_date) return 1;
    return computeWeekNumberFromStartDate(row.start_date, new Date());
}

/** Active semester `start_date` ISO, or null (e.g. for countdown fallback). */
export async function getActiveSemesterStartIso(): Promise<string | null> {
    const row = await fetchActiveSemester();
    return row?.start_date ?? null;
}

/** Applications: week 0 and Sun–Wed only (club time). */
export async function canOpenApplicationForm(): Promise<boolean> {
    const row = await fetchActiveSemester();
    if (!row?.start_date) return false;
    const week = computeWeekNumberFromStartDate(row.start_date, new Date());
    if (week !== 0) return false;
    const wd = getWeekdayIndexInTimeZone(new Date(), CLUB_TIMEZONE);
    return wd >= 0 && wd <= 3;
}

export async function getNextSemesterStartIso(): Promise<string | null> {
    const now = new Date().toISOString();
    const { data } = await supabase
        .from('semesters')
        .select('start_date')
        .gt('start_date', now)
        .order('start_date', { ascending: true })
        .limit(1)
        .maybeSingle();
    return data?.start_date ?? null;
}
