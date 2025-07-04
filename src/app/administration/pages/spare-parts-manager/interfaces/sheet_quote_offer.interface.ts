// Generated by https://quicktype.io

export interface SheetQuotesOffer {
    code:         number;
    status:       string;
    sheet_quotes: SheetQuotes;
}

export interface SheetQuotes {
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
    body:             string;
    brand:            string;
    model:            string;
    name:             string;
    surname:          string;
    // email:            string;
    phone:            number;
    buyType:          null;
    priceList:        number;
    vin:              string;
    clientPriceOffer: number;
    created_at:       string;
    updated_at:       string;
}

export interface Link {
    url:    null | string;
    label:  string;
    active: boolean;
}
