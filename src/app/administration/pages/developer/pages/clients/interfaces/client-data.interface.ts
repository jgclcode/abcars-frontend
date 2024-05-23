export interface ClientData {
    code:   number;
    status: string;
    clients: Clients;
}

export interface Clients {
    current_page:   number;
    data:           Client[];
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

export interface Client {
    id:         number;
    phone1:     number;
    phone2:     number;
    curp:       string;
    points:     number;
    user_id:    number;
    source_id:  number;
    created_at: Date;
    updated_at: Date;
}

export interface Link {
    url:    null | string;
    label:  string;
    active: boolean;
}
