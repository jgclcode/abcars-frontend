export interface IntReview {
    code:            number;
    status:          string;
    Interior_review: InteriorReview;
}

export interface InteriorReview {
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
    iq1:              string;
    iq2:              string;
    iq3:              null;
    iq4:              null;
    iq5:              null;
    iq6:              null;
    iq7:              null;
    iq8:              null;
    iq9:              null;
    iq10:             null;
    iq11:             null;
    iq12:             null;
    iq13:             null;
    iq14:             null;
    iq15:             null;
    iq16:             null;
    iq17:             null;
    sell_your_car_id: number;
    created_at:       Date;
    updated_at:       Date;
}

export interface Link {
    url:    null | string;
    label:  string;
    active: boolean;
}
