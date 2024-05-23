export interface SetChoice {
    status:  string;
    code:    string;
    message: string;
    choice:  Choice;
}

export interface Choice {
    amount:      number;
    namePayment: string;
    status:      string;
    reference:   string;
    amountDate:  Date;
    vehicle_id:  number;
    client_id:   number;
    rewards:     string;
    updated_at:  Date;
    created_at:  Date;
    id:          number;
}
