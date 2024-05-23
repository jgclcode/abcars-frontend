export interface UserByIDData {
    code:   number;
    status: string;
    user:   User;
}

export interface User {
    id:         number;
    name:       string;
    surname:    string;
    email:      string;
    picture:    null;
    gender:     string;
    created_at: string;
    updated_at: string;
    roles:      Role[];
    clients:    Client[];
}

export interface Client {
    id:           number;
    phone1:       number;
    phone2:       number;
    curp:         string;
    points:       number;
    rewards:      string;
    address:      null;
    municipality: null;
    state:        null;
    cp:           null;
    rfc:          null;
    user_id:      number;
    source_id:    number;
    created_at:   string;
    updated_at:   string;
}

export interface Role {
    id:         number;
    name:       string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    pivot:      Pivot;
}

export interface Pivot {
    model_id:   number;
    role_id:    number;
    model_type: string;
}
