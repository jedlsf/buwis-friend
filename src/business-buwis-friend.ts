import { DigitalInvoice, InvoiceVATType } from "./business-invoice";
import { IncomeTaxType, QuarterPeriod } from "./finance/enums-finance";
import { SalesSummaryReport } from "./finance/finance-sales-report";
import { getQuarterDateRange } from "./finance/utils-finance";
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
export class BuwisFriend {


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
    constructor(
        id?: string,
        metadata?: BuwisFriendMetadata,
        invoices?: DigitalInvoice[],
        summary?: SalesSummaryReport,
        timestamp: string = new Date().toISOString()
    ) {

        this.id = id || autogenerateID(metadata?.userID || "system");


        const defaultTaxpayer: LegalEntity = {
            name: "Taxpayer ABC",
            tin: "100000000000",
            address: "123 XYZ St., Brgy. DEF, Makati City, NCR, Philippines",
            businessName: "The Zelijah World"
        };



        const defaultMetadata: BuwisFriendMetadata = {
            taxpayer: defaultTaxpayer,
            userID: "system",
            year: new Date().getFullYear(),
            quarter: QuarterPeriod.Q1,
            taxSettings: {
                vat: {
                    rate: 0.12,
                    type: InvoiceVATType.VAT
                },
                percentageTax: 0.3,
                incomeTaxType: IncomeTaxType.GRADUATED
            }
        };


        const defaultSummary: SalesSummaryReport = SalesSummaryReport.initialize(defaultTaxpayer, "system");
        const parsedSummary = SalesSummaryReport.parseFromJSON(summary as object);


        this.metadata = metadata || defaultMetadata;
        this.invoices = invoices || [];
        this.summary = parsedSummary || defaultSummary;
        this.timestamp = timestamp || new Date().toISOString();
    };


    /**
    * Initializes a new BuwisFriend instance for the given taxpayer and period.
     *
    * @param userID - The user who initiated the session.
    * @param taxpayer - The `LegalEntity` that owns this BuwisFriend session (optional).
    * @param quarter - The quarter period (defaults to Q1 if not provided).
    * @param year - The filing year (defaults to current year if not provided).
    * @returns A new BuwisFriend instance.
    */
    static initialize(
        userID: string,
        taxpayer?: LegalEntity,
        quarter: QuarterPeriod = QuarterPeriod.Q1,
        year?: number,


    ): BuwisFriend {
        const currentYear = new Date().getFullYear();
        const safeYear = typeof year === 'number' ? year : currentYear;

        if (safeYear < 1800 || safeYear > 3000) {
            throw new Error(`Invalid year: ${safeYear}. Year must be between 1800 and 3000.`);
        }

        // Validate userID
        if (!userID || typeof userID !== 'string' || userID.trim() === '') {
            throw new Error('User ID must be a non-empty string.');
        }

        // Fallback to default taxpayer if not provided
        const defaultTaxpayer: LegalEntity = {
            name: "Taxpayer ABC",
            tin: "100000000000",
            address: "123 XYZ St., Brgy. DEF, Makati City, NCR, Philippines",
            businessName: "The Zelijah World"
        };

        const metadata: BuwisFriendMetadata = {
            taxpayer: taxpayer || defaultTaxpayer,
            userID,
            year: safeYear,
            quarter,
            taxSettings: {
                vat: {
                    rate: 0.12,
                    type: InvoiceVATType.VAT
                },
                percentageTax: 0.3,
                incomeTaxType: IncomeTaxType.GRADUATED
            }
        };

        const defaultSummary: SalesSummaryReport = SalesSummaryReport.initialize(metadata.taxpayer, metadata.userID, metadata.quarter, metadata.year);



        return new BuwisFriend(undefined, metadata, [], defaultSummary);
    }





