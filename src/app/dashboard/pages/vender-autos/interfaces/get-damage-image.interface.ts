export interface GetDamageImage {
    code:          number;
    status:        string;
    damage_image:  DamageImage;
    damage_images: DamageImage[];
    sell_your_car_vin: string;
}

export interface DamageImage {
    id:               number;
    path:             string;
    status:           string;
    sell_your_car_id: number;
    damage_id:        number;
    created_at:       Date;
    updated_at:       Date;
}
