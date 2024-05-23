export interface SellYourCar {
    code:          number;
    status:        string;
    sell_your_car: SellYourCards;
}

export interface SellYourCards {
    current_page:   number;
    data:           DataSellYourCar[];
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

export interface DataSellYourCar {
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
    check_list:  CheckList;
    client_sale: ClientSale;
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

export interface CheckList {
    id:                number;
    distributor:       string;
    valuation_date:    Date;
    warranty_manual:   string;
    direct_purchase:   string;
    take_into_account: string;
    valid_warranty:    string;
    color:             string;
    cilindres:         string;
    plates:            string;
    req1:              string;
    req2:              string;
    req3:              string;
    req4:              string;
    req5:              string;
    req6:              string;
    req7:              string;
    req8:              string;
    req9:              string;
    req10:             string;
    req11:             string;
    req12:             string;
    req13:             string;
    req14:             string;
    req15:             string;
    req16:             string;
    req17:             string;
    req18:             string;
    req19:             string;
    req20:             string;
    req21:             string;
    req22:             string;
    iq1:               string;
    iq2:               string;
    iq3:               string;
    iq4:               string;
    iq5:               string;
    iq6:               string;
    iq7:               string;
    iq8:               string;
    iq9:               string;
    iq10:              string;
    iq11:              string;
    iq12:              string;
    iq13:              string;
    iq14:              string;
    iq15:              string;
    iq16:              string;
    iq17:              string;
    meq1:              string;
    meq2:              string;
    meq3:              string;
    meq4:              string;
    meq5:              string;
    meq6:              string;
    meq7:              string;
    meq8:              string;
    meq9:              string;
    meq10:             string;
    meq11:             string;
    meq12:             string;
    meq13:             string;
    meq14:             string;
    meq15:             string;
    meq16:             string;
    meq17:             string;
    meq18:             string;
    meq19:             string;
    meq20:             string;
    meq21:             string;
    meq22:             string;
    meq23:             string;
    meq24:             string;
    meq25:             string;
    meq26:             string;
    meq27:             string;
    meq28:             string;
    meq29:             string;
    meq30:             string;
    meq31:             string;
    meq32:             string;
    meq33:             string;
    meq34:             string;
    meq35:             string;
    meq36:             string;
    meq37:             string;
    breakedd:          number;
    breakeid:          number;
    breakeit:          number;
    breakedt:          number;
    meq38:             string;
    meq39:             string;
    meq40:             string;
    depthdd:           number;
    depthid:           number;
    depthit:           number;
    depthdt:           number;
    meq41:             string;
    meq42:             string;
    meq43:             string;
    meq44:             string;
    meq45:             string;
    meq46:             string;
    meq47:             string;
    meq48:             string;
    meq49:             string;
    meq50:             string;
    meq51:             string;
    cvq1:              string;
    cvq2:              string;
    cvq3:              string;
    cvq4:              string;
    cvq5:              string;
    cvq6:              string;
    cvq7:              string;
    cvq8:              string;
    cvq9:              string;
    cvq11:             string;
    cvq12:             string;
    take:              number;
    sale:              number;
    workforce:         number;
    spare_parts:       number;
    hyp:               number;
    total:             number;
    take_value:        number;
    final_offer:       number;
    comments:          string;
    name_technical:    string;
    firm_technical:    null;
    name_manager:      string;
    firm_manager:      null;
    name_appraiser:    string;
    firm_appraiser:    null;
    status:            string;
    preparation:       null;
    sell_your_car_id:  number;
    created_at:        Date;
    updated_at:        Date;
}

export interface ClientSale {
    id:         number;
    phone1:     number;
    phone2:     null;
    curp:       null;
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
