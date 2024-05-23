export interface SearchFinancing {
    code:       number;
    status:     string;
    financings: Financings;
}

export interface Financings {
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
    id:                     number;
    lastname:               string;
    mothername:             string;
    status:                 string;
    price:                  number;
    hitch:                  number;
    year:                   string;
    brand_id:               number;
    carmodel_id:            number;
    monthly_fees:           number;
    rfc:                    string;
    civil_status:           string;
    studies_level:          string;
    economic_dependents:    number;
    has_vehicle:            string;
    street_name:            string;
    suburb:                 string;
    number:                 string;
    postal_code:            string;
    state_id:               number;
    municipality:           string;
    company:                string;
    employment_situation:   string;
    salary:                 number;
    role:                   string;
    date_start:             Date;
    date_end:               Date | null;
    number_phone_company:   string;
    street_name_company:    string;
    suburb_company:         string;
    number_home_company:    null | string;
    postal_code_company:    string;
    state_company:          string;
    municipality_company:   string;
    street_name_reference:  string;
    suburb_reference:       string;
    number_reference:       string;
    postal_code_reference:  string;
    state_reference:        string;
    municipality_reference: string;
    credit_card:            string;
    numbers_card:           string;
    mortgage_credit:        string;
    automotive_credit:      string;
    third_person:           string;
    ine_front:              null | string;
    ine_back:               null | string;
    client_id:              number;
    created_at:             Date;
    updated_at:             Date;
    carmodel:               Carmodel;
    brand:                  Brand;
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

export interface Link {
    url:    null | string;
    label:  string;
    active: boolean;
}


// export interface SearchFinancing {
//     code:       number;
//     status:     string;
//     financings: Financing[];
// }

// export interface Financing {
//     id:                     number;
//     lastname:               string;
//     mothername:             string;
//     status:                 string;
//     price:                  number;
//     hitch:                  number;
//     year:                   string;
//     brand_id:               number;
//     carmodel_id:            number;
//     monthly_fees:           number;
//     rfc:                    string;
//     civil_status:           string;
//     studies_level:          string;
//     economic_dependents:    number;
//     has_vehicle:            string;
//     street_name:            string;
//     suburb:                 string;
//     number:                 string;
//     postal_code:            string;
//     state_id:               number;
//     municipality:           string;
//     company:                string;
//     employment_situation:   string;
//     salary:                 number;
//     role:                   string;
//     date_start:             Date;
//     date_end:               null;
//     number_phone_company:   string;
//     street_name_company:    string;
//     suburb_company:         string;
//     number_home_company:    string;
//     postal_code_company:    string;
//     state_company:          string;
//     municipality_company:   string;
//     street_name_reference:  string;
//     suburb_reference:       string;
//     number_reference:       string;
//     postal_code_reference:  string;
//     state_reference:        string;
//     municipality_reference: string;
//     credit_card:            string;
//     numbers_card:           string;
//     mortgage_credit:        string;
//     automotive_credit:      string;
//     third_person:           string;
//     ine_front:              string;
//     ine_back:               string;
//     client_id:              number;
//     created_at:             Date;
//     updated_at:             Date;
//     carmodel:               Carmodel;
//     brand:                  Brand;
// }

// export interface Brand {
//     id:          number;
//     name:        string;
//     description: string;
//     location:    string;
//     contact:     number;
//     picture:     string;
//     created_at:  Date;
//     updated_at:  Date;
// }

// export interface Carmodel {
//     id:          number;
//     name:        string;
//     description: string;
//     brand_id:    number;
//     created_at:  Date;
//     updated_at:  Date;
// }
