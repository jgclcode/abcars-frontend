export interface checkByVehicle {
    id: number
    name: string
    description: string
    vin: string
    location: string
    yearModel: number
    purchaseDate: string
    price: number
    priceList: number
    salePrice: number
    type: string
    carline: string
    cylinders: number
    colorInt: string
    colorExt: string
    status: string
    plates: any
    transmission: string
    inventoryDays: number
    km: number
    numKeys: number
    studs: string
    spareTire: string
    hydraulicJack: string
    extinguiser: string
    reflectives: string
    handbook: string
    insurancePolicy: string
    powerCables: string
    promotion: any
    priceOffer: any
    carmodel_id: number
    vehiclebody_id: number
    branch_id: number
    client_id: number
    created_at: string
    updated_at: string
    deleted_at: any
  }

  export interface RootObject {
    code:    string;
    data:    Data;
    status:  string;
    vehicle: checkByVehicle[];
   }
   
   export interface Data {
    bodywork:     any[];
    electric:     any[];
    interior:     Interior[];
    motor:        Interior[];
    transmission: any[];
   }
   
   export interface Interior {
    category:   string;
    comment:    string;
    created_at: Date;
    id:         number;
    path:       string;
    updated_at: Date;
    vehicle_id: number;
   }