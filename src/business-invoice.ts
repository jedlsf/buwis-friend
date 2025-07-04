import { LegalEntity, TaxpayerInfo } from "./types-business";


/** Type of Value-Added Tax applied to the invoice */
export enum InvoiceVATType {
    /** Invoice is not subject to VAT */
    NON_VAT = 'Non-VAT',

    /** Invoice is subject to VAT */
    VAT = 'VAT',
}

export enum VATSubType {
    /** Invoice is not subject to VAT */
    STANDARD = "Standard",

    /** Invoice is subject to VAT */
    EXEMPT = "Exempt",

    ZERO_RATED = "Zero-rated"
}




/** Payment methods accepted for the invoice */
export enum InvoicePaymentMethod {
    /** Payment is made in cash */
    CASH = 'Cash',

    /** Payment is made via bank transfer or deposit */
    BANK = 'Bank',

    /** Payment is made via e-wallet transfer */
    EWALLET = 'E-Wallet',

    /** Payment is made using a check */
    CHECK = 'Check',
}


/**
 * Enum representing different types of invoices.
 */
export enum InvoiceType {
    /** Sales invoice for selling goods or products */
    SALES = 'Sales',

    /** Service invoice for professional or labor-based services */
    SERVICE = 'Service',

    /** Commercial invoice typically used for business-to-business, cross-border exports, or bulk transactions */
    COMMERCIAL = 'Commercial',
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
export const defaultTaxRates: DefaultTaxRates = {
    vat: 0.12,
    percentageTax: 0.03,
    withholdingTax: 0.05
};

export const defaultSCPWDDiscount = 0.2;



/** Represents a complete digital invoice */
export class DigitalInvoice {
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
    constructor(
        id: string | undefined,
        metadata: BIRMetadata,
        customer: LegalEntity,
        issuer: LegalEntity,
        order: OrderInformation,
        payment: PaymentInformation,
        timestamp?: string
    ) {
        this.id = id || autogenerateID(metadata.invoiceNumber || "bir-invoice");
        this.timestamp = timestamp || new Date().toISOString();
        this.metadata = metadata || {
            formNumber: "2703",
            type: InvoiceVATType.NON_VAT,
            category: InvoiceType.SALES,
            series: "January 2020 (ENCS)",
            rdo: "000",
            invoiceNumber: "1000A0001001"
        };

        this.customer = customer || {
            name: "Customer XYZ",
            tin: "100000000000",
            address: "123 ABC St., Brgy. DEF, Manila City, NCR, Philippines",
            businessName: "The Zelijah World"
        };

        this.issuer = issuer || {
            name: "Taxpayer ABC",
            tin: "100000000000",
            address: "123 XYZ St., Brgy. DEF, Makati City, NCR, Philippines",
            businessName: "The Zelijah World"
        };

        this.order = order || {
            orders: [],
            breakdown: {
                totalSales: 0,
                netReceivable: 0,
                discount: {
                    scPWD: 0,
                    other: 0,
                    totalDiscount: 0
                },
                totalAmountDue: 0,
                salesPT: 0,
                exemptSales: 0,
                vat: {
                    rate: metadata.type === InvoiceVATType.VAT ? defaultTaxRates.vat : 0,
                    totalVAT: 0,
                    salesVATable: 0,
                    vatExemptSales: 0,
                    vatZeroRatedSales: 0,
                    totalSalesVATInclusive: 0,
                },
                percentageTax: {
                    rate: metadata.type === InvoiceVATType.NON_VAT ? defaultTaxRates.percentageTax : 0,
                    totalPercentageTax: 0
                },
                withholdingTax: {
                    rate: defaultTaxRates.withholdingTax,
                    totalWithheldTax: 0
                }
            },
            currency: "PHP"
        };

        this.payment = payment || {
            method: InvoicePaymentMethod.CASH
        };
    }




    /**
    * Initializes and creates a new `DigitalInvoice` with default and null values.
    * @param type - Optional Invoice Type. If not provided, defaults to NON-VAT.
    * @returns A new `DigitalInvoice` instance.
    */
    static initialize(
        type: InvoiceVATType = InvoiceVATType.NON_VAT
    ): DigitalInvoice {

        const defaultMetadata: BIRMetadata = {
            formNumber: "2703",
            type: type,
            category: InvoiceType.SALES,
            series: "January 2020 (ENCS)",
            rdo: "000",
            invoiceNumber: "1000A0001001"
        };

        const defaultCustomer: LegalEntity = {
            name: "Customer XYZ",
            tin: "100000000000",
            address: "123 ABC St., Brgy. DEF, Manila City, NCR, Philippines",
            businessName: "The Zelijah World"
        };

        const defaultSeller: LegalEntity = {
            name: "Taxpayer ABC",
            tin: "100000000000",
            address: "123 XYZ St., Brgy. DEF, Makati City, NCR, Philippines",
            businessName: "The Zelijah World"
        };

        const defaultOrder: OrderInformation = {
            orders: [],
            breakdown: {
                totalSales: 0,
                netReceivable: 0,
                discount: {
                    scPWD: 0,
                    other: 0,
                    totalDiscount: 0
                },
                totalAmountDue: 0,
                salesPT: 0,
                exemptSales: 0,
                vat: {
                    rate: type === InvoiceVATType.VAT ? defaultTaxRates.vat : 0,
                    isVATInclusive: true,
                    vatSubtype: VATSubType.STANDARD,
                    totalVAT: 0,
                    salesVATable: 0,
                    vatExemptSales: 0,
                    vatZeroRatedSales: 0,
                    totalSalesVATInclusive: 0,
                },
                percentageTax: {
                    rate: type === InvoiceVATType.NON_VAT ? defaultTaxRates.percentageTax : 0,
                    totalPercentageTax: 0
                },
                withholdingTax: {
                    rate: defaultTaxRates.withholdingTax,
                    totalWithheldTax: 0
                }

            },
            currency: "PHP"
        };

        const defaultPayment: PaymentInformation = {
            method: InvoicePaymentMethod.CASH
        };



        // Create and return a new voucher instance
        return new DigitalInvoice(
            undefined,
            defaultMetadata,
            defaultCustomer,
            defaultSeller,
            defaultOrder,
            defaultPayment,
            undefined
        );
    }



