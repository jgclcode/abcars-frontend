export interface GetAppraiserTechnicians {
    status:               string;
    code:                 string;
    AppraiserTechnicians: AppraiserTechnician[];
}

export interface AppraiserTechnician {
    id:         number;
    name:       string;
    surname:    string;
    email:      string;
    picture:    null | string;
    gender:     string;
    created_at: Date;
    updated_at: Date;
}
