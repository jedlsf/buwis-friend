import { Money } from "./finance-money";
/**
 * Represents gross and net amounts for a value.
 */
export interface GrossNet {
    gross: number;
    net: number;
}
/**
 * Summary of discounts applied across all invoices in the period.
 */
export interface DiscountSummary {
    /** Senior Citizen / PWD discounts. */
    scPWD: Money;
    /** Catch‑all for any discounts not covered above. */
    other: Money;
    /** Derived: scPwd + promos + other. */
    totalDiscount: Money;
}
