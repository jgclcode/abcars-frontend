
export interface Financings {
    code:      number;
    status:    string;
    message?: string;
    financing: Financing;
}

export interface Financing {
    current_page:   number;
    data:           DataFinancing[];
    first_page_url: string;
    from:           number;
    last_page:      number;
    last_page_url:  string;
    links:          Link[];
    next_page_url:  string;
    path:           string;
    per_page:       number;
    prev_page_url:  null;
    to:             number;
    total:          number;
}

export interface DataFinancing {
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
    date_start:             string;
    date_end:               string;
    number_phone_company:   string;
    street_name_company:    string;
    suburb_company:         string;
    number_home_company:    string;
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
    ine_front:              string;
    ine_back:               string;
    client_id:              number;
    created_at:             string;
    updated_at:             string;
    client:                 Client;
    carmodel:               Carmodel;
    brand:                  Brand;
    state:                  State;
    references:             References[];
}

export interface Brand {
    id:          number;
    name:        string;
    description: string;
    location:    string;
    contact:     number;
    picture:     string;
    created_at:  string;
    updated_at:  string;
}

export interface State {
    id: string;
    iso: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface Carmodel {
    id:          number;
    name:        string;
    description: string;
    brand_id?:   number;
    created_at:  string;
    updated_at:  string;
    iso?:        string;
}

export interface Client {
    id:         number;
    phone1:     number;
    phone2:     number;
    curp:       string;
    points:     number;
    user_id:    number;
    source_id:  number;
    created_at: string;
    updated_at: string;
    user:       User;
}

export interface User {
    id:         number;
    name:       string;
    surname:    string;
    email:      string;
    picture:    null;
    gender:     string;
    created_at: string;
    updated_at: string;
}

export interface References {
    id: number;
    name: string;
    surname: string;
    phone: string;
    relationship: string;
    financing_id: number;
    created_at: string;
    updated_at: string;
}

export interface Link {
    url:    null | string;
    label:  string;
    active: boolean;
}

// Files Preview Encode
export interface FilesPreview {
    status:         string;
    code:           number;
    encode_picture: string;
}