    // Invoice Metadata Methods



    /**
     * Loads an exported Taxpayer Information Data.
     * @param input - The Taxpayer Information to load and use for this invoice. Must be a valid `TaxpayerInfo` object.
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


        const isVAT = input.metadata.type === InvoiceVATType.VAT;
        if (isVAT) {
            if (!input.tax.vat) {
                throw new Error("Taxpayer's VAT Settings are not found.");
            }
            this.order.breakdown.vat.rate = input.tax.vat.rate;
        } else {
            if (!input.tax.percentageTax) {
                throw new Error("Taxpayer's Percentage Tax Settings are not found.");
            }
            this.order.breakdown.percentageTax.rate = input.tax.percentageTax.rate;
        }

        this.metadata.companyLogo = input.metadata.companyLogo
        this.metadata.category = input.metadata.category
        this.metadata.rdo = input.metadata.rdo
        this.issuer = input.issuer;

        return this;
    }



    /**
     * Exports a Taxpayer Information Data.
     */
    exportTaxpayerInfo(): TaxpayerInfo {


        if (!this.issuer.name || typeof this.issuer.name !== 'string' || this.issuer.name.trim() === "") {
            throw new Error("Taxpayer's name must be a valid non-empty string.");
        }

        if (!this.issuer.tin) {
            throw new Error("Taxpayer's TIN must be a valid registered number.");
        }


        if (!this.issuer.businessName || typeof this.issuer.businessName !== 'string' || this.issuer.businessName.trim() === "") {
            throw new Error("Taxpayer's business name/style must be a valid non-empty string.");
        }

        if (!this.issuer.address || typeof this.issuer.address !== 'string' || this.issuer.address.trim() === "") {
            throw new Error("Taxpayer's address must be a valid non-empty string.");
        }

        if (!this.metadata.type) {
            throw new Error("Taxpayer's Invoice VAT Type is not found.");
        }

        if (!this.metadata.category) {
            throw new Error("Taxpayer's Invoice Type is not found.");
        }

        const isVAT = this.metadata.type === InvoiceVATType.VAT;


        if (isVAT) {
            if (!this.order.breakdown.vat) {
                throw new Error("Taxpayer's VAT Settings are not found.");
            }

        } else {

            if (!this.order.breakdown.percentageTax) {
                throw new Error("Taxpayer's Percentage Tax Settings are not found.");
            }

        }


        const exportedData: TaxpayerInfo = {
            issuer: this.issuer,
            metadata: this.metadata,
            tax: {
                vat: this.order.breakdown.vat,
                percentageTax: this.order.breakdown.percentageTax
            }

        };

        return exportedData;
    }


    /**
    * Updates the invoice's company logo.
    * @param input - The new company logo to set. Must be a non-empty string of an image's url path or base64.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setInvoiceCompanyLogo(input: string): this {

        if (!input || typeof input !== 'string' || input.trim() === "") {
            this.metadata.companyLogo = undefined;
            throw new Error("Company Logo image path must be a valid non-empty string.");
        }

        this.metadata.companyLogo = input;
        return this;
    }



    /**
     * Updates the date of transaction.
     * @param input - The new date of transaction to set. Must be a non-empty string in ISO format.
     * @throws Will throw an error if the `input` is not provided or is not a string.
     */
    setInvoiceDateTransaction(input: string): this {

        if (!input || typeof input !== 'string' || input.trim() === "") {
            throw new Error("Invoice Date of Transaction must be a valid non-empty ISO string.");
        }

        this.timestamp = input;
        return this;
    }




    /**
     * Updates the invoice form number.
     * @param input - The new invoice form number to set. Must be a non-empty string.
     * @throws Will throw an error if the `input` is not provided or is not a string.
     */
    setInvoiceFormNumber(input: string): this {

        if (!input || typeof input !== 'string' || input.trim() === "") {
            throw new Error("Invoice Form number must be a valid non-empty string.");
        }

        this.metadata.formNumber = input;
        return this;
    }



