export interface RoleData {
    status: string;
    code:   string;
    roles:  Roles;
}

export interface Roles {
    current_page:   number;
    data:           Role[];
    first_page_url: string;
    from:           number;
    last_page:      number;
    last_page_url:  string;
    links:          Link[];
    next_page_url:  string;
    path:           string;
    per_page:       number;
    prev_page_url:  null;
    to:             number;
    total:          number;
}

export interface Role {
    id:         number;
    name:       string;
    guard_name: string;
    created_at: Date;
    updated_at: Date;
}

export interface Link {
    url:    null | string;
    label:  string;
    active: boolean;
}

// Role Update Interface
export interface RoleUpdate {
    status:  string;
    code:    string;
    message: string;
    rol:     Role;
}

// Role Delete Interface
export interface RoleDelete {
    status:  string;
    code:    string;
    message: string;    
}

