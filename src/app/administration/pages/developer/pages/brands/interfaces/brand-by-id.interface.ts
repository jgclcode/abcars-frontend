export interface BrandByID {
    code:   number;
    status: string;
    brand:  Brand;
}

export interface Brand {
    id:          number;
    name:        string;
    description: string;
    location:    string;
    contact:     number;
    picture:     string;
    created_at:  Date;
    updated_at:  Date;
}


// Get all Brands
export interface GetAllBrands {
    code:   number;
    status: string;
    brands:  Brand[];
}