export interface GetDataQuotes {
    code:   number;
    status: string;
    quotes: Quotes;
}

export interface Quotes {
    current_page:   number;
    data:           Quote[];
    first_page_url: string;
    from:           number;
    last_page:      number;
    last_page_url:  string;
    links:          Link[];
    next_page_url:  null;
    path:           string;
    per_page:       number;
    prev_page_url:  null;
    to:             number;
    total:          number;
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
    client:      Client;
    services:    Service[];
    brand:       Brand;
    carmodel:    Carmodel;
}

export interface Brand {
    id:          number;
    name:        string;
    description: string;
    location:    string;
    contact:     number;
    picture:     string;
    created_at:  Date;
    updated_at:  Date;
}

export interface Carmodel {
    id:          number;
    name:        string;
    description: string;
    brand_id:    number;
    created_at:  Date;
    updated_at:  Date;
}

export interface Client {
    id:         number;
    phone1:     number;
    phone2:     null;
    curp:       null;
    points:     number;
    user_id:    number;
    source_id:  number;
    created_at: Date;
    updated_at: Date;
    user:       User;
}

export interface User {
    id:         number;
    name:       string;
    surname:    string;
    email:      string;
    picture:    null;
    gender:     string;
    created_at: Date;
    updated_at: Date;
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

export interface Link {
    url:    null | string;
    label:  string;
    active: boolean;
}
