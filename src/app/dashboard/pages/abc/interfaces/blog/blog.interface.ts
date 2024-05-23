export interface Blog {
    id:             number;
    date:           string;
    date_gmt:       string;
    guid:           Guid;
    modified:       string;
    modified_gmt:   string;
    slug:           string;
    status:         string;
    type:           string;
    link:           string;
    title:          Guid;
    content:        Content;
    excerpt:        Content;
    author:         number;
    featured_media: number;
    comment_status: string;
    ping_status:    string;
    sticky:         boolean;
    template:       string;
    format:         string;
    meta:           any[];
    categories:     number[];
    tags:           any[];
    _links:         Links;
    pictureMedia:   string | undefined;
}

export interface Links {
    self:                   About[];
    collection:             About[];
    about:                  About[];
    author:                 Author[];
    replies:                Author[];
    "version-history":      VersionHistory[];
    "predecessor-version"?: PredecessorVersion[];
    "wp:featuredmedia"?:    Author[];
    "wp:attachment":        About[];
    "wp:term":              WpTerm[];
    curies:                 Cury[];
}

export interface About {
    href: string;
}

export interface Author {
    embeddable: boolean;
    href:       string;
}

export interface Cury {
    name:      string;
    href:      string;
    templated: boolean;
}

export interface PredecessorVersion {
    id:   number;
    href: string;
}

export interface VersionHistory {
    count: number;
    href:  string;
}

export interface WpTerm {
    taxonomy:   string;
    embeddable: boolean;
    href:       string;
}

export interface Content {
    rendered:  string;
    protected: boolean;
    text: string;
}

export interface Guid {
    rendered: string;
}



// Response of featured_media
export interface FeaturedMedia {
    id:             number;
    date:           string;
    date_gmt:       string;
    guid:           Caption;
    modified:       string;
    modified_gmt:   string;
    slug:           string;
    status:         string;
    type:           string;
    link:           string;
    title:          Caption;
    author:         number;
    comment_status: string;
    ping_status:    string;
    template:       string;
    meta:           any[];
    description:    Caption;
    caption:        Caption;
    alt_text:       string;
    media_type:     string;
    mime_type:      string;
    media_details:  MediaDetails;
    post:           null;
    source_url:     string;
    _links:         Links;
}

export interface Links {
    self:       About[];
    collection: About[];
    about:      About[];
    author:     Author[];
    replies:    Author[];
}

export interface About {
    href: string;
}

export interface Author {
    embeddable: boolean;
    href:       string;
}

export interface Caption {
    rendered: string;
}

export interface MediaDetails {
    width:      number;
    height:     number;
    file:       string;
    sizes:      Sizes;
    image_meta: ImageMeta;
}

export interface ImageMeta {
    aperture:          string;
    credit:            string;
    camera:            string;
    caption:           string;
    created_timestamp: string;
    copyright:         string;
    focal_length:      string;
    iso:               string;
    shutter_speed:     string;
    title:             string;
    orientation:       string;
    keywords:          any[];
}

export interface Sizes {
    medium:       Full;
    large:        Full;
    thumbnail:    Full;
    medium_large: Full;
    full:         Full;
}

export interface Full {
    file:       string;
    width:      number;
    height:     number;
    mime_type:  string;
    source_url: string;
}

