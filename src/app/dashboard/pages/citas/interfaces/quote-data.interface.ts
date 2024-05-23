export interface QuoteData {
    status:  string;
    code:    string;
    message: string;
    quote:   Quote;
}

export interface Quote {
    type:        string;
    vin:         string;
    status:      string;
    quoteDate:   Date;
    client_id:   number;
    brand_id:    number;
    carmodel_id: number;
    updated_at:  Date;
    created_at:  Date;
    id:          number;
}
