export interface Technician {
    status:          string;
    code:            string;
    data_technician: DataTechnician;
}

export interface DataTechnician {
    id:         number;
    user_id:    number;
    created_at: Date;
    updated_at: Date;
}
