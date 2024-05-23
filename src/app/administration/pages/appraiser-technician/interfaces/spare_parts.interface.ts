export interface SpareParts { 
    name: String;
    amount: Number;
    hours: Number;
    sell_your_car_id: Number;
}  

// Get
export interface GetSpareParts {
    code:        number;
    status:      string;
    spare_parts: SparePart[];
}

export interface SparePart {
    id:               number;
    name:             string;
    amount:           Number;
    hours:            number;
    status:           string;
}

// Post
export interface PostSparePart {    
    status: String;
    code: String;
    message: String;    
}