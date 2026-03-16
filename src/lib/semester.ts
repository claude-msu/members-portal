import { supabase } from '@/integrations/supabase/client';

/**
 * Returns the 1-based week number for the current semester.
 * Uses the active semester (where today is between start_date and end_date).
 * Caller should clamp to course length (e.g. Math.min(week, WEEKS.length)).
 * Returns 1 if no active semester is found.
 */
export async function getCurrent(): Promise<number> {
    const now = new Date().toISOString();
    const { data } = await supabase
        .from('semesters')
        .select('start_date')
        .lte('start_date', now)
        .gte('end_date', now)
        .order('start_date', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (!data?.start_date) return 1;

    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const week =
        Math.floor((Date.now() - new Date(data.start_date).getTime()) / msPerWeek) + 1;
    return Math.max(week, 1);
}
