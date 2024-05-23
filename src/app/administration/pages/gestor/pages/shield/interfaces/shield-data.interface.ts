export interface ShieldData {
    code:    number;
    status:  string;
    shields: Shields;
}

export interface Shields {
    current_page:   number;
    data:           Shield[];
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

export interface Shield {
    id:         number;
    name:       string;
    path:       string;
    created_at: Date;
    updated_at: Date;
}

export interface Link {
    url:    null | string;
    label:  string;
    active: boolean;
}
