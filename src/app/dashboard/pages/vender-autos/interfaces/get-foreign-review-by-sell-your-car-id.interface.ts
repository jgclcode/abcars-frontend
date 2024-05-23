export interface GetForeingReviewBySellYourCarID {
    code:           number;
    status:         string;
    foreing_review: ForeingReview;
}

export interface ForeingReview {
    id:               number;
    req1:             string;
    req2:             string;
    req3:             string;
    req4:             string;
    req5:             string;
    req6:             string;
    req7:             string;
    req8:             string;
    req9:             string;
    req10:            string;
    req11:            string;
    req12:            string;
    req13:            string;
    req14:            string;
    req15:            string;
    req16:            string;
    req17:            string;
    req18:            string;
    req19:            string;
    req20:            string;
    req21:            string;
    req22:            string;
    commentary:       string | null;
    sell_your_car_id: number;
    created_at:       Date;
    updated_at:       Date;
}
