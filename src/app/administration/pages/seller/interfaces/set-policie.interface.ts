export interface SetPolicie {
    status:  string;
    code:    string;
    message: string;
    policie: Policie;
}

export interface Policie {
    signature_date:  Date;
    signature_place: string;
    warranty_period: Date;
    id_warranty:     string;
    start_date_gm:   Date;
    start_date_ge:   Date;
    ending_date_gm:  Date;
    ending_date_ge:  Date;
    km_next_service: string;
    km_last_service: string;
    business:        string;
    buyer:           string;
    client_id:       number;
    vehicle_id:      number;
    updated_at:      Date;
    created_at:      Date;
    id:              number;
}
