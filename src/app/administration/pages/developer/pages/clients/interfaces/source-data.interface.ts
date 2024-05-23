export interface SourceData {
    code:    number;
    status:  string;
    sources: Source[];
}

export interface Source {
    id:         number;
    name:       string;
    created_at: Date;
    updated_at: Date;
}
