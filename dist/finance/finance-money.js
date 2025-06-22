"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Money = void 0;
const decimal_js_1 = __importDefault(require("decimal.js"));
/**
 * Represents a monetary value with arbitrary precision and currency awareness.
 * All arithmetic operations return NEW immutable Money instances.
 */
class Money {
    /**
     * Create a Money instance.
     * @param value  The numeric value (pesos) or any Decimal‑compatible input.
     * @param currency ISO currency code, defaults to 'PHP'.
     */
    constructor(value, currency = 'PHP') {
        this.amount = new decimal_js_1.default(value);
        this.currency = currency.toUpperCase();
    }
    // ---------------------------------------------------------------------------
    // ⚙️  Factory helpers
    // ---------------------------------------------------------------------------
    /** Build from a centavo integer (e.g., 12_345 => ₱123.45). */
    static fromCentavos(centavos, currency = 'PHP') {
        const dec = new decimal_js_1.default(centavos).div(100);
        return new Money(dec, currency);
    }
    /** Build directly from a peso value. */
    static fromPesos(pesos, currency = 'PHP') {
        return new Money(pesos, currency);
    }
    /** Build from a plain object with amount and currency. */
    static parseFromJSON(data) {
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
    toPesos() {
        return this.amount.toNumber();
    }
    /** Convert to centavos (integer). */
    toCentavos() {
        return this.amount.mul(100).toDecimalPlaces(0, decimal_js_1.default.ROUND_HALF_UP).toNumber();
    }
    /** String representation suitable for logs (e.g., "PHP 1,234.56"). */
    format(locale = 'en-PH') {
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
    add(other) {
        this.assertSameCurrency(other);
        return new Money(this.amount.add(other.amount), this.currency);
    }
    subtract(other) {
        this.assertSameCurrency(other);
        return new Money(this.amount.sub(other.amount), this.currency);
    }
    multiply(factor) {
        return new Money(this.amount.mul(factor), this.currency);
    }
    divide(divisor) {
        return new Money(this.amount.div(divisor), this.currency);
    }
    /** Equality check (currency AND amount). */
    equals(other) {
        return this.currency === other.currency && this.amount.equals(other.amount);
    }
    /** JSON serialisation → `{ amount: "123.45", currency: "PHP" }` */
    toJSON() {
        return { amount: this.amount.toFixed(2), currency: this.currency };
    }
    // ---------------------------------------------------------------------------
    // 🔒 Internal helpers
    // ---------------------------------------------------------------------------
    assertSameCurrency(other) {
        if (this.currency !== other.currency) {
            throw new Error(`Currency mismatch: ${this.currency} vs ${other.currency}`);
        }
    }
}
exports.Money = Money;
