export interface State {
    code:   number;
    status: string;
    states: StateElement[];
}

export interface StateElement {
    id:          number;
    iso:         string;
    name:        string;
    description: string;
    created_at:  Date;
    updated_at:  Date;
}

// Financing interface
export interface Financing {
    status:    string;
    code:      number;
    message:   string;
    financing: FinancingItem;
}

export interface FinancingItem {
    id: number;
    status: string;
    price: number;
    hitch: number;
    year: number;
    brand_id: number;
    carmodel_id: number;
    rfc: string;
    civil_status: string;
    studies_level: string;
    economic_dependents: number;
    has_vehicle: string;
    street_name: string;
    suburb: string;
    number: string;
    postal_code: string;
    municipality: string;
    company: string;
    salary: string;
    role: string;
    time: string;
    state_id: number;
    client_id: number;
    updated_at: string;
    created_at: string;
    lastname: string;
    mothername: string;
    monthly_fees: number;
    employment_situation: string;
    date_start: string;
    date_end: string;
    number_phone_company: string;
    street_name_company: string;
    suburb_company: string;
    number_home_company: string;
    postal_code_company: string;
    state_company: string;
    municipality_company: string;
    street_name_reference: string;
    suburb_reference: string;
    number_reference: string;
    postal_code_reference: string;
    state_reference: string;
    municipality_reference: string;
    credit_card: string;
    numbers_card: string;
    mortgage_credit: string;
    automotive_credit: string;
    third_person: string;
    useragent: string;
    ine_front: string;
    ine_back: string;
    address_proof: string;
}

// Interface Reference
export interface Reference {
    status:    string;
    code:      string;
    message:   string;
    reference: ReferenceItem;
}

export interface ReferenceItem {
    name:         string;
    surname:      string;
    phone:        string;
    relationship: string;
    financing_id: number;
    updated_at:   string;
    created_at:   string;
    id:           number;
}

export interface UploadFilesFinancing {
    code: string;
    status: string;
    message: string;
}

