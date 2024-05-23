export interface SetClient {
    status:  string;
    code:    string;
    message: string;
    client:  Client;
}

export interface Client {
    phone1:       string;
    phone2:       null;
    points:       number;
    rewards:      string;
    address:      string;
    municipality: string;
    state:        string;
    cp:           string;
    rfc:          string;
    user_id:      number;
    source_id:    number;
    updated_at:   Date;
    created_at:   Date;
    id:           number;
}
