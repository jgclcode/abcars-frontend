export interface GetProspectusToInsurancePolicies {
    code:    number;
    status:  string;
    clients: Client[];
}

export interface Client {
    id:                   number;
    name:                 string;
    surname:              string;
    email:                string;
    phone1:               number;
    choices_with_vehicle: ChoicesWithVehicle[];
    policies:             Policy[];
}

export interface ChoicesWithVehicle {
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
    vehicle:     Vehicle;
}

export interface Vehicle {
    id:              number;
    name:            string;
    description:     string;
    vin:             string;
    location:        string;
    yearModel:       number;
    purchaseDate:    Date;
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
    created_at:      Date;
    updated_at:      Date;
}

export interface Policy {
    id:              number;
    signature_date:  Date;
    signature_place: string;
    warranty_period: Date;
    id_warranty:     number;
    start_date_gm:   Date;
    start_date_ge:   Date;
    ending_date_gm:  Date;
    ending_date_ge:  Date;
    km_next_service: number;
    km_last_service: number;
    business:        string;
    buyer:           string;
    client_id:       number;
    vehicle_id:      number;
    created_at:      Date;
    updated_at:      Date;
}
