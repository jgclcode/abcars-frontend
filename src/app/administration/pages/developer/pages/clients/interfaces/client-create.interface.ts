export interface ClientCreate {
    status:  string;
    code:    string;
    message: string;
    client:  Client;
}

export interface Client {
    phone1:     string;
    phone2:     string;
    curp:       string;
    points:     number;
    user_id:    number;
    source_id:  number;
    updated_at: Date;
    created_at: Date;
    id:         number;
}
