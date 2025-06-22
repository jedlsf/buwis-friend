import { BIRMetadata, PercentageTaxMetadata, VATMetadata } from "./business-invoice";
/**
 * Represents a legal entity such as a business or individual
 */
export interface LegalEntity {
    /**
     * Registered name of the entity
     */
    name: string;
    /**
     * Taxpayer Identification Number (TIN)
     */
    tin: string;
    /**
     * Business or mailing address
     */
    address: string;
    /**
     * Registered business name
     */
    businessName: string;
    /**
    * Contact number
    */
    contactNumber?: string | null;
    /**
    * Business or personal email address
    */
    emailAddress?: string | null;
    /**
    * Business or personal website URL
    */
    website?: string | null;
    /**
     * Optional OSCA/PWD number for senior citizens or persons with disabilities
     * (used for applicable government discounts)
     */
    oscaPWDNumber?: string | null;
}
export interface TaxpayerInfo {
    issuer: LegalEntity;
    metadata: BIRMetadata;
    tax: {
        percentageTax: PercentageTaxMetadata;
        vat: VATMetadata;
    };
}
