export interface GetHyp {
    code:   number;
    status: string;
    data:   HypData[];
}

export interface HypData {
    id:                    number;
    id_orden:              string;
    vehicle_type:          string;
    brand:                 string;
    vin:                   string;
    orden_date:            string;
    tower:                 string;
    name:                  string;
    plates:                string;
    person_1:              string;
    phone_1:               string;
    person_2:              string;
    delivery_promise_date: string;
    delivery_promise_hour: string;
    observations:          string;
    updates:               number;
    created_at:            Date;
    updated_at:            Date;
}
