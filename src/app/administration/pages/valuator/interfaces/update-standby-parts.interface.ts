export interface Updstandbyparts {
    status:      string;
    code:        string;
    message:     string;
    sellYourCar: SellYourCar;
}

export interface SellYourCar {
    id:          number;
    version:     string;
    km:          number;
    year:        number;
    date:        Date;
    hour:        string;
    vin:         string;
    status:      string;
    brand_id:    number;
    carmodel_id: number;
    client_id:   number;
    created_at:  Date;
    updated_at:  Date;
}
