export interface OwnedPreowned {
    code:   number;
    status: string;
    data:   Datum[];
}

export interface Datum {
    name: string;
    vin:  string;
    type: Type;
}

export enum Type {
    New = "new",
    Preowned = "preowned",
}
