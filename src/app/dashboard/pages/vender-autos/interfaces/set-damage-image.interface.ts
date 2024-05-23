export interface SetDamageImage {
    status:  string;
    code:    string;
    message: string;
    damage:  Damage;
    errors: string[];
}

export interface Damage {
    sell_your_car_id: string;
    damage_id:        string;
    status:           string;
    path:             string;
    updated_at:       Date;
    created_at:       Date;
    id:               number;
}
