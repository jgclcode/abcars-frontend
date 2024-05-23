export interface UsersWithoutClientData {
    code:   number;
    status: string;
    users:  User[];
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
