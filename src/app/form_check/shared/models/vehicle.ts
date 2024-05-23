export interface RootObject {
 code:   number;
 quote:  Quote;
 status: string;
}

export interface Quote {
 current_page:   number;
 data:           Datum[];
 first_page_url: string;
 from:           number;
 last_page:      number;
 last_page_url:  string;
 links:          Link[];
 next_page_url:  null;
 path:           string;
 per_page:       number;
 prev_page_url:  null;
 to:             number;
 total:          number;
}

export interface Datum {
 created_at: Date;
 id:         number;
 path:       string;
 updated_at: Date;
 vehicle:    Vehicle;
 vehicle_id: number;
}

export interface Vehicle {
 branch_id:       number;
 carline:         string;
 carmodel_id:     number;
 client_id:       number;
 colorExt:        string;
 colorInt:        string;
 created_at:      Date;
 cylinders:       number;
 deleted_at:      null;
 description:     string;
 extinguiser:     string;
 handbook:        string;
 hydraulicJack:   string;
 id:              number;
 insurancePolicy: string;
 inventoryDays:   number;
 km:              number;
 location:        string;
 name:            string;
 numKeys:         number;
 plates:          null;
 powerCables:     string;
 price:           number;
 priceList:       number;
 priceOffer:      number | null;
 promotion:       null;
 purchaseDate:    Date;
 reflectives:     string;
 salePrice:       number;
 spareTire:       string;
 status:          string;
 studs:           string;
 transmission:    string;
 type:            string;
 updated_at:      Date;
 vehiclebody_id:  number;
 vin:             string;
 yearModel:       number;
}

export interface Link {
 active: boolean;
 label:  string;
 url:    null | string;
}
