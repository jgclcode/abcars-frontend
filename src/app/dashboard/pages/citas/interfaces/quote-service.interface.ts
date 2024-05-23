export interface QuoteService {
    status:  string;
    code:    string;
    message: string;
    quote:   Quote;
}

export interface Quote {
    id:          number;
    type:        string;
    vin:         string;
    status:      string;
    quoteDate:   Date;
    client_id:   number;
    brand_id:    number;
    carmodel_id: number;
    created_at:  Date;
    updated_at:  Date;
    services:    Service[];
}

export interface Service {
    id:          number;
    name:        string;
    description: string;
    amount:      number;
    points:      number;
    interchange: number;
    created_at:  Date;
    updated_at:  Date;
    pivot:       Pivot;
}

export interface Pivot {
    quote_id:   number;
    service_id: number;
}
