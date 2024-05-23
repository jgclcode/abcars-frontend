// Get spare parts by sell your car
export interface GetSpareParts {
    code:        number;
    status:      string;
    distributor: Distributor[];
    spare_parts: SparePart[];
}

// Update Spare Part
export interface UpdateSparePart {
    status:     string;
    code:       string;
    message:    string;
    spare_part: SparePart;
}

export interface SparePart {
    id:               number;
    name:             string;
    amount:           number;
    hours:            number;    
    status:           string;
    type_part:        null | string;
    priceOriginal:    number;
    priceGeneric:     number;
    priceUsed:        number;
    timeOriginal:     null;
    timeGeneric:      null;
    timeUsed:         null;
    comments:         null | string;
    sell_your_car_id: number;
    created_at:       string;
    updated_at:       string;
}

// Painting Works
export interface PaintingWorks {
    code:           number;
    status:         string;
    painting_works: PaintingWork[];
}

export interface PaintingWork {
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

export interface UpdatePaintingWork {
    status:  string;
    code:    string;
    message: string;
}

export interface Distributor {
    distributor: string;
}

export interface StatusCount {
    code:            number;
    status:          string;
    count_total:     number;
    count_standBy:   number;
    count_to_valued: number;
    count_valued:    number;
}