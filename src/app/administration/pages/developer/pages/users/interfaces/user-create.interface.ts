export interface UserCreate {
    status:  string;
    code:    string;
    message: string;
    user:    CreatedUser;
    errors:  string[];
}

export interface CreatedUser {
    name:       string;
    surname:    string;
    email:      string;
    gender:     string;
    updated_at: Date;
    created_at: Date;
    id:         number;
    clients:    CreatedClient[];
}

export interface CreatedClient {
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
