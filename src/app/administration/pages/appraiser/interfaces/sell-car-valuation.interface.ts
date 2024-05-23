export interface SellCarValuation {
    code:                  number;
    status:                string;
    sell_car_valuation_id: SellCarValuationID;
}

export interface SellCarValuationID {
    id:          number;
    version:     string;
    km:          number;
    year:        number;
    date:        Date;
    vin:         string;
    status:      string;
    brand_id:    number;
    carmodel_id: number;
    client_id:   number;
    created_at:  Date;
    updated_at:  Date;
    brand:       Brand;
    carmodel:    Carmodel;
    client_sale: ClientSale;
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

export interface ClientSale {
    id:         number;
    phone1:     number;
    phone2:     null;
    curp:       null;
    points:     number;
    user_id:    number;
    source_id:  number;
    created_at: Date;
    updated_at: Date;
    user:       User;
}

export interface User {
    id:         number;
    name:       string;
    surname:    string;
    email:      string;
    picture:    null;
    gender:     string;
    created_at: Date;
    updated_at: Date;
}
