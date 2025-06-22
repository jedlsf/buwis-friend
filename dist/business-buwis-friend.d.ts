import { DigitalInvoice, InvoiceVATType } from "./business-invoice";
import { IncomeTaxType, QuarterPeriod } from "./finance/enums-finance";
import { SalesSummaryReport } from "./finance/finance-sales-report";
import { LegalEntity, TaxpayerInfo } from "./types-business";
/**
 * Metadata information for a BuwisFriend session,
 * including the taxpayer's legal information, the filing period, and the user who owns the session.
 */
export interface BuwisFriendMetadata {
    /** Taxpayer entity details such as name, TIN, business name, and address */
    taxpayer: LegalEntity;
    /** Filing year this session applies to (e.g., 2025) */
    year: number;
    /** Quarter of the year (Q1 to Q4) this session is focused on */
    quarter: QuarterPeriod;
    /** Unique user ID associated with this session (e.g., for tracking ownership) */
    userID: string;
    /** Tax-related configuration settings such as VAT, percentage tax, and income tax type */
    taxSettings: BuwisFriendTaxSettings;
}
/**
 * Tax configuration settings for a BuwisFriend session.
 * Includes VAT details, percentage tax rate, and income tax computation type.
 */
export interface BuwisFriendTaxSettings {
    /** Value-added tax settings including rate and type (e.g., VATABLE, EXEMPT, ZERO-RATED) */
    vat: {
        /** VAT rate as a percentage (e.g., 12 for 12%) */
        rate: number;
        /** Type of VAT applicable to this session (e.g., VATABLE, EXEMPT, ZERO-RATED) */
        type: InvoiceVATType;
    };
    /** Percentage tax rate applicable for non-VAT registered entities (e.g., 1%) */
    percentageTax: number;
    /** Type of income tax computation (e.g., OSD, ITEMIZED) */
    incomeTaxType: IncomeTaxType;
}
/**
 * BuwisFriend is a tax management assistant class that helps users
 * track their digital invoices and compute tax summaries such as VAT,
 * withholding, income tax, and percentage tax.
 */
