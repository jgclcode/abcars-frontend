export interface ImgDamagePaintingWorks {
    code:           number;
    status:         string;
    painting_works: PaintingWork[];
}

export interface PaintingWork {
    id:               number;
    name:             string;
    amount:           number;
    status:           string;
    img_damage:       string;
    sell_your_car_id: number;
    created_at:       Date;
    updated_at:       Date;
}


export interface PaintingWorks {
    name: string;
    amount: number;
    picture: string;
    sell_your_car_id: number;
}

export interface PostPaintingWorks {
    status:  string;
    code:    string;
    message: string;
}