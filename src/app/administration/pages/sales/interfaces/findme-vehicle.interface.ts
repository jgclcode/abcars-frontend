export interface FindmeVehicle {
    code:    number;
    status:  string;
    request: Request;
}

export interface Request {
    current_page:   number;
    data:           DataFindmeVehicle[];
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

export interface DataFindmeVehicle {
    id:            number;
    status:        string;
    year:          number;
    comment:       Comment;
    transmission:  string;
    release:       string;
    type_purchase: string;
    mileage:       number;
    amount_pay:    number;
    version:       string;
    carmodel_id:   number;
    brand_id:      number;
    client_id:     number;
    created_at:    string;
    updated_at:    string;
    carmodel:      Carmodel;
    brand:         Brand;
    client:        Client;
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

export interface Carmodel {
    id:          number;
    name:        string;
    description: string;
    brand_id:    number;
    created_at:  string;
    updated_at:  string;
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
export interface Link {
    url:    null | string;
    label:  string;
    active: boolean;
}

// Update Findme Vehicle
export interface UpdateFindmeVehicle {
    status:  string;
    code:    string;
    message: string;
    request: UpdateRequest;
}

export interface UpdateRequest {
    id:            number;
    status:        string;
    year:          string;
    comment:       string;
    transmission:  string;
    release:       string;
    type_purchase: string;
    mileage:       string;
    amount_pay:    string;
    version:       string;
    carmodel_id:   number;
    brand_id:      number;
    client_id:     number;
    created_at:    string;
    updated_at:    string;
}
