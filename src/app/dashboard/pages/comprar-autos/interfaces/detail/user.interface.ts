export interface UserById {
    code: number;
    status: string;
    user: User;
}

export interface User {
    id:          number;
    name:        string;
    surname:     string;
    email:       string;
    picture:     null;
    gender:      string;
    created_at:  Date;
    updated_at:  Date;
    roles:       Roles[];
    clients:     any[];
}

export interface Roles {
    id:         number;
    name:       string;
    guard_name: string;
    created_at: Date;
    updated_at: Date;
    pivot:      Pivot;
}

export interface Pivot {
    model_id:   number;
    role_id:    number;
    model_type: string;
}