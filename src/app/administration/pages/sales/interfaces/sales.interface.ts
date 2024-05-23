export interface Choices {
    code:   number;
    status: string;
    Choice: Choice;
}

export interface Choice {
    current_page:   number;
    data:           DataChoices[];
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

export interface DataChoices {
    id:               number;
    amount:           number;
    namePayment:      string;
    status:           string;
    reference:        string;
    amountDate:       string;
    vehicle_id:       number;
    client_id:        number;
    created_at:       string;
    updated_at:       string;
    vehicle:          Vehicle;
    client_with_user: ClientWithUser;
}

export interface ClientWithUser {
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

export interface Vehicle {
    id:              number;
    name:            string;
    description:     string;
    vin:             string;
    location:        string;
    yearModel:       number;
    purchaseDate:    string;
    price:           number;
    priceList:       number;
    salePrice:       number;
    type:            string;
    carline:         string;
    cylinders:       number;
    colorInt:        string;
    colorExt:        string;
    status:          string;
    plates:          string;
    transmission:    string;
    inventoryDays:   number;
    km:              number;
    numKeys:         number;
    studs:           string;
    spareTire:       string;
    hydraulicJack:   string;
    extinguiser:     string;
    reflectives:     string;
    handbook:        string;
    insurancePolicy: string;
    powerCables:     string;
    promotion:       null;
    carmodel_id:     number;
    vehiclebody_id:  number;
    branch_id:       number;
    client_id:       number;
    created_at:      string;
    updated_at:      string;
}

export interface Link {
    url:    null | string;
    label:  string;
    active: boolean;
}