    /**
     * Updates the invoice number.
     * @param input - The new invoice number to set. Must be a non-empty string.
     * @throws Will throw an error if the `input` is not provided or is not a string.
     */
    setInvoiceNumber(input: string): this {

        if (!input || typeof input !== 'string' || input.trim() === "") {
            throw new Error("Invoice number must be a valid non-empty string.");
        }

        this.metadata.invoiceNumber = input.toUpperCase();
        return this;
    }

    /**
     * Updates the invoice series.
     * @param input - The new invoice series to set. Must be a non-empty string.
     * @throws Will throw an error if the `input` is not provided or is not a string.
     */
    setInvoiceSeries(input: string): this {

        if (!input || typeof input !== 'string' || input.trim() === "") {
            throw new Error("Invoice series must be a valid non-empty string.");
        }

        this.metadata.series = input;
        return this;
    }

    /**
     * Updates the Revenue District Office number.
     * @param input - The new Revenue District Office number to set. Must be a non-empty string.
     * @throws Will throw an error if the `input` is not provided or is not a string.
     */
    setInvoiceRDO(input: string): this {

        if (!input || typeof input !== 'string' || input.trim() === "") {
            throw new Error("Revenue District Office number must be a valid non-empty string.");
        }

        this.metadata.rdo = input;
        return this;
    }


    /**
     * Updates the Invoice Type.
     * @param input - The new Invoice Type to set. Use Enum `InvoiceType`.
     * @throws Will throw an error if the `input` is not provided or is not a string.
     */
    setInvoiceType(input: InvoiceType): this {

        if (!input || typeof input !== 'string' || input.trim() === "") {
            throw new Error("Invoice Type must be a valid non-empty string.");
        }

        this.metadata.category = input;
        return this;
    }




    /**
      * Updates the VAT type of the invoice.
      * @param input - The new Invoice VAT type to set. Use Enum `InvoiceVATType`.
      * @throws Will throw an error if the `input` is not provided or is not a string.
      */
    setInvoiceVATType(input: InvoiceVATType): this {

        if (!input || typeof input !== 'string' || input.trim() === "") {
            throw new Error("Input must be a valid non-empty string.");
        }

        switch (input) {
            case InvoiceVATType.NON_VAT: {
                this.order.breakdown.vat = {
                    rate: 0,
                    isVATInclusive: this.order.breakdown.vat.isVATInclusive,
                    vatSubtype: VATSubType.STANDARD,
                    totalVAT: 0,
                    salesVATable: 0,
                    vatExemptSales: 0,
                    vatZeroRatedSales: 0,
                    totalSalesVATInclusive: 0,
                };

                break;
            }
            case InvoiceVATType.VAT: {

                this.order.breakdown.percentageTax = {
                    rate: 0,
                    totalPercentageTax: 0
                };

                break;
            }
            default: {
                break;
            }
        }

        this.metadata.type = input;
        return this;
    }



