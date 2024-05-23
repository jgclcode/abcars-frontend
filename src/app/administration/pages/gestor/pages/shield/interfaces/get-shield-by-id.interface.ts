export interface GetShieldByID {
    code:   number;
    status: string;
    shield: Shield;
}

export interface Shield {
    id:         number;
    name:       string;
    path:       string;
    created_at: Date;
    updated_at: Date;
}
