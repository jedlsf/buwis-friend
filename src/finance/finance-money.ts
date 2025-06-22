import Decimal from 'decimal.js';

/**
 * Represents a monetary value with arbitrary precision and currency awareness.
 * All arithmetic operations return NEW immutable Money instances.
 */
export class Money {
    /** Internal amount stored as a Decimal representing PESOS unless specified. */
    private readonly amount: Decimal;
    /** ISO‑4217 currency code (default: PHP). */
    readonly currency: string;

    /**
     * Create a Money instance.
     * @param value  The numeric value (pesos) or any Decimal‑compatible input.
     * @param currency ISO currency code, defaults to 'PHP'.
     */
    constructor(value: Decimal.Value, currency: string = 'PHP') {
        this.amount = new Decimal(value);
        this.currency = currency.toUpperCase();
    }

    // ---------------------------------------------------------------------------
    // ⚙️  Factory helpers
    // ---------------------------------------------------------------------------
    /** Build from a centavo integer (e.g., 12_345 => ₱123.45). */
    static fromCentavos(centavos: number | string, currency: string = 'PHP'): Money {
        const dec = new Decimal(centavos).div(100);
        return new Money(dec, currency);
    }

    /** Build directly from a peso value. */
    static fromPesos(pesos: number | string, currency: string = 'PHP'): Money {
        return new Money(pesos, currency);
    }

    /** Build from a plain object with amount and currency. */
    static parseFromJSON(data: { amount: string | number; currency: string }): Money {
        // if (typeof data.amount !== 'string' && typeof data.amount !== 'number') {
        //     throw new Error('Invalid amount type. Expected string or number.');
        // }
        if (typeof data.currency !== 'string') {
            throw new Error('Invalid currency type. Expected string.');
        }

        return new Money(data.amount, data.currency);
    }


    // ---------------------------------------------------------------------------
    // 🔢 Conversions
    // ---------------------------------------------------------------------------
    /** Return numeric peso value (toNumber may lose precision at >1e15). */
    toPesos(): number {
        return this.amount.toNumber();
    }

    /** Convert to centavos (integer). */
    toCentavos(): number {
        return this.amount.mul(100).toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toNumber();
    }

    /** String representation suitable for logs (e.g., "PHP 1,234.56"). */
    format(locale: string = 'en-PH'): string {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: this.currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(this.toPesos());
    }

    // ---------------------------------------------------------------------------
    // ➕ Arithmetic (immutable)
    // ---------------------------------------------------------------------------
    add(other: Money): Money {
        this.assertSameCurrency(other);
        return new Money(this.amount.add(other.amount), this.currency);
    }

    subtract(other: Money): Money {
        this.assertSameCurrency(other);
        return new Money(this.amount.sub(other.amount), this.currency);
    }

    multiply(factor: Decimal.Value): Money {
        return new Money(this.amount.mul(factor), this.currency);
    }

    divide(divisor: Decimal.Value): Money {
        return new Money(this.amount.div(divisor), this.currency);
    }

    /** Equality check (currency AND amount). */
    equals(other: Money): boolean {
        return this.currency === other.currency && this.amount.equals(other.amount);
    }

    /** JSON serialisation → `{ amount: "123.45", currency: "PHP" }` */
    toJSON() {
        return { amount: this.amount.toFixed(2), currency: this.currency };
    }

    // ---------------------------------------------------------------------------
    // 🔒 Internal helpers
    // ---------------------------------------------------------------------------
    private assertSameCurrency(other: Money) {
        if (this.currency !== other.currency) {
            throw new Error(`Currency mismatch: ${this.currency} vs ${other.currency}`);
        }
    }
}