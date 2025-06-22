import { LegalEntity, TaxpayerInfo } from "./types-business";
/** Type of Value-Added Tax applied to the invoice */
export declare enum InvoiceVATType {
    /** Invoice is not subject to VAT */
    NON_VAT = "Non-VAT",
    /** Invoice is subject to VAT */
    VAT = "VAT"
}
export declare enum VATSubType {
    /** Invoice is not subject to VAT */
    STANDARD = "Standard",
    /** Invoice is subject to VAT */
    EXEMPT = "Exempt",
    ZERO_RATED = "Zero-rated"
}
/** Payment methods accepted for the invoice */
export declare enum InvoicePaymentMethod {
    /** Payment is made in cash */
    CASH = "Cash",
    /** Payment is made via bank transfer or deposit */
    BANK = "Bank",
    /** Payment is made via e-wallet transfer */
    EWALLET = "E-Wallet",
    /** Payment is made using a check */
    CHECK = "Check"
}
/**
 * Enum representing different types of invoices.
 */
export declare enum InvoiceType {
    /** Sales invoice for selling goods or products */
    SALES = "Sales",
    /** Service invoice for professional or labor-based services */
    SERVICE = "Service",
    /** Commercial invoice typically used for business-to-business, cross-border exports, or bulk transactions */
    COMMERCIAL = "Commercial"
}
/**
 * Metadata required by the Bureau of Internal Revenue (BIR)
 */
export interface BIRMetadata {
    /**
     * BIR Form Number (e.g. 2307, 2551Q)
     */
    formNumber: string;
    /**
     * Official invoice number assigned to this transaction
     */
    invoiceNumber: string;
    /**
     * Form series or version (e.g. "January 2020 (ENCS)")
     */
    series: string;
    /**
     * Revenue District Office (RDO) code
     */
    rdo: string;
    /**
     * VAT classification type (e.g. VAT or Non-VAT)
     */
    type: InvoiceVATType;
    /**
    * Classification of the invoice based on its purpose (e.g. Sales, Service, or Commercial)
    */
    category: InvoiceType;
    /**
    * The brand or company logo to be displayed on the invoice (usually as a URL or base64 image string)
    */
    companyLogo?: string;
}
/** Information about individual items or services included in the invoice */
export interface OrderMetadata {
    /** Short name or label for the item/service */
    label: string;
    /** Optional detailed description */
    description?: string | null;
    /** Number of units ordered */
    quantity: number;
    /** Unit of measurement (e.g. pcs, kg, hrs) */
    unit: string;
    /** Price per unit */
    unitPrice: number;
    /** Total amount for this item (quantity × unitPrice) */
    amount: number;
}
/** Discounts applicable to the invoice */
export interface InvoiceDiscount {
    /** Discount for senior citizens or persons with disabilities */
    scPWD: number;
    /** Other applicable discounts */
    other: number;
    /** Total of all discounts applied */
    totalDiscount: number;
}
/** Details about VAT and sales composition */
export interface VATMetadata {
    /** Applicable VAT rate (e.g. 0.12 for 12%) */
    rate: number;
    vatSubtype: VATSubType;
    isVATInclusive: boolean;
    /** Total VAT amount computed */
    totalVAT: number;
    /** Sales subject to VAT */
    salesVATable: number;
    /** Sales exempted from VAT */
    vatExemptSales: number;
    /** Sales subject to 0% VAT */
    vatZeroRatedSales: number;
    /** Total sales amount including VAT */
    totalSalesVATInclusive: number;
}
/**
 * Details about Percentage Tax composition
 */
export interface PercentageTaxMetadata {
    /**
     * Applicable Percentage Tax rate (e.g. 0.03 for 3%)
     */
    rate: number;
    /**
     * Total Percentage Tax amount computed based on the applicable rate
     */
    totalPercentageTax: number;
}
/**
 * Details about Withholding Tax composition
 */
