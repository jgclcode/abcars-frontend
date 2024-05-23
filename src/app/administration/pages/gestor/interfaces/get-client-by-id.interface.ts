export interface GetClientByID {
    code:   number;
    status: string;
    client: Client;
}

export interface Client {
    id:           number;
    phone1:       number;
    phone2:       null;
    curp:         null;
    points:       number;
    rewards:      string;
    address:      string;
    municipality: string;
    state:        string;
    cp:           string;
    rfc:          string;
    user_id:      number;
    source_id:    number;
    created_at:   Date;
    updated_at:   Date;
    user:         User;
}

export interface User {
    id:         number;
    name:       string;
    surname:    string;
    email:      string;
    picture:    null;
    gender:     string;
    created_at: Date;
    updated_at: Date;
}
