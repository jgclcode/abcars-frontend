export interface InteriorReview {
    status:             string;
    code:               string;
    DataInteriorReview: DataInteriorReview;
}

export interface DataInteriorReview {
    id:               number;
    iq1:              string;
    iq2:              string;
    iq3:              string;
    iq4:              string;
    iq5:              string;
    iq6:              string;
    iq7:              string;
    iq8:              string;
    iq9:              string;
    iq10:             string;
    iq11:             string;
    iq12:             string;
    iq13:             string;
    iq14:             string;
    iq15:             string;
    iq16:             string;
    iq17:             string;
    sell_your_car_id: number;
    created_at:       Date;
    updated_at:       Date;
}
