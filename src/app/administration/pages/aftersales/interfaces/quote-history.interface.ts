export interface QuoteHistory {
    code:   number;
    status: string;
    quotes: Quotes;
    clients?: Client[];
}

export interface Client {
    id:      number;
    name:    string;
    surname: string;
    email:   string;
    phone1:  number;
}

export interface Quotes {
    current_page:   number;
    data:           DataQuoteHistory[];
    first_page_url: string;
    from:           number;
    last_page:      number;
    last_page_url:  string;
    links:          Link[];
    next_page_url:  string;
    path:           string;
    per_page:       number;
    prev_page_url:  null;
    to:             number;
    total:          number;
}

export interface DataQuoteHistory {
    id:            number;
    type:          string;
    vin:           string;
    status:        string;
    quoteDate:     string;
    incomeService: null;
    admissionDate: null;
    incomeKM:      null;
    order:         null | string;
    client_id:     number;
    brand_id:      number;
    carmodel_id:   number;
    created_at:    string;
    updated_at:    string;
    brand:         Brand;
    carmodel:      Carmodel;
    services:      Service[];
}

export interface Brand {
    id:          number;
    name:        string;
    description: string;
    location:    string;
    contact:     number;
    picture:     string;
    created_at:  string;
    updated_at:  string;
}

export interface Carmodel {
    id:          number;
    name:        string;
    description: string;
    brand_id:    number;
    created_at:  string;
    updated_at:  string;
}

export interface Service {
    id:    number;
    name:  string;
    pivot: Pivot;
}

export interface Pivot {
    quote_id:   number;
    service_id: number;
}

export interface Link {
    url:    null | string;
    label:  string;
    active: boolean;
}

// Get Features by service_id
export interface GetFeatures {
    status:   string;
    code:     string;
    features: Feature[];
}

export interface Feature {
    id:         number;
    name:       string;
    service_id: number;
    created_at: string;
    updated_at: string;
}

export interface FeaturePost {
    status: string;
    code: string;
    message: string;
}

// GET Feautures by Quotes
export interface FeaturesByQuote {
    code:              number;
    status:            string;
    Service_responses: ServiceResponse[];
}

export interface ServiceResponse {
    id:                 number;
    status:             string;
    quote_id:           number;
    service_feature_id: number;
    created_at:         string;
    updated_at:         string;
    name:               string;
    service_id:         number;
}