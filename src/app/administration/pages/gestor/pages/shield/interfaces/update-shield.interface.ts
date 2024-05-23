export interface UpdateShield {
    status:  string;
    code:    string;
    message: string;
    vehicle: Vehicle;
}

export interface Vehicle {
    name:       string;
    path:       string;
    updated_at: Date;
    created_at: Date;
    id:         number;
}