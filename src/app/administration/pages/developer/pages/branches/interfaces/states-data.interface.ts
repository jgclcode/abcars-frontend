export interface StatesData {
    code:   number;
    status: string;
    states: State[];
}

export interface State {
    id:          number;
    iso:         string;
    name:        string;
    description: string;
    created_at:  Date;
    updated_at:  Date;
}
