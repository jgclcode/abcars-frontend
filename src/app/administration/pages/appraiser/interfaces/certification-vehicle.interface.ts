export interface CertificationVehicle {
    status:                   string;
    code:                     string;
    DataVehicleCertification: DataVehicleCertification;
}

export interface DataVehicleCertification {
    id:               number;
    cvq1:             string;
    cvq2:             string;
    cvq3:             string;
    // cvq4:             string;
    dateLastMaintenance: Date;
    cvq5:             string;
    cvq6:             string;
    cvq7:             string;
    cvq8:             string;
    cvq9:             string;
    cvq11:            string;
    cvq12:            string;
    sell_your_car_id: number;
    created_at:       Date;
    updated_at:       Date;
}