    /**
    * Updates the invoice's currency.
    * @param input - The new currency to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setInvoiceCurrency(input: string): this {

        if (!input || typeof input !== 'string' || input.trim() === "") {
            throw new Error("Currency must be a valid non-empty string.");
        }

        this.order.currency = input;
        return this;
    }




    // Customer Methods



    /**
    * Updates the invoice's customer name.
    * @param input - The new customer name to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setCustomerName(input: string): this {

        if (!input || typeof input !== 'string' || input.trim() === "") {
            throw new Error("Customer Name must be a valid non-empty string.");
        }

        this.customer.name = input;
        return this;
    }



    /**
    * Updates the invoice's customer address.
    * @param input - The new customer address to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setCustomerAddress(input: string): this {

        if (!input || typeof input !== 'string' || input.trim() === "") {
            throw new Error("Customer Address must be a valid non-empty string.");
        }

        this.customer.address = input;
        return this;
    }



    /**
    * Updates the invoice's customer TIN.
    * @param input - The new customer TIN to set. Must be a valid number.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setCustomerTIN(input: string): this {

        if (!input || typeof input !== 'string' || input.trim() === "") {
            throw new Error("Customer TIN must be a valid number.");
        }

        this.customer.tin = input;
        return this;
    }


    /**
    * Updates the invoice's customer business name.
    * @param input - The new customer business name to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setCustomerBusinessName(input: string): this {

        if (!input || typeof input !== 'string' || input.trim() === "") {
            throw new Error("Customer Business Name must be a valid non-empty string.");
        }

        this.customer.businessName = input;
        return this;
    }



    /**
    * Updates the invoice's customer email.
    * @param input - The new customer email to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setCustomerEmail(input: string): this {

        if (!input || typeof input !== 'string' || input.trim() === "") {
            this.customer.emailAddress = undefined;
        }

        this.customer.emailAddress = input;
        return this;
    }





    /**
    * Updates the invoice's customer website.
    * @param input - The new customer website to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setCustomerWebsite(input: string): this {

        if (!input || typeof input !== 'string' || input.trim() === "") {
            this.customer.website = undefined;
        }

        this.customer.website = input;
        return this;
    }




    /**
    * Updates the invoice's customer OSCA/PWD Number.
    * @param input - The new customer OSCA/PWD Number to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setCustomerOSCAPWDNumber(input: string): this {

        if (!input || typeof input !== 'string' || input.trim() === "") {
            this.customer.oscaPWDNumber = undefined;
        }

        this.customer.oscaPWDNumber = input;
        this.computeBreakdown();
        return this;
    }



    /**
    * Updates the invoice's customer contact number.
    * @param input - The new customer contact number to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setCustomerContactNumber(input: string): this {

        if (!input || typeof input !== 'string' || input.trim() === "") {
            this.customer.contactNumber = undefined;
        }

        this.customer.contactNumber = input;
        return this;
    }




    // Issuer Methods



    /**
    * Updates the invoice's issuer name.
    * @param input - The new issuer name to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setIssuerName(input: string): this {

        if (!input || typeof input !== 'string' || input.trim() === "") {
            throw new Error("Issuer Name must be a valid non-empty string.");
        }

        this.issuer.name = input;
        return this;
    }



    /**
    * Updates the invoice's issuer address.
    * @param input - The new issuer address to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setIssuerAddress(input: string): this {

        if (!input || typeof input !== 'string' || input.trim() === "") {
            throw new Error("Issuer Address must be a valid non-empty string.");
        }

        this.issuer.address = input;
        return this;
    }



    /**
    * Updates the invoice's issuer TIN.
    * @param input - The new issuer TIN to set. Must be a valid number.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setIssuerTIN(input: string): this {

        if (!input || typeof input !== 'string' || input.trim() === "") {
            throw new Error("Issuer TIN must be a valid number.");
        }

        this.issuer.tin = input;
        return this;
    }


    /**
    * Updates the invoice's issuer business name.
    * @param input - The new issuer business name to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setIssuerBusinessName(input: string): this {

        if (!input || typeof input !== 'string' || input.trim() === "") {
            throw new Error("Issuer Business Name must be a valid non-empty string.");
        }

        this.issuer.businessName = input;
        return this;
    }



    /**
    * Updates the invoice's issuer email.
    * @param input - The new issuer email to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setIssuerEmail(input: string): this {

        if (!input || typeof input !== 'string' || input.trim() === "") {
            this.issuer.emailAddress = undefined;
        }

        this.issuer.emailAddress = input;
        return this;
    }



    /**
    * Updates the invoice's issuer website.
    * @param input - The new issuer website to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setIssuerWebsite(input: string): this {

        if (!input || typeof input !== 'string' || input.trim() === "") {
            this.issuer.website = undefined;
        }

        this.issuer.website = input;
        return this;
    }




    /**
    * Updates the invoice's issuer OSCA/PWD Number.
    * @param input - The new issuer OSCA/PWD Number to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setIssuerOSCAPWDNumber(input: string): this {

        if (!input || typeof input !== 'string' || input.trim() === "") {
            this.issuer.oscaPWDNumber = undefined;
        }

        this.issuer.oscaPWDNumber = input;
        return this;
    }



    /**
    * Updates the invoice's issuer contact number.
    * @param input - The new issuer contact number to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setIssuerContactNumber(input: string): this {

        if (!input || typeof input !== 'string' || input.trim() === "") {
            this.issuer.contactNumber = undefined;
        }

        this.issuer.contactNumber = input;
        return this;
    }







    /**
    * Updates the invoice's VAT Rate.
    * @param input - The new VAT Rate to set. Must be a valid number.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setRateVAT(input: number): this {

        if (this.metadata.type !== InvoiceVATType.VAT) {
            this.order.breakdown.vat.rate = 0;
            throw new Error("This invoice type does not support VAT rates.");
        }

        if (!input || input.toString().trim() === "") {
            this.order.breakdown.vat.rate = defaultTaxRates.vat;
        }

        this.order.breakdown.vat.rate = input;
        this.computeBreakdown();
        return this;
    }



    /**
    * Updates the invoice's Percentage Tax Rate.
    * @param input - The new Percentage Tax Rate to set. Must be a valid number.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setRatePercentageTax(input: number): this {

        if (this.metadata.type !== InvoiceVATType.NON_VAT) {
            this.order.breakdown.percentageTax.rate = 0;
            throw new Error("This invoice type does not support Percentage Tax rates.");
        }

        if (!input || input.toString().trim() === "") {
            this.order.breakdown.percentageTax.rate = defaultTaxRates.percentageTax;
        }

        this.order.breakdown.percentageTax.rate = input;
        this.computeBreakdown();
        return this;
    }






    /**
    * Updates the invoice's Withholding Tax Rate.
    * @param input - The new Withholding Tax Rate to set. Must be a valid number.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setRateWithholding(input: number): this {

        if (!input || input.toString().trim() === "" || input === undefined) {
            this.order.breakdown.withholdingTax.rate = 0;
        }

        this.order.breakdown.withholdingTax.rate = input;
        this.computeBreakdown();
        return this;
    }


    /**
    * Clears and disables the invoice's Withholding Tax.
    */

    disableWithholdingTax(): this {
        this.order.breakdown.withholdingTax.rate = 0;
        this.computeBreakdown();
        return this;
    }


    /**
    * Clears and disables the invoice's Percentage Tax.
    */

