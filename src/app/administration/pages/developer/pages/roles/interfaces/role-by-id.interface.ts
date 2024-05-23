export interface RoleByID {
    code:   number;
    status: string;
    role:   Role;
}

export interface Role {
    id:         number;
    name:       string;
    guard_name: string;
    created_at: Date;
    updated_at: Date;
}
