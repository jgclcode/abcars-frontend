export interface PublishVehicleMl {
    code:        number;
    status:      string;
    response:    Response;
    description: Description;
    message:     string | null;
    errors:      string[] | null;
}

export interface Description {
    plain_text:   string;
    date_created: Date;
}

export interface Response {
    id:                               string;
    site_id:                          string;
    title:                            string;
    seller_id:                        number;
    category_id:                      string;
    user_product_id:                  null;
    official_store_id:                null;
    price:                            number;
    base_price:                       number;
    original_price:                   null;
    inventory_id:                     null;
    currency_id:                      string;
    initial_quantity:                 number;
    available_quantity:               number;
    sold_quantity:                    number;
    sale_terms:                       any[];
    buying_mode:                      string;
    listing_type_id:                  string;
    start_time:                       Date;
    stop_time:                        Date;
    end_time:                         Date;
    expiration_time:                  Date;
    condition:                        string;
    permalink:                        string;
    pictures:                         Picture[];
    video_id:                         null;
    descriptions:                     any[];
    accepts_mercadopago:              boolean;
    non_mercado_pago_payment_methods: any[];
    shipping:                         Shipping;
    international_delivery_mode:      string;
    seller_address:                   SellerAddress;
    seller_contact:                   SellerContact;
    location:                         Location;
    geolocation:                      Geolocation;
    coverage_areas:                   any[];
    attributes:                       Attribute[];
    warnings:                         any[];
    listing_source:                   string;
    variations:                       any[];
    thumbnail_id:                     string;
    thumbnail:                        string;
    status:                           string;
    sub_status:                       any[];
    tags:                             any[];
    warranty:                         null;
    catalog_product_id:               null;
    domain_id:                        string;
    seller_custom_field:              null;
    parent_item_id:                   null;
    differential_pricing:             null;
    deal_ids:                         any[];
    automatic_relist:                 boolean;
    date_created:                     Date;
    last_updated:                     Date;
    health:                           null;
    catalog_listing:                  boolean;
    item_relations:                   any[];
    channels:                         string[];
}

export interface Attribute {
    id:         string;
    name:       string;
    value_id:   null | string;
    value_name: string;
    values:     Value[];
    value_type: string;
}

export interface Value {
    id:     null | string;
    name:   string;
    struct: Struct | null;
}

export interface Struct {
    number: number;
    unit:   string;
}

export interface Geolocation {
    latitude:  string;
    longitude: string;
}

export interface Location {
    address_line: string;
    zip_code:     string;
    neighborhood: City;
    city:         City;
    state:        City;
    country:      City;
    open_hours:   string;
}

export interface City {
    id:   string;
    name: Name;
}

export enum Name {
    Mexico = "Mexico",
    Puebla = "Puebla",
    ZonaEsmeralda = "Zona Esmeralda",
}

export interface Picture {
    id:         string;
    url:        string;
    secure_url: string;
    size:       string;
    max_size:   string;
    quality:    string;
}

export interface SellerAddress {
    id:              number;
    comment:         string;
    address_line:    string;
    zip_code:        string;
    city:            City;
    state:           City;
    country:         City;
    latitude:        number;
    longitude:       number;
    search_location: SearchLocation;
}

export interface SearchLocation {
    neighborhood: City;
    city:         City;
    state:        City;
}

export interface SellerContact {
    contact:       string;
    other_info:    string;
    area_code:     string;
    phone:         string;
    area_code2:    string;
    phone2:        string;
    email:         string;
    webpage:       string;
    country_code:  string;
    country_code2: string;
}

export interface Shipping {
    mode:          string;
    local_pick_up: boolean;
    free_shipping: boolean;
    methods:       any[];
    dimensions:    null;
    tags:          any[];
    logistic_type: null;
    store_pick_up: boolean;
}