    disablePercentageTax(): this {
        this.order.breakdown.percentageTax.rate = 0;
        this.computeBreakdown();
        return this;
    }

    /**
    * Sets the invoice's Percentage Tax to default rate.
    */

    resetPercentageTax(): this {
        this.order.breakdown.percentageTax.rate = defaultTaxRates.percentageTax;
        this.computeBreakdown();
        return this;
    }



    // Order Updates

    /**
    * Sets the list of Orders
    * @param list - The new list of Orders. Must be a `OrderMetadata[]`.
    */
    setListOrders(list: OrderMetadata[]): this {

        if (!list || list.length === 0) {
            this.order.orders = [];
        }

        this.order.orders = list;

        this.computeBreakdown();
        return this;
    }


    /**
    * Clears the list of Orders
    */
    clearListOrders(): this {
        this.order.orders = [];
        this.computeBreakdown();

        return this;
    }


    //Payment Method


    /**
    * Updates the Invoice's payment method.
    * @param input - The new payment method to set. Use Enum `InvoicePaymentMethod`.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setPaymentMethod(input: InvoicePaymentMethod): this {

        if (!input || typeof input !== 'string' || input.trim() === "") {
            throw new Error("Payment Method must be a valid non-empty string.");
        }


        switch (input) {
            case InvoicePaymentMethod.CASH: {
                this.payment.check = undefined;
                this.payment.bank = undefined;
                this.payment.referenceNumber = undefined;
                break;
            }
            case InvoicePaymentMethod.BANK: {
                this.payment.check = undefined;
                break;
            }
            case InvoicePaymentMethod.CHECK: {
                this.payment.bank = undefined;
                this.payment.referenceNumber = undefined;
                break;
            }
            case InvoicePaymentMethod.EWALLET: {
                this.payment.check = undefined;
                break;
            }
            default: {
                break;
            }

        }

        this.payment.method = input;
        return this;
    }


    /**
    * Updates the Invoice's payment bank name.
    * @param input - The new bank name to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setPaymentBankName(input: string): this {


        if (this.payment.method === InvoicePaymentMethod.CASH) {
            this.payment.bank = undefined;
            throw new Error("This payment method does not support bank information.");
        }

        if (!input || typeof input !== 'string' || input.trim() === "") {
            throw new Error("Bank Name must be a valid non-empty string.");
        }

        this.payment.bank ??= {
            name: "Bank ABC",
            accountNumber: "10000001",
            branch: "Branch XYZ",
            code: "A0000Z",
            address: "123 DEF City"
        };


        this.payment.bank.name = input;
        return this;
    }


    /**
    * Updates the Invoice's payment bank account number.
    * @param input - The new bank account number to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setPaymentBankAccountNumber(input: string): this {


        if (this.payment.method === InvoicePaymentMethod.CASH) {
            this.payment.bank = undefined;
            throw new Error("This payment method does not support bank information.");
        }

        if (!input || typeof input !== 'string' || input.trim() === "") {
            throw new Error("Bank Account Number must be a valid non-empty string.");
        }

        this.payment.bank ??= {
            name: "Bank ABC",
            accountNumber: "10000001",
            branch: "Branch XYZ",
            code: "A0000Z",
            address: "123 DEF City"
        };


        this.payment.bank.accountNumber = input;
        return this;
    }




    /**
    * Updates the Invoice's payment bank branch.
    * @param input - The new bank branch to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setPaymentBankBranch(input: string): this {


        if (this.payment.method === InvoicePaymentMethod.CASH) {
            this.payment.bank = undefined;
            throw new Error("This payment method does not support bank information.");
        }

        if (!input || typeof input !== 'string' || input.trim() === "") {
            throw new Error("Bank Branch must be a valid non-empty string.");
        }

        this.payment.bank ??= {
            name: "Bank ABC",
            accountNumber: "10000001",
            branch: "Branch XYZ",
            code: "A0000Z",
            address: "123 DEF City"
        };


        this.payment.bank.branch = input;
        return this;
    }





    /**
    * Updates the Invoice's payment bank code.
    * @param input - The new bank code to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setPaymentBankCode(input: string): this {


        if (this.payment.method === InvoicePaymentMethod.CASH) {
            this.payment.bank = undefined;
            throw new Error("This payment method does not support bank information.");
        }

        if (!input || typeof input !== 'string' || input.trim() === "") {
            throw new Error("Bank Code must be a valid non-empty string.");
        }

        this.payment.bank ??= {
            name: "Bank ABC",
            accountNumber: "10000001",
            branch: "Branch XYZ",
            code: "A0000Z",
            address: "123 DEF City"
        };


        this.payment.bank.code = input;
        return this;
    }



    /**
    * Updates the Invoice's payment bank address.
    * @param input - The new bank address to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setPaymentBankAddress(input: string): this {


        if (this.payment.method === InvoicePaymentMethod.CASH) {
            this.payment.bank = undefined;
            throw new Error("This payment method does not support bank information.");
        }

        if (!input || typeof input !== 'string' || input.trim() === "") {
            throw new Error("Bank Address must be a valid non-empty string.");
        }

        this.payment.bank ??= {
            name: "Bank ABC",
            accountNumber: "10000001",
            branch: "Branch XYZ",
            code: "A0000Z",
            address: "123 DEF City"
        };


        this.payment.bank.address = input;
        return this;
    }



    /**
    * Updates the Invoice's payment check number.
    * @param input - The new check number to set. Must be a non-empty string.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setPaymentCheckNumber(input: string): this {


        if (this.payment.method === InvoicePaymentMethod.CASH) {
            this.payment.check = undefined;
            throw new Error("This payment method does not support check information.");
        }


        if (!input || typeof input !== 'string' || input.trim() === "") {
            throw new Error("Check Number must be a valid non-empty string.");
        }

        this.payment.check ??= {
            number: "Bank ABC",
            date: new Date().toISOString()
        };


        this.payment.check.number = input;
        return this;
    }




    /**
    * Updates the Invoice's payment check date.
    * @param input - The new check date to set. Must be a non-empty string in ISO format.
    * @throws Will throw an error if the `input` is not provided or is not a string.
    */
    setPaymentCheckDate(input: string): this {


        if (this.payment.method === InvoicePaymentMethod.CASH) {
            this.payment.check = undefined;
            throw new Error("This payment method does not support check information.");
        }


        if (!input || typeof input !== 'string' || input.trim() === "") {
            throw new Error("Check Number must be a valid non-empty string.");
        }

        this.payment.check ??= {
            number: "Bank ABC",
            date: new Date().toISOString()
        };


        this.payment.check.date = input;
        return this;
    }


