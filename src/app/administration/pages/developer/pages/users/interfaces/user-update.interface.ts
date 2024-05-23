export interface UserUpdate {
    status:  string;
    code:    string;
    message: string;
    user:    User;
    errors: string[];
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
    clients:    Client[];
}

export interface Client {
    id:         number;
    phone1:     number;
    phone2:     number;
    curp:       string;
    points:     number;
    user_id:    number;
    source_id:  number;
    created_at: Date;
    updated_at: Date;
}