export declare class BuwisFriend {
    /** Unique identifier for this BuwisFriend session */
    id: string;
    /** Metadata containing user and taxpayer information */
    metadata: BuwisFriendMetadata;
    /** Array of digital invoices associated with this session */
    invoices: DigitalInvoice[];
    /** Summary report containing tax computations for the session */
    summary: SalesSummaryReport;
    /** ISO timestamp representing when this session instance was created */
    timestamp: string;
    /**
     * Creates a new instance of BuwisFriend to manage tax-related computations.
     *
     * @param id - Optional custom ID for the session; auto-generated if omitted.
     * @param metadata - Optional user and taxpayer details.
     * @param invoices - Optional list of imported digital invoices.
     * @param summary - Optional computed sales summary report.
     * @param timestamp - Optional ISO timestamp for session creation (defaults to now).
     */
    constructor(id?: string, metadata?: BuwisFriendMetadata, invoices?: DigitalInvoice[], summary?: SalesSummaryReport, timestamp?: string);
    /**
    * Initializes a new BuwisFriend instance for the given taxpayer and period.
     *
    * @param userID - The user who initiated the session.
    * @param taxpayer - The `LegalEntity` that owns this BuwisFriend session (optional).
    * @param quarter - The quarter period (defaults to Q1 if not provided).
    * @param year - The filing year (defaults to current year if not provided).
    * @returns A new BuwisFriend instance.
    */
    static initialize(userID: string, taxpayer?: LegalEntity, quarter?: QuarterPeriod, year?: number): BuwisFriend;
    /**
     * Loads an exported Taxpayer Information Data.
     * @param input - The Taxpayer Information to load and use for this session. Must be a valid `TaxpayerInfo` object.
     * @throws Will throw an error if the `input` is not provided.
     */
    loadTaxpayerInfo(input: TaxpayerInfo): this;
    /**
     * Updates the current session’s quarter period and refreshes the summary accordingly.
     *
     * @param quarter - A valid quarter from the QuarterPeriod enum (e.g. QuarterPeriod.Q1).
     * @returns The updated BuwisFriend instance.
     */
    setQuarter(quarter: QuarterPeriod): this;
    /**
     * Updates the current session’s filing year and refreshes the summary accordingly.
     *
     * @param year - A valid year (must be between 1800 and 3000).
     * @returns The updated BuwisFriend instance.
     */
    setYear(year: number): this;
    /**
     * Sets the income tax type.
     * @param taxType - Must be a valid IncomeTaxType enum value.
     * @returns The updated instance.
     */
    setIncomeTaxType(taxType: IncomeTaxType): this;
    /**
    * Checks whether an invoice with the given invoiceNumber already exists in the session.
    *
    * @param invoice - A DigitalInvoice object or a string representing the invoiceNumber.
    * @returns true if the invoiceNumber exists in the session; otherwise, false.
    * @throws Error if the input is not a valid string or DigitalInvoice.
    */
    doesInvoiceExist(invoice: string | DigitalInvoice): boolean;
    /**
    * Adds a single DigitalInvoice to the session after checking for duplication.
    *
    * @param invoice - A DigitalInvoice object to add to the session.
    * @throws Error if the invoice already exists or is not fileable for the session’s period.
    */
    addInvoice(invoice: DigitalInvoice): this;
    /**
     * Overwrites the current session’s invoice list with a new batch of DigitalInvoice objects,
     * after validating that each invoice:
     *   1. Falls inside this.session’s filing period (metadata.year & metadata.quarter)
     *   2. Has a unique invoiceNumber within the batch
     *
     * The internal invoice list is replaced with a date-sorted array (earliest first).
     *
     * @param newInvoices - Array of DigitalInvoice instances to set.
     * @throws Error if an invoice is outside the period
     *         (e.g. “Invoice 1000ABC0002 is not fileable for this period”)
     *         or if a duplicate invoiceNumber is detected in the batch.
     */
    updateInvoices(newInvoices: DigitalInvoice[]): this;
    /**
     * Clears all existing invoices and refreshes the summary.
     *
     */
    clearInvoices(): this;
    /**
     * Removes a DigitalInvoice from the session by its invoiceNumber.
     *
     * @param invoiceNumber - The invoiceNumber to remove.
     * @returns The updated BuwisFriend instance.
     * @throws Error if the invoices list is empty or if the invoiceNumber is not found.
     */
    removeInvoiceByNumber(invoiceNumber: string): this;
    /**
     * Adds new DigitalInvoice objects to the current session’s invoice list
     * after validating that each invoice:
     *   1. Falls inside this.session’s filing period (metadata.year & metadata.quarter)
     *   2. Has a unique invoiceNumber not already in the session
     *
     * New invoices are merged into the existing list and sorted by issue date (earliest first).
     *
     * @param newInvoices - Array of DigitalInvoice instances to add.
     * @throws Error if an invoice is outside the period
     *         (e.g. “Invoice 1000ABC0002 is not fileable for this period”)
     *         or if a duplicate invoiceNumber is detected.
     */
    addInvoices(newInvoices: DigitalInvoice[]): this;
    /**
     * Retrieves all invoices that fall within the specified quarter.
     * If no quarter is provided, it uses the current instance's quarter.
     *
     * @param quarter - Optional QuarterPeriod to filter invoices by.
     * @returns An array of invoices within the specified quarter.
     */
    getInvoicesFromQuarter(quarter?: QuarterPeriod): DigitalInvoice[];
    /**
    * Returns the JSON representation of the current sales summary report.
    *
    * This provides a serializable object version of the summary for external use,
    * such as display, storage, or export.
    *
    * @returns The serialized SalesSummaryReport object.
    */
    getSummaryReport(): ReturnType<SalesSummaryReport['toJSON']>;
    /**
    * Refreshes the sales summary report based on current invoices.
     *
    * If there are no invoices, the summary remains unchanged.
    * If invoices exist, a new SalesSummaryReport instance is created,
    * updated with the current invoices, and saved to this.summary.
    *
    * @private
    * @returns {void}
    */
    private refreshSummary;
    /**
    * Converts the current `BuwisFriend` class to a plain JSON object and automatically generates an ID.
    * @returns {object} - A plain JSON object representation of the `BuwisFriend` with an autogenerated ID.
    */
    finalize(): object;
    /**
    * Converts the current `BuwisFriend` object to a plain JavaScript object (JSON).
    * @returns {object} - The plain object representation of the `BuwisFriend` instance.
    */
    toJSON(): object;
    /**
    * Static method to parse a JSON string or object into a `BuwisFriend` instance.
    *
    * @param json - A JSON string or plain object to be parsed.
    * @returns {BuwisFriend} - A new `BuwisFriend` instance based on the parsed JSON.
    * @throws Will throw an error if required properties are missing.
    */
    static parseFromJSON(json: string | object): BuwisFriend;
}
