
// Get Carmodels
export interface ModelsInterface {
    code:     number;
    status:   string;
    carmodel: Carmodels;
}

export interface Carmodels {
    current_page:   number;
    data:           Carmodel[];
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

export interface Carmodel {
    id:          number;
    name:        string;
    description: string;
    brand_id:    number;
    created_at:  string;
    updated_at:  string;
    brand:       Brand;
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

export interface Link {
    url:    null | string;
    label:  string;
    active: boolean;
}

// Create Carmodel
export interface CarmodelCreate {
    status:  string;
    code:    string;
    message: string;
}

// Update Carmodel
export interface CarmodelUpdate {
    status:  string;
    code:    string;
    message: string;
}

// Get Carmodel
export interface GetCarmodel {
    status:  string;
    code:    number;
    carmodel: Carmodel;
}

// Delete Carmodel
export interface CarmodelDelete {
    status:  string;
    code:    string;
    message: string;
}