export interface WithholdingTaxMetadata {
    /**
     * Applicable Withholding Tax rate (e.g. 0.05 for 5%)
     */
    rate: number;
    /**
     * Total Withholding Tax amount computed based on the applicable rate
     */
    totalWithheldTax: number;
}
/** Breakdown of totals and computations for the invoice */
export interface InvoiceBreakdown {
    /** Gross total of all sales before discounts */
    totalSales: number;
    /** Final receivable amount after percentage tax */
    netReceivable: number;
    /** Discount details applied to the total */
    discount: InvoiceDiscount;
    /** Final amount due after taxes and discounts */
    totalAmountDue: number;
    /** Sales subject to percentage tax */
    salesPT: number;
    /** Amount of exempted sales */
    exemptSales: number;
    /** VAT computation metadata */
    vat: VATMetadata;
    /**  Percentage Tax computation metadata, including rate and total percentage tax amount  */
    percentageTax: PercentageTaxMetadata;
    /** Amount withheld as tax (e.g. withholding tax) */
    withholdingTax: WithholdingTaxMetadata;
}
/** Full order data including items and financial breakdown */
export interface OrderInformation {
    /** Currency used for the transaction (e.g. PHP, USD) */
    currency: string;
    /** Array of ordered items or services */
    orders: OrderMetadata[];
    /** Computed financial breakdown of the invoice */
    breakdown: InvoiceBreakdown;
}
/** Bank account information used for payment */
export interface BankInformation {
    /** Name of the bank */
    name: string;
    /** Account number */
    accountNumber: string;
    /** Bank branch name */
    branch: string;
    /** Bank code (e.g. BIC or SWIFT code) */
    code: string;
    /** Full address of the bank branch */
    address: string;
}
/** Bank account information used for payment */
export interface CheckInformation {
    /** Check number */
    number: string;
    /** Date written on the check */
    date: string;
}
/** Details about the chosen method of payment */
export interface PaymentInformation {
    /** Method of payment (Cash, Bank, or Check) */
    method: InvoicePaymentMethod;
    /** Optional bank information (required if payment is via bank) */
    bank?: BankInformation;
    /** Optional check information (required if payment is via check) */
    check?: CheckInformation;
    /** Optional reference number (required if payment is via ewallet) */
    referenceNumber?: string;
}
/**
 * Interface defining the default tax rates used in invoice computations.
 */
export interface DefaultTaxRates {
    /** Default VAT rate (12%) applied to VAT-registered transactions */
    vat: number;
    /** Default percentage tax rate (3%) for non-VAT registered businesses */
    percentageTax: number;
    /** Default withholding tax rate (5%) applied to income subject to withholding */
    withholdingTax: number;
}
/**
 * Standard default tax rates used when no custom rates are provided.
 */
