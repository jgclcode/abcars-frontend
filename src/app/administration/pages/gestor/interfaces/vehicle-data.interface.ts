export interface VehicleData {
    code:     number;
    status:   string;
    vehicles: Vehicles;
}

export interface Vehicles {
    current_page:   number;
    data:           Vehicle[];
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

export interface Vehicle {
    id:              number;
    name:            string;
    description:     string;
    vin:             string;
    location:        Location;
    yearModel:       number;
    purchaseDate:    Date;
    price:           number;
    priceList:       number;
    salePrice:       number;
    type:            Type;
    carline:         string;
    cylinders:       number;
    colorInt:        string;
    colorExt:        string;
    status:          Status;
    plates:          string;
    transmission:    Transmission;
    inventoryDays:   number;
    km:              number;
    numKeys:         number;
    studs:           Extinguiser;
    spareTire:       Extinguiser;
    hydraulicJack:   Extinguiser;
    extinguiser:     Extinguiser;
    reflectives:     Extinguiser;
    handbook:        Extinguiser;
    insurancePolicy: Extinguiser;
    powerCables:     Extinguiser;
    promotion:       string;
    carmodel_id:     number;
    vehiclebody_id:  number;
    branch_id:       number;
    fb_id:           number;
    mercado_id:      number | null;
    client_id:       number | null;
    created_at:      Date;
    updated_at:      Date;
    vehicle_images:  VehicleImage[];
    choices:         Choice[];
}

export interface Choice {
    id:          number;
    amount:      number;
    namePayment: string;
    status:      string;
    reference:   string;
    amountDate:  string;
    vehicle_id:  number;
    client_id:   number;
    rewards:     string;
    created_at:  Date;
    updated_at:  Date;
}

export enum Extinguiser {
    No = "no",
}

export enum Location {
    NoTiene = "no tiene",
}

export enum Status {
    Active = "active",
}

export enum Transmission {
    Automatico = "automatico",
    Manual = "manual",
}

export enum Type {
    PreOwned = "pre_owned",
}

export interface VehicleImage {
    id:               number;
    path:             string;
    external_website: ExternalWebsite;
    vehicle_id:       number;
    created_at:       Date;
    updated_at:       Date;
}

export enum ExternalWebsite {
    Yes = "yes",
}

export interface Link {
    url:    null | string;
    label:  string;
    active: boolean;
}
