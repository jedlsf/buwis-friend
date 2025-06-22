import { QuarterPeriod } from "./enums-finance";



/**
 * Returns the start and end Date objects for a given quarter and optional year.
 *
 * @param quarter - QuarterPeriod enum value.
 * @param year - Optional year (defaults to current year if not provided).
 * @returns [startDate, endDate] tuple for the specified quarter and year.
 * @throws Error if the year is invalid or out of range (must be 1800–3000).
 */
export function getQuarterDateRange(quarter: QuarterPeriod, year?: number): [Date, Date] {
    const currentYear = new Date().getFullYear();
    const targetYear = year ?? currentYear;

    if (
        typeof targetYear !== "number" ||
        isNaN(targetYear) ||
        targetYear < 1800 ||
        targetYear > 3000
    ) {
        throw new Error(`Invalid year "${year}". Year must be a number between 1800 and 3000.`);
    }

    switch (quarter) {
        case QuarterPeriod.Q1:
            return [
                new Date(`${targetYear}-01-01T00:00:00.000Z`),
                new Date(`${targetYear}-03-31T23:59:59.999Z`)
            ];
        case QuarterPeriod.Q2:
            return [
                new Date(`${targetYear}-04-01T00:00:00.000Z`),
                new Date(`${targetYear}-06-30T23:59:59.999Z`)
            ];
        case QuarterPeriod.Q3:
            return [
                new Date(`${targetYear}-07-01T00:00:00.000Z`),
                new Date(`${targetYear}-09-30T23:59:59.999Z`)
            ];
        case QuarterPeriod.Q4:
            return [
                new Date(`${targetYear}-10-01T00:00:00.000Z`),
                new Date(`${targetYear}-12-31T23:59:59.999Z`)
            ];
        default:
            throw new Error("Unknown quarter period.");
    }
}


/**
 * Returns the quarter period (Q1–Q4) based on the provided ISO date string (or current date by default).
 *
 * @param inputDate - Optional ISO 8601 string (e.g. "2025-05-19T10:30:00.000Z").
 * @returns QuarterPeriod enum value.
 */
export function getQuarterFromDate(inputDate?: string): QuarterPeriod {
    const isValidString = typeof inputDate === "string" && inputDate.trim() !== "";
    const date = isValidString ? new Date(inputDate) : new Date();

    if (isNaN(date.getTime())) {
        throw new Error(`Invalid ISO date string: "${inputDate}"`);
    }

    const month = date.getMonth(); // Jan = 0, Dec = 11

    if (month < 3) return QuarterPeriod.Q1;
    if (month < 6) return QuarterPeriod.Q2;
    if (month < 9) return QuarterPeriod.Q3;
    return QuarterPeriod.Q4;
}



/**
 * Returns the current year as a number.
 *
 * @returns Current year (e.g. 2025)
 */
export function getCurrentYear(): number {
    return new Date().getFullYear();
}
