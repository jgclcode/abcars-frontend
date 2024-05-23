export interface ServicesData {
    code:    number;
    status:  string;
    service: Data;
}

export interface Data {
    current_page:   number;
    data:           Service[];
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

export interface Service {
    id:          number;
    name:        string;
    description: string;
    amount:      number;
    points:      number;
    interchange: number;
    created_at:  Date;
    updated_at:  Date;
}

export interface Link {
    url:    null | string;
    label:  string;
    active: boolean;
}
