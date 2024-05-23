export interface GetChecklistForms {
    status:        string;
    code:          string;
    revExt:        RevEXT;
    revInt:        RevInt;
    mecElec:       MecElec;
    cert:          CERT;
    tecval:        User;
    valuator:      User;
    checklist:     Checklist;
}

export interface Checklist {
    id:                number;
    distributor:       string;
    valuation_date:    Date;
    warranty_manual:   null;
    direct_purchase:   null;
    take_into_account: null;
    valid_warranty:    null;
    color:             string;
    cilindres:         string;
    plates:            string;
    origin_country:    string;
    transmission:      string;
    engine_suction:    string;
    start_stop:        string;
    take:              number;
    sale:              number;
    workforce:         number;
    spare_parts:       number;
    hyp:               number;
    total:             number;
    take_value:        number;
    final_offer:       number;
    comments:          string;
    name_technical:    null;
    firm_technical:    null;
    name_manager:      null;
    firm_manager:      null;
    name_appraiser:    null;
    firm_appraiser:    null;
    status:            string;
    preparation:       string;
    user_id:           number;
    technician_id:     number;
    sell_your_car_id:  number;
    created_at:        Date;
    updated_at:        Date;
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

export interface UserTechnician {
    id:         number;
    user_id:    number;
    created_at: Date;
    updated_at: Date;
    user:       User;
}

export interface CERT {
    id:               number;
    cvq1:             string;
    cvq2:             string;
    cvq3:             string;
    cvq4:             string;
    cvq5:             string;
    cvq6:             string;
    cvq7:             string;
    cvq8:             string;
    cvq9:             string;
    cvq11:            string;
    cvq12:            string;
    sell_your_car_id: number;
    created_at:       Date;
    updated_at:       Date;
}

export interface MecElec {
    id:               number;
    meq1:             string;
    meq2:             string;
    meq3:             string;
    meq4:             string;
    meq5:             string;
    meq6:             string;
    meq7:             string;
    meq8:             string;
    meq9:             string;
    meq10:            string;
    meq11:            string;
    meq12:            string;
    meq13:            string;
    meq14:            string;
    meq15:            string;
    meq16:            string;
    meq17:            string;
    meq18:            string;
    meq19:            string;
    meq20:            string;
    meq21:            string;
    meq22:            string;
    meq23:            string;
    meq24:            string;
    meq25:            string;
    meq26:            string;
    meq27:            string;
    meq28:            string;
    meq29:            string;
    meq30:            string;
    meq31:            string;
    meq32:            string;
    meq33:            string;
    meq34:            string;
    meq35:            string;
    meq36:            string;
    meq37:            string;
    breakedd:         number;
    breakeid:         number;
    breakeit:         number;
    breakedt:         number;
    meq38:            string;
    meq39:            string;
    meq40:            string;
    depthdd:          number;
    depthid:          number;
    depthit:          number;
    depthdt:          number;
    meq41:            string;
    meq42:            string;
    meq43:            string;
    meq44:            string;
    meq45:            string;
    meq46:            string;
    meq47:            string;
    meq48:            string;
    meq49:            string;
    meq50:            string;
    meq51:            string;
    sell_your_car_id: number;
    created_at:       Date;
    updated_at:       Date;
}

export interface RevEXT {
    id:               number;
    req1:             string;
    req2:             string;
    req3:             string;
    req4:             string;
    req5:             string;
    req6:             string;
    req7:             string;
    req8:             string;
    req9:             string;
    req10:            string;
    req11:            string;
    req12:            string;
    req13:            string;
    req14:            string;
    req15:            string;
    req16:            string;
    req17:            string;
    req18:            string;
    req19:            string;
    req20:            string;
    req21:            string;
    req22:            string;
    sell_your_car_id: number;
    created_at:       Date;
    updated_at:       Date;
}

export interface RevInt {
    id:               number;
    iq1:              string;
    iq2:              string;
    iq3:              string;
    iq4:              string;
    iq5:              string;
    iq6:              string;
    iq7:              string;
    iq8:              string;
    iq9:              string;
    iq10:             string;
    iq11:             string;
    iq12:             string;
    iq13:             string;
    iq14:             string;
    iq15:             string;
    iq16:             string;
    iq17:             string;
    sell_your_car_id: number;
    created_at:       Date;
    updated_at:       Date;
}