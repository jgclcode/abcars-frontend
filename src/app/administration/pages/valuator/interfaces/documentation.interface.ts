// Interfaces for Documentation Check List
export interface Documentation {
    code:      number;
    status:    string;
    documents: Documents[];
}

export interface Documents {
    id:         number;
    name:       string;
    pathname?:   string;
    update_document_id?: number;
    created_at: string;
    updated_at: string;
}

// Post Documentation
export interface PostDocumentation {
    status:   string;
    code:     string;
    message:  string;
    document: Document;
}

export interface Document {
    id:              number;
    name:            string;
    created_at:      string;
    updated_at:      string;
    document_images: DocumentImage[];
}

// Get Document Imagen

export interface GetDocumentImagen {
    code:           number;
    status:         string;
    document_image: DocumentImage;
}

export interface DocumentImage {
    id:            number;
    path:          string;
    check_list_id: number;
    document_id:   number;
    created_at:    string;
    updated_at:    string;
}

// Update Document
export interface UpdateDocument {
    status:   string;
    code:     string;
    message:  string;
    document: Document;
}

