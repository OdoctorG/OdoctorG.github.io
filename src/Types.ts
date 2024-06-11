export interface ListTransactionsResponse {
    nextPageToken: string;
    transactions: Transaction[];
}

export interface Transaction {
    accountId: string;
    amount: CurrencyDenominatedAmount;
    bookedDateTime?: string; // Optional
    categories?: Categories; // Optional (Disabled for new apps)
    counterparties?: Counterparties; // Optional
    dates?: Dates; // Optional
    descriptions?: Descriptions; // Optional
    id: string;
    identifiers?: Identifiers; // Optional
    merchantInformation?: MerchantInformation; // Optional
    providerMutability: Mutability;
    reference?: string; // Optional
    status: Status;
    transactionDateTime?: string; // Optional
    types: Types;
    valueDateTime?: string; // Optional
}

export interface CurrencyDenominatedAmount {
    currencyCode: string;
    value: ExactNumber;
}

export interface ExactNumber {
    scale: string;
    unscaledValue: string;
}

export interface Categories {
    pfm: PFMCategory;
}

export interface PFMCategory {
    id: string;
    name: string;
}

export interface Counterparties {
    payee?: CounterpartyInformation; // Optional
    payer?: CounterpartyInformation; // Optional
}

export interface CounterpartyInformation {
    identifiers?: Identifiers; // Optional
    name?: string; // Optional
}

export interface Identifiers {
    financialInstitution?: FinancialInstitution; // Optional
    providerTransactionId?: string; // Optional
}

export interface FinancialInstitution {
    accountNumber?: string; // Optional
}

export interface Dates {
    booked?: string; // Optional
    transaction?: string; // Optional
    value?: string; // Optional
}

export interface Descriptions {
    detailed?: TransactionInformation; // Optional
    display: string;
    original: string;
}

export interface TransactionInformation {
    unstructured: string;
}

export interface MerchantInformation {
    merchantCategoryCode: string;
    merchantName: string;
}

export enum Mutability {
    MUTABILITY_UNDEFINED = "MUTABILITY_UNDEFINED",
    MUTABLE = "MUTABLE",
    IMMUTABLE = "IMMUTABLE",
}

export enum Status {
    UNDEFINED = "UNDEFINED",
    PENDING = "PENDING",
    BOOKED = "BOOKED",
}

export interface Types {
    financialInstitutionTypeCode: string;
    type: string;
}

export type ListCategoriesResponse = Category[]

export interface Category {
    code: string;
    defaultChild: boolean;
    id: string;
    parent?: string; //optional
    primaryName?: string; //optional
    searchTerms?: string; //optional
    secondaryName?: string; //optional
    sortOrder: number;
    type: string;
    typeName: string;
}