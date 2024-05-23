export interface RootObject {
    code:    string;
    status:  string;
    vehicle: Vehicle[];
   }
   
   export interface Vehicle {
    branch_id:       number;
    carline:         string;
    carmodel_id:     number;
    checks:          Check[];
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
    priceOffer:      number;
    promotion:       string;
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
   
   export interface Check {
    category:   string;
    comment:    string;
    created_at: Date;
    id:         number;
    path:       string;
    updated_at: Date;
    vehicle_id: number;
   }
   