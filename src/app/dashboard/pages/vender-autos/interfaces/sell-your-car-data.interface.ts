export interface SellYourCarData {
    status:        string;
    code:          string;
    message:       string;
    sell_your_car: SellYourCar;
}

export interface SellYourCar {
    version:     string;
    km:          number;
    year:        number;
    vin:         string;
    brand_id:    number;
    carmodel_id: number;
    client_id:   number;
    updated_at:  Date;
    created_at:  Date;
    id:          number;
}