    /**
   * Updates the Invoice's payment reference number.
   * @param input - The new reference number to set. Must be a non-empty string.
   * @throws Will throw an error if the `input` is not provided or is not a string.
   */
    setPaymentReferenceNumber(input: string): this {

        if (this.payment.method === InvoicePaymentMethod.EWALLET || this.payment.method === InvoicePaymentMethod.BANK) {

            if (!input || typeof input !== 'string' || input.trim() === "") {
                this.payment.referenceNumber = undefined;
                throw new Error("Reference Number must be a valid non-empty string.");
            }

            this.payment.referenceNumber = input;
            return this;

        } else {
            this.payment.referenceNumber = undefined;
            throw new Error("This payment method does not support reference number.");
        }


    }



    /**
    * Sets or toggles whether the invoice is VAT-inclusive or VAT-exclusive.
    *
    * This method applies only to VAT-type invoices. Throws an error if used on non-VAT invoices.
    *
    * @param bool - Optional. If `true`, sets the invoice as VAT-inclusive.
    *                If `false`, sets it as VAT-exclusive.
    *                If omitted, the current VAT-inclusive state will be toggled.
    */
    toggleVATInclusive(bool?: boolean): this {


        if (this.metadata.type !== InvoiceVATType.VAT) {
            throw new Error("This invoice VAT type does not support this method.");
        }

        this.order.breakdown.vat.isVATInclusive = bool || !this.order.breakdown.vat.isVATInclusive;
        this.computeBreakdown();

        return this;
    }





