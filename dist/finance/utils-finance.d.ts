import { QuarterPeriod } from "./enums-finance";
/**
 * Returns the start and end Date objects for a given quarter and optional year.
 *
 * @param quarter - QuarterPeriod enum value.
 * @param year - Optional year (defaults to current year if not provided).
 * @returns [startDate, endDate] tuple for the specified quarter and year.
 * @throws Error if the year is invalid or out of range (must be 1800–3000).
 */
export declare function getQuarterDateRange(quarter: QuarterPeriod, year?: number): [Date, Date];
/**
 * Returns the quarter period (Q1–Q4) based on the provided ISO date string (or current date by default).
 *
 * @param inputDate - Optional ISO 8601 string (e.g. "2025-05-19T10:30:00.000Z").
 * @returns QuarterPeriod enum value.
 */
export declare function getQuarterFromDate(inputDate?: string): QuarterPeriod;
/**
 * Returns the current year as a number.
 *
 * @returns Current year (e.g. 2025)
 */
export declare function getCurrentYear(): number;
