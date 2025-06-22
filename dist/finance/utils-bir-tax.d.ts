import { IncomeTaxType, QuarterPeriod } from "./enums-finance";
/**
 * Computes income tax based on BIR 2025 rules.
 * Supports both graduated and flat tax types.
 *
 * @param income - The annual net taxable income
 * @param type - Type of income tax ("GRADUATED" for regular income earners, "FLAT" for certain professionals under 8% option)
 * @returns income tax due
 */
export declare function computeGraduatedIncomeTax(income: number, type: IncomeTaxType): number;
/**
 * 1. Percentage Tax - 25 days after the end of each quarter
 */
export declare function getFilingDatePercentageTax(quarter: QuarterPeriod, year?: number): string;
/**
 * 2. Income Tax Filing Dates
 */
export declare function getFilingDateIncomeTax(quarter: QuarterPeriod, year?: number): string;
/**
 * 3. Withholding Tax - Monthly Filing
 */
export declare function getFilingDateWithholdingTaxMonthly(month?: number, year?: number): string;
/**
 * 4. Withholding Tax - Annual Filing
 */
export declare function getFilingDateWithholdingTaxAnnual(year?: number): string;
/**
 * VAT Filing Date - 25 days after the end of each quarter
 */
export declare function getFilingDateVAT(quarter: QuarterPeriod, year?: number): string;