    /**
    * Computes the invoice breakdown based on current order, discounts, taxes, and VAT type.
    */
    private computeBreakdown(): void {
        const isVAT = this.metadata.type === InvoiceVATType.VAT;
        const { orders } = this.order;
        const isVATInclusive = this.order.breakdown.vat.isVATInclusive;

        // If no items, zero everything out
        if (!orders || orders.length === 0) {
            this.order.breakdown = {
                totalSales: 0,
                netReceivable: 0,
                discount: { scPWD: 0, other: 0, totalDiscount: 0 },
                withholdingTax: { ...this.order.breakdown.withholdingTax, totalWithheldTax: 0 },
                totalAmountDue: 0,
                salesPT: 0,
                exemptSales: 0,
                vat: {
                    rate: isVAT ? defaultTaxRates.vat : 0,
                    isVATInclusive: isVATInclusive,
                    vatSubtype: VATSubType.STANDARD,
                    totalVAT: 0,
                    salesVATable: 0,
                    vatExemptSales: 0,
                    vatZeroRatedSales: 0,
                    totalSalesVATInclusive: 0
                },
                percentageTax: { rate: isVAT ? 0 : defaultTaxRates.percentageTax, totalPercentageTax: 0 }
            };
            return;
        }

        // Get and sum the total amount from the orders
        const totalSales = orders.reduce((acc, item) => acc + item.amount, 0);

        // Get the current discount object
        const discount = this.order.breakdown.discount || { scPWD: 0, other: 0, totalDiscount: 0 };


        // Get the total extra or added discount (aside from the senior citizen pwd discount)
        const otherDiscounts = discount.other;

        // Less the other discount to the total sales to get the net sales
        const netSales = totalSales - otherDiscounts;

        const vatRate = isVAT ? (this.order.breakdown.vat.rate || defaultTaxRates.vat) : 0;
        const vatMultiplier = 1 + vatRate;

        const vatSubtype = this.order.breakdown.vat.vatSubtype || VATSubType.STANDARD;


        if (this.isEligibleForScPwdDiscount()) {
            if (isVAT && isVATInclusive) {
                const baseAmount = netSales / (1 + vatRate);
                const scPWDDiscount = baseAmount * defaultSCPWDDiscount;
                discount.scPWD = scPWDDiscount;
            } else {
                // For VAT-exclusive or Non-VAT
                const scPWDDiscount = netSales * defaultSCPWDDiscount;
                discount.scPWD = scPWDDiscount;
            }
        }


        // Sum both the government mandated senior citizen/PWD discount and the user added discounts
        const totalDiscount = discount.scPWD + discount.other;
        // Store it as total discount
        discount.totalDiscount = totalDiscount;

        // Store the updated discount object as new discount
        this.order.breakdown.discount = discount;

        // Subtract the SC/PWD Discount from the net sales
        const salesLessScPwdDiscounts = netSales - discount.scPWD;

        // Withholding Tax
        const whtRate = this.order.breakdown.withholdingTax?.rate || 0;

        // Compute the total withheld tax based from the net sales and withtholding tax rate
        const totalWithheldTaxNonVAT = netSales * whtRate;

        // Percentage Tax
        const ptRate = this.order.breakdown.percentageTax?.rate || defaultTaxRates.percentageTax;

        // Compute the total percentage tax based from the net sales after subtracting sc pwd discount and percentage tax rate
        const totalPercentageTax = salesLessScPwdDiscounts * ptRate;

        // Compute the total net profit amount the issuer will receive after paying and subtracting all taxes
        const netReceivableNonVAT = netSales - totalWithheldTaxNonVAT - totalPercentageTax;

        const totalAmountPayableNonVAT = netSales - totalWithheldTaxNonVAT;


        if (!isVAT) {
            // Non-VAT breakdown
            this.order.breakdown = {
                totalSales: round(totalSales),
                discount: {
                    scPWD: round(discount.scPWD),
                    other: round(discount.other),
                    totalDiscount: round(discount.totalDiscount)
                },
                netReceivable: round(netReceivableNonVAT),
                withholdingTax: {
                    rate: whtRate,
                    totalWithheldTax: round(totalWithheldTaxNonVAT)
                },
                totalAmountDue: round(totalAmountPayableNonVAT),
                salesPT: discount.scPWD > 0 ? round(salesLessScPwdDiscounts) : round(netSales),
                exemptSales: 0,
                vat: {
                    rate: 0,
                    isVATInclusive: this.order.breakdown.vat.isVATInclusive,
                    vatSubtype: VATSubType.STANDARD,
                    totalVAT: 0,
                    salesVATable: 0,
                    vatExemptSales: 0,
                    vatZeroRatedSales: 0,
                    totalSalesVATInclusive: 0
                },
                percentageTax: {
                    rate: ptRate,
                    totalPercentageTax: round(totalPercentageTax)
                }
            };
        } else {
            // --- VAT COMPUTATION ---

            // Set default
            let salesVATable = 0;
            let vatExemptSales = 0;
            let vatZeroRatedSales = 0;
            let totalVAT = 0;
            let baseAmount = 0;

            const scPWDDiscount = discount.scPWD || 0;

            switch (vatSubtype) {
                case VATSubType.EXEMPT:
                    vatExemptSales = netSales;
                    break;
                case VATSubType.ZERO_RATED:
                    vatZeroRatedSales = netSales;
                    break;
                case VATSubType.STANDARD:
                default:
                    // STANDARD VAT
                    if (isVATInclusive) {
                        baseAmount = netSales / (vatMultiplier);
                        vatExemptSales = scPWDDiscount;
                        salesVATable = baseAmount - vatExemptSales;
                        totalVAT = salesVATable * vatRate;
                    } else {
                        baseAmount = netSales - scPWDDiscount;
                        salesVATable = baseAmount;
                        totalVAT = salesVATable * vatRate;
                    }
                    break;
            }

            const totalSalesVATInclusive = isVATInclusive ? netSales : salesVATable + totalVAT;

            // Compute withheld tax based from the base amount
            const totalWithheldTaxVAT = baseAmount * whtRate;

            // Compute the total net profit amount the issuer will receive after paying and subtracting all taxes
            const netReceivableVAT = baseAmount - totalWithheldTaxVAT;

            // Compute the total amount payable by the customer
            const totalAmountDuePayable = totalSalesVATInclusive - totalWithheldTaxVAT;

            this.order.breakdown = {
                totalSales: round(totalSales),
                discount: {
                    scPWD: round(discount.scPWD),
                    other: round(discount.other),
                    totalDiscount: round(discount.totalDiscount)
                },
                netReceivable: round(netReceivableVAT),
                withholdingTax: {
                    rate: whtRate,
                    totalWithheldTax: round(totalWithheldTaxVAT)
                },
                totalAmountDue: round(totalAmountDuePayable),
                salesPT: 0,
                exemptSales: 0, // Still reserved for non-VAT sales
                vat: {
                    rate: vatRate,
                    isVATInclusive: isVATInclusive,
                    vatSubtype: this.order.breakdown.vat.vatSubtype,
                    totalVAT: round(totalVAT),
                    salesVATable: round(salesVATable),
                    vatExemptSales: round(vatExemptSales),
                    vatZeroRatedSales: round(vatZeroRatedSales),
                    totalSalesVATInclusive: round(totalSalesVATInclusive)
                },
                percentageTax: {
                    rate: 0,
                    totalPercentageTax: 0
                }
            };


        }
    }


