import Decimal from 'decimal.js';
/**
 * Represents a monetary value with arbitrary precision and currency awareness.
 * All arithmetic operations return NEW immutable Money instances.
 */
export declare class Money {
    /** Internal amount stored as a Decimal representing PESOS unless specified. */
    private readonly amount;
    /** ISO‑4217 currency code (default: PHP). */
    readonly currency: string;
    /**
     * Create a Money instance.
     * @param value  The numeric value (pesos) or any Decimal‑compatible input.
     * @param currency ISO currency code, defaults to 'PHP'.
     */
    constructor(value: Decimal.Value, currency?: string);
    /** Build from a centavo integer (e.g., 12_345 => ₱123.45). */
    static fromCentavos(centavos: number | string, currency?: string): Money;
    /** Build directly from a peso value. */
    static fromPesos(pesos: number | string, currency?: string): Money;
    /** Build from a plain object with amount and currency. */
    static parseFromJSON(data: {
        amount: string | number;
        currency: string;
    }): Money;
    /** Return numeric peso value (toNumber may lose precision at >1e15). */
    toPesos(): number;
    /** Convert to centavos (integer). */
    toCentavos(): number;
    /** String representation suitable for logs (e.g., "PHP 1,234.56"). */
    format(locale?: string): string;
    add(other: Money): Money;
    subtract(other: Money): Money;
    multiply(factor: Decimal.Value): Money;
    divide(divisor: Decimal.Value): Money;
    /** Equality check (currency AND amount). */
    equals(other: Money): boolean;
    /** JSON serialisation → `{ amount: "123.45", currency: "PHP" }` */
    toJSON(): {
        amount: string;
        currency: string;
    };
    private assertSameCurrency;
}
