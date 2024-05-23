export interface UserData {
    code:   number;
    status: string;
    users:  Users;
}

export interface Users {
    current_page:   number;
    data:           User[];
    first_page_url: string;
    from:           number;
    last_page:      number;
    last_page_url:  string;
    links:          Link[];
    next_page_url:  null;
    path:           string;
    per_page:       number;
    prev_page_url:  null;
    to:             number;
    total:          number;
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

export interface Link {
    url:    null | string;
    label:  string;
    active: boolean;
}