    /**
    * Returns the total net profit amount the issuer will receive after paying and subtracting all taxes
    */
    getNetReceivables(): number {

        const returnAmount = this.order.breakdown?.netReceivable ?? 0;
        return returnAmount;
    }



    /**
    * Returns true if the customer is eligible for a Senior Citizen/PWD Discount and a valid OSCA/PWD number is provided
    */
    private isEligibleForScPwdDiscount(): boolean {
        return !!this.customer?.oscaPWDNumber?.trim();
    }





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
    validateSelf(throwError: boolean = false): boolean {
        const requiredFields = [
            { field: this.id, name: "ID" },

            // Metadata
            { field: this.metadata?.formNumber, name: "Form Number" },
            { field: this.metadata?.rdo, name: "Revenue District Office Number" },
            { field: this.metadata?.invoiceNumber, name: "Invoice Number" },
            { field: this.metadata?.type, name: "Invoice Type" },

            //Customer
            { field: this.customer.name, name: "Customer's Name" },
            { field: this.customer.address, name: "Customer's Address" },
            { field: this.customer.businessName, name: "Customer's Business Name" },
            { field: this.customer.tin.toString(), name: "Customer's Registered TIN" },

            //Taxpayer
            { field: this.customer.name, name: "Taxpayer's Name" },
            { field: this.customer.address, name: "Taxpayer's Address" },
            { field: this.customer.businessName, name: "Taxpayer's Business Name" },
            { field: this.customer.tin.toString(), name: "Taxpayer's Registered TIN" },

            //Order
            { field: this.order.currency, name: "Currency" },
            { field: this.order.breakdown.totalAmountDue.toString(), name: "Total Amount Due" },
            { field: this.order.breakdown.totalSales.toString(), name: "Total Sales" },

            //Payment
            { field: this.payment.method, name: "Payment Method" }


        ];

        for (const { field, name } of requiredFields) {
            if (!field || field.trim() === "") {
                if (throwError) {
                    throw new Error(`Validation failed: Missing or invalid property - ${name}`);
                }
                return false;
            }
        }

        return true;
    }







    /**
    * Converts the current `DigitalInvoice` class to a plain JSON object and automatically generates an ID.
    * @returns {object} - A plain JSON object representation of the `DigitalInvoice` with an autogenerated ID.
    */
    finalize(): object {
        return {
            id: autogenerateID(this.metadata.invoiceNumber),
            metadata: this.metadata,
            customer: this.customer,
            issuer: this.issuer,
            order: this.order,
            payment: this.payment,
            timestamp: this.timestamp
        };
    }


    /**
    * Converts the current `DigitalInvoice` object to a plain JavaScript object (JSON).
    * @returns {object} - The plain object representation of the `DigitalInvoice` instance.
    */
    toJSON(): object {

        return {
            id: this.id,
            metadata: this.metadata,
            customer: this.customer,
            issuer: this.issuer,
            order: this.order,
            payment: this.payment,
            timestamp: this.timestamp
        };
    }


    /**
    * Static method to parse a JSON string or object into a `DigitalInvoice` instance.
    * 
    * @param json - A JSON string or plain object to be parsed.
    * @returns {DigitalInvoice} - A new `DigitalInvoice` instance based on the parsed JSON.
    * @throws Will throw an error if required properties are missing.
    */
    static parseFromJSON(json: string | object): DigitalInvoice {
        // If the input is a string, parse it as JSON
        const parsedData = typeof json === 'string' ? JSON.parse(json) : json;

        // Validate required properties
        if (!parsedData.id) {
            throw new Error("Missing required property: 'id'");
        }

        if (!parsedData.metadata) {
            throw new Error("Missing required property: 'metadata'");
        }

        if (!parsedData.customer) {
            throw new Error("Missing required property: 'customer'");
        }

        if (!parsedData.issuer) {
            throw new Error("Missing required property: 'issuer'");
        }

        if (!parsedData.order) {
            throw new Error("Missing required property: 'order'");
        }

        if (!parsedData.payment) {
            throw new Error("Missing required property: 'payment'");
        }



        // Create and return a new DigitalInvoice instance with the validated data
        return new DigitalInvoice(
            undefined,
            parsedData.metadata,
            parsedData.customer,
            parsedData.issuer,
            parsedData.order,
            parsedData.payment,
            parsedData?.timestamp
        );
    }







}

/**
 * Generates a unique ID based on a given input string and the current Unix timestamp.
 * Used as a fallback when no ID is provided for the invoice.
 *
 * @param input - Taxpayer name or any descriptive string to use in the ID.
 * @returns A unique string identifier in the format: invoice-[slug]-[timestamp]
 */
function autogenerateID(input: string): string {
    const unixTime = Math.floor(Date.now() / 1000);
    const titleText = input
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return `invoice-${titleText}-${unixTime}`;
}


const round = (num: number) => Math.round(num * 100) / 100;
