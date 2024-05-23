export interface GetDamages {
    code:    number;
    status:  string;
    damages: Damage[];
}

export interface Damage {
    id:         number;
    name:       string;
    status:     Status;
    created_at: Date;
    updated_at: Date;
}

export enum Status {
    Exterior = "exterior",
}
