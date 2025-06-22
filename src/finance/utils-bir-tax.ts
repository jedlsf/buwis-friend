import { IncomeTaxType, QuarterPeriod } from "./enums-finance";





/**
 * Computes income tax based on BIR 2025 rules.
 * Supports both graduated and flat tax types.
 * 
 * @param income - The annual net taxable income
 * @param type - Type of income tax ("GRADUATED" for regular income earners, "FLAT" for certain professionals under 8% option)
 * @returns income tax due
 */
export function computeGraduatedIncomeTax(
    income: number,
    type: IncomeTaxType
): number {

    const FLAT_TAX_THRESHOLD = 250000;
    const FLAT_TAX_RATE = 0.08;


    if (type === IncomeTaxType.FLAT) {
        const threshold = FLAT_TAX_THRESHOLD;
        return income > threshold ? (income - threshold) * FLAT_TAX_RATE : 0;
    }

    // GRADUATED
    if (income <= 250000) return 0;
    if (income <= 400000) return (income - 250000) * 0.15;
    if (income <= 800000) return 22500 + (income - 400000) * 0.2;
    if (income <= 2000000) return 102500 + (income - 800000) * 0.25;
    if (income <= 8000000) return 402500 + (income - 2000000) * 0.3;
    return 2202500 + (income - 8000000) * 0.35;
}





/**
 * Helper to get the current year
 */
const getCurrentYear = (): number => new Date().getFullYear();

/**
 * 1. Percentage Tax - 25 days after the end of each quarter
 */
export function getFilingDatePercentageTax(quarter: QuarterPeriod, year: number = getCurrentYear()): string {
    const quarterEndDates = {
        [QuarterPeriod.Q1]: new Date(year, 2, 31), // March 31
        [QuarterPeriod.Q2]: new Date(year, 5, 30), // June 30
        [QuarterPeriod.Q3]: new Date(year, 8, 30), // September 30
        [QuarterPeriod.Q4]: new Date(year, 11, 31), // December 31
    };

    const endDate = quarterEndDates[quarter];
    const filingDate = new Date(endDate);
    filingDate.setDate(endDate.getDate() + 25);
    return filingDate.toISOString().split('T')[0]; // Returns date in 'YYYY-MM-DD' format
}

/**
 * 2. Income Tax Filing Dates
 */
export function getFilingDateIncomeTax(quarter: QuarterPeriod, year: number = getCurrentYear()): string {
    if (quarter === QuarterPeriod.Q4) {
        // Annual filing on or before April 15 of the next year
        return new Date(year + 1, 3, 15).toISOString().split('T')[0]; // April 15
    }

    const quarterFilingDates = {
        [QuarterPeriod.Q1]: new Date(year, 4, 15), // May 15
        [QuarterPeriod.Q2]: new Date(year, 7, 15), // August 15
        [QuarterPeriod.Q3]: new Date(year, 10, 15), // November 15
    };

    return quarterFilingDates[quarter].toISOString().split('T')[0];
}

/**
 * 3. Withholding Tax - Monthly Filing
 */
export function getFilingDateWithholdingTaxMonthly(month?: number, year: number = getCurrentYear()): string {
    const today = new Date();
    const filingMonth = month ?? today.getMonth(); // month is 0-indexed (0 = Jan)

    if (filingMonth === 11) {
        // If December, file on or before Jan 15 of the next year
        return new Date(year + 1, 0, 15).toISOString().split('T')[0]; // January 15
    }

    return new Date(year, filingMonth + 1, 10).toISOString().split('T')[0]; // 10th of next month
}

/**
 * 4. Withholding Tax - Annual Filing
 */
export function getFilingDateWithholdingTaxAnnual(year: number = getCurrentYear()): string {
    return new Date(year + 1, 0, 31).toISOString().split('T')[0]; // January 31
}


/**
 * VAT Filing Date - 25 days after the end of each quarter
 */
export function getFilingDateVAT(quarter: QuarterPeriod, year: number = getCurrentYear()): string {
    const quarterEndDates = {
        [QuarterPeriod.Q1]: new Date(year, 2, 31), // March 31
        [QuarterPeriod.Q2]: new Date(year, 5, 30), // June 30
        [QuarterPeriod.Q3]: new Date(year, 8, 30), // September 30
        [QuarterPeriod.Q4]: new Date(year, 11, 31), // December 31
    };

    const endDate = quarterEndDates[quarter];
    const filingDate = new Date(endDate);
    filingDate.setDate(endDate.getDate() + 25);
    return filingDate.toISOString().split('T')[0]; // Returns date in 'YYYY-MM-DD' format
}