export interface RoleCreate {
    status:  string;
    code:    string;
    message: string;
    role:    Role;
    errors: string[];
}

export interface Role {
    name:       string;
    guard_name: string;
    updated_at: Date;
    created_at: Date;
    id:         number;
}

