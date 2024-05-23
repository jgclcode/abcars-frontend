export interface CertificationVeh {
    code:          number;
    status:        string;
    Certification: Certification;
}

export interface Certification {
    current_page:   number;
    data:           Datum[];
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

export interface Datum {
    id:               number;
    cvq1:             string;
    cvq2:             string;
    cvq3:             null;
    cvq4:             null;
    cvq5:             null;
    cvq6:             null;
    cvq7:             null;
    cvq8:             null;
    cvq9:             null;
    cvq11:            null;
    cvq12:            null;
    sell_your_car_id: number;
    created_at:       Date;
    updated_at:       Date;
}

export interface Link {
    url:    null | string;
    label:  string;
    active: boolean;
}
