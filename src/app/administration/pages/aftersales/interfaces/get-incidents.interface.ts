export interface GetIncidents {
    code:      number;
    status:    string;
    incidents: Incidents;
}

export interface Incidents {
    current_page:   number;
    data:           Incident[];
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

export interface Incident {
    id:          number;
    name:        string;
    description: string;
    status:      string;
    client_id:   number;
    service_id:  number;
    created_at:  Date;
    updated_at:  Date;
    client:      Client;
    service:     Service;
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
}

export interface Link {
    url:    null | string;
    label:  string;
    active: boolean;
}
