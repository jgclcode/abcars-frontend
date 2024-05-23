export interface GetSaleVehiclesWithoutChoice {
    code:     number;
    status:   string;
    vehicles: Vehicle[];
}

export interface Vehicle {
    id:   number;
    name: string;
    vin:  string;
}
