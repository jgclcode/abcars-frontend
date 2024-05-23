export interface AddPromotions {
    code:      number;
    status:    string;
    respuesta: Respuesta;
}

export interface Respuesta {
    total:   number;
    updated: Updated;
    errors:  Errors;
}

export interface Errors {
    fila27: string;
    fila28: string;
}

export interface Updated {
    fila1:  string;
    fila2:  string;
    fila3:  string;
    fila4:  string;
    fila5:  string;
    fila6:  string;
    fila7:  string;
    fila8:  string;
    fila9:  string;
    fila10: string;
    fila11: string;
    fila12: string;
    fila13: string;
    fila14: string;
    fila15: string;
    fila16: string;
    fila17: string;
    fila18: string;
    fila19: string;
    fila20: string;
    fila21: string;
    fila22: string;
    fila23: string;
    fila24: string;
    fila25: string;
    fila26: string;
}
