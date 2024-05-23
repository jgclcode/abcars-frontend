export interface BrandData {
    code:   number;
    status: string;
    brands: Brands;
}

export interface Brands {
    current_page:   number;
    data:           Brand[];
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

export interface Brand {
    id:          number;
    name:        string;
    description: null | string;
    location:    null | string;
    contact:     number | null;
    picture:     null | string;
    created_at:  Date;
    updated_at:  Date;
}

export interface Link {
    url:    null | string;
    label:  string;
    active: boolean;
}
