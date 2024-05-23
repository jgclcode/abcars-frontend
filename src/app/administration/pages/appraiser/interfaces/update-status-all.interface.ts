export interface UpdateStatusAll {
    status:    string;
    code:      string;
    message:   string;
    checklist: Checklist;
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
