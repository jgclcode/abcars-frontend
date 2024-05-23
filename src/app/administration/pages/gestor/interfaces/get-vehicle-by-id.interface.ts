export interface GetVehicleByID {
    code:    number;
    status:  string;
    vehicle: Vehicle;
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
    carmodel:        Carmodel;
    client:          Client;
    vehiclebody:     Vehiclebody;
    branch:          Branch;
    vehicle_images:  any[];
}

export interface Branch {
    id:         number;
    name:       string;
    state_id:   number;
    created_at: Date;
    updated_at: Date;
    state:      Vehiclebody;
}

export interface Vehiclebody {
    id:          number;
    iso?:        string;
    name:        string;
    description: null | string;
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
    brand:       Brand;
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

export interface Client {
    id:           number;
    phone1:       number;
    phone2:       number;
    curp:         string;
    points:       number;
    rewards:      string;
    address:      null;
    municipality: null;
    state:        null;
    cp:           null;
    rfc:          null;
    user_id:      number;
    source_id:    number;
    created_at:   Date;
    updated_at:   Date;
    user:         User;
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