    /**
     * Loads an exported Taxpayer Information Data.
     * @param input - The Taxpayer Information to load and use for this session. Must be a valid `TaxpayerInfo` object.
     * @throws Will throw an error if the `input` is not provided.
     */
    loadTaxpayerInfo(input: TaxpayerInfo): this {

        if (!input) {
            throw new Error("Invalid Taxpayer Data provided. Must be a valid TaxpayerInfo object.");
        }


        if (!input.issuer.name || typeof input.issuer.name !== 'string' || input.issuer.name.trim() === "") {
            throw new Error("Taxpayer's name must be a valid non-empty string.");
        }

        if (!input.issuer.tin) {
            throw new Error("Taxpayer's TIN must be a valid registered number.");
        }


        if (!input.issuer.businessName || typeof input.issuer.businessName !== 'string' || input.issuer.businessName.trim() === "") {
            throw new Error("Taxpayer's business name/style must be a valid non-empty string.");
        }

        if (!input.issuer.address || typeof input.issuer.address !== 'string' || input.issuer.address.trim() === "") {
            throw new Error("Taxpayer's address must be a valid non-empty string.");
        }


        this.metadata.taxpayer = input.issuer;
        this.metadata.taxSettings.vat.type = input.metadata.type;

        return this;
    }




    /**
     * Updates the current session’s quarter period and refreshes the summary accordingly.
     *
     * @param quarter - A valid quarter from the QuarterPeriod enum (e.g. QuarterPeriod.Q1).
     * @returns The updated BuwisFriend instance.
     */
    setQuarter(quarter: QuarterPeriod): this {
        if (!Object.values(QuarterPeriod).includes(quarter)) {
            throw new Error(`Invalid quarter value: ${quarter}`);
        }

        this.metadata.quarter = quarter;
        this.refreshSummary();
        return this;
    }

    /**
     * Updates the current session’s filing year and refreshes the summary accordingly.
     *
     * @param year - A valid year (must be between 1800 and 3000).
     * @returns The updated BuwisFriend instance.
     */
    setYear(year: number): this {
        if (typeof year !== 'number' || year < 1800 || year > 3000) {
            throw new Error(`Invalid year: ${year}. Year must be between 1800 and 3000.`);
        }

        this.metadata.year = year;
        this.refreshSummary();
        return this;
    }


    /**
     * Sets the income tax type.
     * @param taxType - Must be a valid IncomeTaxType enum value.
     * @returns The updated instance.
     */
    setIncomeTaxType(taxType: IncomeTaxType): this {
        if (!taxType || taxType.trim() === "") {
            throw new Error('Income Tax Type must be a non-empty string.');
        }
        this.metadata.taxSettings.incomeTaxType = taxType;
        this.refreshSummary();
        return this;
    }




    /**
    * Checks whether an invoice with the given invoiceNumber already exists in the session.
    *
    * @param invoice - A DigitalInvoice object or a string representing the invoiceNumber.
    * @returns true if the invoiceNumber exists in the session; otherwise, false.
    * @throws Error if the input is not a valid string or DigitalInvoice.
    */
    doesInvoiceExist(invoice: string | DigitalInvoice): boolean {
        let invoiceNumber: string;

        if (typeof invoice === 'string' && invoice.trim() !== "") {
            invoiceNumber = invoice;
        } else if (
            typeof invoice !== 'string' &&
            invoice !== null &&
            !!invoice?.metadata?.invoiceNumber &&
            invoice.metadata.invoiceNumber.trim() !== "" &&
            typeof invoice.metadata?.invoiceNumber === 'string'
        ) {
            invoiceNumber = invoice.metadata.invoiceNumber;
        } else {
            throw new Error('Invalid input: must be a string or a valid DigitalInvoice with metadata.invoiceNumber');
        }

        return this.invoices.some(inv => inv.metadata.invoiceNumber === invoiceNumber);
    }


