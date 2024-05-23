export interface MechanicElectric {
    code:                  number;
    status:                string;
    Mechanical_electronic: MechanicalElectronic;
}

export interface MechanicalElectronic {
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
    meq1:             string;
    meq2:             string;
    meq3:             null;
    meq4:             null;
    meq5:             null;
    meq6:             null;
    meq7:             null;
    meq8:             null;
    meq9:             null;
    meq10:            null;
    meq11:            null;
    meq12:            null;
    meq13:            null;
    meq14:            null;
    meq15:            null;
    meq16:            null;
    meq17:            null;
    meq18:            null;
    meq19:            null;
    meq20:            null;
    meq21:            null;
    meq22:            null;
    meq23:            null;
    meq24:            null;
    meq25:            null;
    meq26:            null;
    meq27:            null;
    meq28:            null;
    meq29:            null;
    meq30:            null;
    meq31:            null;
    meq32:            null;
    meq33:            null;
    meq34:            null;
    meq35:            null;
    meq36:            null;
    meq37:            null;
    breakedd:         null;
    breakeid:         null;
    breakeit:         null;
    breakedt:         null;
    meq38:            null;
    meq39:            null;
    meq40:            null;
    depthdd:          null;
    depthid:          null;
    depthit:          null;
    depthdt:          null;
    meq41:            null;
    meq42:            null;
    meq43:            null;
    meq44:            null;
    meq45:            null;
    meq46:            null;
    meq47:            null;
    meq48:            null;
    meq49:            null;
    meq50:            null;
    meq51:            null;
    sell_your_car_id: number;
    created_at:       Date;
    updated_at:       Date;
}

export interface Link {
    url:    null | string;
    label:  string;
    active: boolean;
}