export declare const defaultTaxRates: DefaultTaxRates;
export declare const defaultSCPWDDiscount = 0.2;
/** Represents a complete digital invoice */
export declare class DigitalInvoice {
    /** Unique identifier for the invoice */
    id: string;
    /** Metadata required by BIR regulations */
    metadata: BIRMetadata;
    /** Customer or buyer details */
    customer: LegalEntity;
    /** Seller or issuer details */
    issuer: LegalEntity;
    /** Order and financial breakdown information */
    order: OrderInformation;
    /** Payment method and related info */
    payment: PaymentInformation;
    /** Timestamp of invoice creation (ISO string) */
    timestamp: string;
    /**
     * Constructs a new `DigitalInvoice` instance.
     * Automatically generates defaults for ID, timestamp, and required fields if not provided.
     *
     * @param id - Optional unique invoice ID. If not provided, will be auto-generated.
     * @param metadata - BIR-related metadata (form, RDO, VAT type, invoice number, etc.).
     * @param customer - The invoice recipient's details.
     * @param issuer - The invoice issuer's details.
     * @param order - The order items and financial breakdown.
     * @param payment - Payment method and optional details.
     * @param timestamp - Optional timestamp of invoice creation. Defaults to now.
     */
    constructor(id: string | undefined, metadata: BIRMetadata, customer: LegalEntity, issuer: LegalEntity, order: OrderInformation, payment: PaymentInformation, timestamp?: string);
    /**
    * Initializes and creates a new `DigitalInvoice` with default and null values.
    * @param type - Optional Invoice Type. If not provided, defaults to NON-VAT.
    * @returns A new `DigitalInvoice` instance.
    */
    static initialize(type?: InvoiceVATType): DigitalInvoice;
    /**
     * Loads an exported Taxpayer Information Data.
     * @param input - The Taxpayer Information to load and use for this invoice. Must be a valid `TaxpayerInfo` object.
     * @throws Will throw an error if the `input` is not provided.
     */
    loadTaxpayerInfo(input: TaxpayerInfo): this;
    /**
     * Exports a Taxpayer Information Data.
     */
    exportTaxpayerInfo(): TaxpayerInfo;
    /**
    * Updates the invoice's company logo.
    * @param input - The new company logo to set. Must be a non-empty string of an image's url path or base64.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setInvoiceCompanyLogo(input: string): this;
    /**
     * Updates the date of transaction.
     * @param input - The new date of transaction to set. Must be a non-empty string in ISO format.
     * @throws Will throw an error if the `input` is not provided or is not a string.
     */
    setInvoiceDateTransaction(input: string): this;
    /**
     * Updates the invoice form number.
     * @param input - The new invoice form number to set. Must be a non-empty string.
     * @throws Will throw an error if the `input` is not provided or is not a string.
     */
    setInvoiceFormNumber(input: string): this;
    /**
     * Updates the invoice number.
     * @param input - The new invoice number to set. Must be a non-empty string.
     * @throws Will throw an error if the `input` is not provided or is not a string.
     */
    setInvoiceNumber(input: string): this;
    /**
     * Updates the invoice series.
     * @param input - The new invoice series to set. Must be a non-empty string.
     * @throws Will throw an error if the `input` is not provided or is not a string.
     */
    setInvoiceSeries(input: string): this;
    /**
     * Updates the Revenue District Office number.
     * @param input - The new Revenue District Office number to set. Must be a non-empty string.
     * @throws Will throw an error if the `input` is not provided or is not a string.
     */
    setInvoiceRDO(input: string): this;
    /**
     * Updates the Invoice Type.
     * @param input - The new Invoice Type to set. Use Enum `InvoiceType`.
     * @throws Will throw an error if the `input` is not provided or is not a string.
     */
    setInvoiceType(input: InvoiceType): this;
    /**
      * Updates the VAT type of the invoice.
      * @param input - The new Invoice VAT type to set. Use Enum `InvoiceVATType`.
      * @throws Will throw an error if the `input` is not provided or is not a string.
      */
    setInvoiceVATType(input: InvoiceVATType): this;
    /**
    * Updates the invoice's currency.
    * @param input - The new currency to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setInvoiceCurrency(input: string): this;
    /**
    * Updates the invoice's customer name.
    * @param input - The new customer name to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setCustomerName(input: string): this;
    /**
    * Updates the invoice's customer address.
    * @param input - The new customer address to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setCustomerAddress(input: string): this;
    /**
    * Updates the invoice's customer TIN.
    * @param input - The new customer TIN to set. Must be a valid number.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setCustomerTIN(input: string): this;
    /**
    * Updates the invoice's customer business name.
    * @param input - The new customer business name to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setCustomerBusinessName(input: string): this;
    /**
    * Updates the invoice's customer email.
    * @param input - The new customer email to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setCustomerEmail(input: string): this;
    /**
    * Updates the invoice's customer website.
    * @param input - The new customer website to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setCustomerWebsite(input: string): this;
    /**
    * Updates the invoice's customer OSCA/PWD Number.
    * @param input - The new customer OSCA/PWD Number to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setCustomerOSCAPWDNumber(input: string): this;
    /**
    * Updates the invoice's customer contact number.
    * @param input - The new customer contact number to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setCustomerContactNumber(input: string): this;
    /**
    * Updates the invoice's issuer name.
    * @param input - The new issuer name to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setIssuerName(input: string): this;
    /**
    * Updates the invoice's issuer address.
    * @param input - The new issuer address to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setIssuerAddress(input: string): this;
    /**
    * Updates the invoice's issuer TIN.
    * @param input - The new issuer TIN to set. Must be a valid number.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setIssuerTIN(input: string): this;
    /**
    * Updates the invoice's issuer business name.
    * @param input - The new issuer business name to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setIssuerBusinessName(input: string): this;
    /**
    * Updates the invoice's issuer email.
    * @param input - The new issuer email to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setIssuerEmail(input: string): this;
    /**
    * Updates the invoice's issuer website.
    * @param input - The new issuer website to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setIssuerWebsite(input: string): this;
    /**
    * Updates the invoice's issuer OSCA/PWD Number.
    * @param input - The new issuer OSCA/PWD Number to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setIssuerOSCAPWDNumber(input: string): this;
    /**
    * Updates the invoice's issuer contact number.
    * @param input - The new issuer contact number to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setIssuerContactNumber(input: string): this;
    /**
    * Updates the invoice's VAT Rate.
    * @param input - The new VAT Rate to set. Must be a valid number.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setRateVAT(input: number): this;
    /**
    * Updates the invoice's Percentage Tax Rate.
    * @param input - The new Percentage Tax Rate to set. Must be a valid number.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setRatePercentageTax(input: number): this;
    /**
    * Updates the invoice's Withholding Tax Rate.
    * @param input - The new Withholding Tax Rate to set. Must be a valid number.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setRateWithholding(input: number): this;
    /**
    * Clears and disables the invoice's Withholding Tax.
    */
    disableWithholdingTax(): this;
    /**
    * Clears and disables the invoice's Percentage Tax.
    */
    disablePercentageTax(): this;
    /**
    * Sets the invoice's Percentage Tax to default rate.
    */
    resetPercentageTax(): this;
    /**
    * Sets the list of Orders
    * @param list - The new list of Orders. Must be a `OrderMetadata[]`.
    */
    setListOrders(list: OrderMetadata[]): this;
    /**
    * Clears the list of Orders
    */
    clearListOrders(): this;
    /**
    * Updates the Invoice's payment method.
    * @param input - The new payment method to set. Use Enum `InvoicePaymentMethod`.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setPaymentMethod(input: InvoicePaymentMethod): this;
    /**
    * Updates the Invoice's payment bank name.
    * @param input - The new bank name to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setPaymentBankName(input: string): this;
    /**
    * Updates the Invoice's payment bank account number.
    * @param input - The new bank account number to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setPaymentBankAccountNumber(input: string): this;
    /**
    * Updates the Invoice's payment bank branch.
    * @param input - The new bank branch to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setPaymentBankBranch(input: string): this;
    /**
    * Updates the Invoice's payment bank code.
    * @param input - The new bank code to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setPaymentBankCode(input: string): this;
    /**
    * Updates the Invoice's payment bank address.
    * @param input - The new bank address to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setPaymentBankAddress(input: string): this;
    /**
    * Updates the Invoice's payment check number.
    * @param input - The new check number to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setPaymentCheckNumber(input: string): this;
    /**
    * Updates the Invoice's payment check date.
    * @param input - The new check date to set. Must be a non-empty string in ISO format.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setPaymentCheckDate(input: string): this;
    /**
   * Updates the Invoice's payment reference number.
   * @param input - The new reference number to set. Must be a non-empty string.
   * @throws Will throw an error if the `input` is not provided or is not a string.
   */
    setPaymentReferenceNumber(input: string): this;
    /**
    * Sets or toggles whether the invoice is VAT-inclusive or VAT-exclusive.
    *
    * This method applies only to VAT-type invoices. Throws an error if used on non-VAT invoices.
    *
    * @param bool - Optional. If `true`, sets the invoice as VAT-inclusive.
    *                If `false`, sets it as VAT-exclusive.
    *                If omitted, the current VAT-inclusive state will be toggled.
    */
    toggleVATInclusive(bool?: boolean): this;
    /**
    * Computes the invoice breakdown based on current order, discounts, taxes, and VAT type.
    */
    private computeBreakdown;
    /**
    * Returns the total net profit amount the issuer will receive after paying and subtracting all taxes
    */
    getNetReceivables(): number;
    /**
    * Returns true if the customer is eligible for a Senior Citizen/PWD Discount and a valid OSCA/PWD number is provided
    */
    private isEligibleForScPwdDiscount;
    /**
    * Validates the `DigitalInvoice` instance to ensure that all required fields are set.
    * If any required field is missing or invalid, the method will either throw an error
    * or return `false`, depending on the `throwError` parameter.
    *
    * @param throwError - Optional. If true, throws an error for the first missing or invalid property.
    *                     Defaults to false, in which case it returns a boolean indicating validity.
    * @returns {boolean} - Returns true if the instance is valid, or false if not when `throwError` is false.
    * @throws {Error} - Throws an error when a required field is missing or invalid, and `throwError` is true.
    */
    validateSelf(throwError?: boolean): boolean;
    /**
    * Converts the current `DigitalInvoice` class to a plain JSON object and automatically generates an ID.
    * @returns {object} - A plain JSON object representation of the `DigitalInvoice` with an autogenerated ID.
    */
    finalize(): object;
    /**
    * Converts the current `DigitalInvoice` object to a plain JavaScript object (JSON).
    * @returns {object} - The plain object representation of the `DigitalInvoice` instance.
    */
    toJSON(): object;
    /**
    * Static method to parse a JSON string or object into a `DigitalInvoice` instance.
    *
    * @param json - A JSON string or plain object to be parsed.
    * @returns {DigitalInvoice} - A new `DigitalInvoice` instance based on the parsed JSON.
    * @throws Will throw an error if required properties are missing.
    */
    static parseFromJSON(json: string | object): DigitalInvoice;
}