    /**
    * Adds a single DigitalInvoice to the session after checking for duplication.
    *
    * @param invoice - A DigitalInvoice object to add to the session.
    * @throws Error if the invoice already exists or is not fileable for the session’s period.
    */
    addInvoice(invoice: DigitalInvoice): this {
        // Validate and prevent duplicate
        if (this.doesInvoiceExist(invoice)) {
            throw new Error(`Invoice ${invoice.metadata.invoiceNumber} already exists in this session`);
        }

        // Check if the invoice is within the current filing period
        const [startDate, endDate] = getQuarterDateRange(this.metadata.quarter, this.metadata.year);
        const issuedDate = new Date(invoice.timestamp);
        const invoiceYear = issuedDate.getFullYear();
        const invoiceQuarter = Math.floor(issuedDate.getMonth() / 3) + 1;

        if (issuedDate < startDate || issuedDate > endDate) {
            throw new Error(`Invoice ${invoice.metadata.invoiceNumber} is not fileable for this period. This invoice is for ${invoiceYear} Q${invoiceQuarter}.`);
        }

        // Add and sort
        this.invoices.push(invoice);
        this.invoices.sort(
            (a, b) =>
                new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        this.refreshSummary();
        return this;
    }



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
    updateInvoices(newInvoices: DigitalInvoice[]): this {
        if (!newInvoices || newInvoices.length === 0) return this;

        const [startDate, endDate] = getQuarterDateRange(
            this.metadata.quarter,
            this.metadata.year
        );

        const seen = new Set<string>();

        for (const inv of newInvoices) {
            const issuedDate = new Date(inv.timestamp);
            const invoiceYear = issuedDate.getFullYear();
            const invoiceQuarter = Math.floor(issuedDate.getMonth() / 3) + 1;

            if (issuedDate < startDate || issuedDate > endDate) {
                throw new Error(`Invoice ${inv.metadata.invoiceNumber} is not fileable for this period. This invoice is for ${invoiceYear} Q${invoiceQuarter}.`);
            }

            const invoiceNumber = inv.metadata.invoiceNumber;
            if (seen.has(invoiceNumber)) {
                throw new Error(`Duplicate invoice number detected: ${invoiceNumber}`);
            }
            seen.add(invoiceNumber);
        }

        // Sort the validated batch by issue date (earliest first)
        const sorted = [...newInvoices].sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        this.invoices = sorted;
        this.refreshSummary();
        return this;
    }


    /**
     * Clears all existing invoices and refreshes the summary.
     * 
     */
    clearInvoices(): this {
        this.invoices = [];
        this.refreshSummary();
        return this;
    }


    /**
     * Removes a DigitalInvoice from the session by its invoiceNumber.
     *
     * @param invoiceNumber - The invoiceNumber to remove.
     * @returns The updated BuwisFriend instance.
     * @throws Error if the invoices list is empty or if the invoiceNumber is not found.
     */
    removeInvoiceByNumber(invoiceNumber: string): this {
        // Validate invoiceNumber input
        if (!invoiceNumber || typeof invoiceNumber !== 'string' || invoiceNumber.trim() === '') {
            throw new Error('invoiceNumber must be a non-empty string.');
        }

        // Ensure there are invoices to remove from
        if (!this.invoices || this.invoices.length === 0) {
            throw new Error('No invoices in the session to remove.');
        }

        // Find index of the invoice to remove
        const index = this.invoices.findIndex(
            inv => inv.metadata.invoiceNumber === invoiceNumber
        );

        if (index === -1) {
            throw new Error(`Invoice ${invoiceNumber} not found in this session.`);
        }

        // Remove the invoice
        this.invoices.splice(index, 1);



        // Refresh summary to reflect the change
        this.refreshSummary();

        return this;
    }




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
    addInvoices(newInvoices: DigitalInvoice[]): this {
        if (!newInvoices || newInvoices.length === 0) return this;

        const [startDate, endDate] = getQuarterDateRange(
            this.metadata.quarter,
            this.metadata.year
        );

        const seenInBatch = new Set<string>();

        for (const inv of newInvoices) {
            const issuedDate = new Date(inv.timestamp);
            const invoiceNumber = inv.metadata.invoiceNumber;

            if (issuedDate < startDate || issuedDate > endDate) {
                throw new Error(`Invoice ${invoiceNumber} is not fileable for this period`);
            }

            if (seenInBatch.has(invoiceNumber)) {
                throw new Error(`Duplicate invoice number detected in batch: ${invoiceNumber}`);
            }

            if (this.doesInvoiceExist(inv)) {
                throw new Error(`Invoice ${invoiceNumber} already exists in this session`);
            }

            seenInBatch.add(invoiceNumber);
        }

        this.invoices = [...this.invoices, ...newInvoices].sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        this.refreshSummary();
        return this;
    }





    /**
     * Retrieves all invoices that fall within the specified quarter.
     * If no quarter is provided, it uses the current instance's quarter.
     * 
     * @param quarter - Optional QuarterPeriod to filter invoices by.
     * @returns An array of invoices within the specified quarter.
     */
    getInvoicesFromQuarter(quarter?: QuarterPeriod): DigitalInvoice[] {
        const targetQuarter = quarter ?? this.summary.metadata.quarter;

        if (!Object.values(QuarterPeriod).includes(targetQuarter)) {
            throw new Error('Invalid quarter period.');
        }

        const [startDate, endDate] = getQuarterDateRange(targetQuarter, this.metadata.year);

        if (!this.invoices || this.invoices.length === 0) {
            return [];
        }

        return this.invoices.filter(invoice => {
            const invoiceDate = new Date(invoice.timestamp);
            return invoiceDate >= startDate && invoiceDate <= endDate;
        });
    }



    /**
    * Returns the JSON representation of the current sales summary report.
    *
    * This provides a serializable object version of the summary for external use,
    * such as display, storage, or export.
    *
    * @returns The serialized SalesSummaryReport object.
    */
    getSummaryReport(): ReturnType<SalesSummaryReport['toJSON']> {
        return this.summary.toJSON();
    }




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
    private refreshSummary(): void {
        // If there are no invoices, do nothing
        if (!this.invoices || this.invoices.length === 0) {
            // Update the summary with current invoices
            const updatedSummary = this.summary.clearInvoices();

            // Save the updated summary back to this.summary
            this.summary = updatedSummary;
            return;
        }

        // Create a new SalesSummaryReport instance for current taxpayer, userID, quarter, and year
        const newSummary = SalesSummaryReport.initialize(
            this.metadata.taxpayer,
            this.metadata.userID,
            this.metadata.quarter,
            this.metadata.year,
            this.metadata.taxSettings.incomeTaxType
        );

        // Update the summary with current invoices
        const updatedSummary = newSummary.updateInvoices(this.invoices);

        // Save the updated summary back to this.summary
        this.summary = updatedSummary;
    }





    /**
    * Converts the current `BuwisFriend` class to a plain JSON object and automatically generates an ID.
    * @returns {object} - A plain JSON object representation of the `BuwisFriend` with an autogenerated ID.
    */
    finalize(): object {
        return {
            id: autogenerateID(this.metadata.userID),
            metadata: this.metadata,
            invoices: this.invoices,
            summary: this.summary,
            timestamp: this.timestamp
        };
    }


    /**
    * Converts the current `BuwisFriend` object to a plain JavaScript object (JSON).
    * @returns {object} - The plain object representation of the `BuwisFriend` instance.
    */
    toJSON(): object {

        return {
            id: this.id,
            metadata: this.metadata,
            invoices: this.invoices,
            summary: this.summary,
            timestamp: this.timestamp
        };
    }



    /**
    * Static method to parse a JSON string or object into a `BuwisFriend` instance.
    * 
    * @param json - A JSON string or plain object to be parsed.
    * @returns {BuwisFriend} - A new `BuwisFriend` instance based on the parsed JSON.
    * @throws Will throw an error if required properties are missing.
    */
    static parseFromJSON(json: string | object): BuwisFriend {
        // If the input is a string, parse it as JSON
        const parsedData = typeof json === 'string' ? JSON.parse(json) : json;

        // Validate required properties
        if (!parsedData.id) {
            throw new Error("Missing required property: 'id'");
        }

        if (!parsedData.metadata) {
            throw new Error("Missing required property: 'metadata'");
        }


        if (!parsedData.invoices) {
            throw new Error("Missing required property: 'invoices'");
        }

        if (!parsedData.summary) {
            throw new Error("Missing required property: 'summary'");
        }


        // Create and return a new BuwisFriend instance with the validated data
        return new BuwisFriend(
            parsedData.id,
            parsedData.metadata,
            parsedData.invoices,
            parsedData.summary,
            parsedData.timestamp
        );
    }




}



/**
 * Generates a unique ID based on a given input string and the current Unix timestamp.
 * Used as a fallback when no ID is provided for the sales report.
 *
 * @param input - Item name or any descriptive string to use in the ID.
 * @returns A unique string identifier in the format: `buwisfriend-[slug]-[timestamp]`
 */
function autogenerateID(input: string): string {
    const unixTime = Math.floor(Date.now() / 1000);
    const titleText = input
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return `buwisfriend-${titleText}-${unixTime}`;
}
