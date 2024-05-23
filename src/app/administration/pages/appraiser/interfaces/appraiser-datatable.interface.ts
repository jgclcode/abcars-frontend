//
// Interface for Valuations in Data Table
//

export interface SellYourCarValuations {
    code:          number;
    status:        string;
    sell_your_car: SellYourCar;
}

export interface SellYourCar {
    current_page:   number;
    data:           SellYourCarData[];
    first_page_url: string;
    from:           number;
    last_page:      number;
    last_page_url:  string;
    links:          Link[];
    next_page_url:  null;
    path:           string;
    per_page:       number;
    prev_page_url:  string;
    to:             number;
    total:          number;
}

export interface SellYourCarData {
    id:          number;
    version:     string;
    km:          number;
    year:        number;
    vin:         string;
    status:      string;
    brand_id:    number;
    carmodel_id: number;
    client_id:   number;
    created_at:  string;
    updated_at:  string;
    brand:       Brand;
    carmodel:    Carmodel;
    check_list:  null;
    client_sale: ClientSale;
    spare_parts: SparePart[];
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

export interface ClientSale {
    id:         number;
    phone1:     number;
    phone2:     null;
    curp:       null;
    points:     number;
    rewards:    string;
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

export interface SparePart {
    id:               number;
    name:             string;
    amount:           number;
    hours:            number;
    status:           string;
    type_part:        null;
    priceOriginal:    number;
    timeOriginal:     null;
    priceGeneric:     number;
    timeGeneric:      null;
    priceUsed:        number;
    timeUsed:         null;
    comments:         null;
    sell_your_car_id: number;
    created_at:       string;
    updated_at:       string;
}

export interface Link {
    url:    null | string;
    label:  string;
    active: boolean;
}
