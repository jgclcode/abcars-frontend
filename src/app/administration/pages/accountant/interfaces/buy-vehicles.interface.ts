export interface UpdateSellYourCar {
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
    date:        string;
    hour:        string;
    vin:         string;
    status:      string;
    estimated_payment_date: string;
    brand_id:    number;
    carmodel_id: number;
    client_id:   number;
    created_at:  string;
    updated_at:  string;
}