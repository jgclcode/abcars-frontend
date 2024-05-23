export interface QuoteUpdate {
    status:  string;
    code:    string;
    message: string;
}

// GET Clients for params email and phone
export interface ClientsQuoteService {
    code:    number;
    status:  string;
    clients?: Client[];
    quotes?: Quote[];
}

export interface Client {
    id:      number;
    name:    string;
    surname: string;
    email:   string;
    phone1:  number;
}

export interface Quote {    
    id: number;
    type: string;
    vin: string;
    status: string;
    quoteDate: string;
    client_id: number;
    brand_id: number;
    carmodel_id: number;
    created_at: string;
    updated_at: string;
    brand:       Brand;
    carmodel:    Carmodel;
    services:    Service[];
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
    name: string;
    pivot: Pivot;
}

export interface Pivot {
    quote_id:   number;
    service_id: number;
}