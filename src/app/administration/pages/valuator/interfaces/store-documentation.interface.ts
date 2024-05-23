export interface StoreDocumentation {
    status:   string;
    code:     string;
    message:  string;
    document: Document;
}

export interface Document {
    contratoCompraVentaFirmado:         string;
    facturaOriginal:                    string;
    copiaFacturaOrigen:                 string;
    copiaFielIne:                       string;
    curp:                               string;
    acuseRespuestaCambioRol:            string;
    adeudosTenencia:                    string;
    montoAdeudoTenencia:                string;
    tenenciasOriginales:                string;
    // agnosTenencias:                     string;
    tenencia_10:                        null;
    tenencia_9:                         null;
    tenencia_8:                         null;
    tenencia_7:                         null;
    tenencia_6:                         null;
    tenencia_5:                         null;
    tenencia_4:                         null;
    tenencia_3:                         null;
    tenencia_2:                         null;
    tenencia_1:                         null;
    tarjetaDeCirculacion:               string;
    copiaGuiaAutometrica:               string;
    compraGuiaA:                        string;
    ventaGuiaA:                         string;
    consultaIntelimotors:               string;
    compraIntelimotors:                 string;
    ventaIntelimotors:                  string;
    facturaOriginalFinanciera:          string;
    verificacionFiscalDeFacturas:       string;
    validacionIne:                      string;
    comprobanteDomicilio:               string;
    repuve:                             string;
    checklistCienPuntos:                string;
    copiasFacturasIntermediasConEndoso: string;
    validacionFacturaParteAgencia:      string;
    constanciaSituacionFiscal:          string;
    cambioRolCdTac:                     string;
    consultaTransunion:                 string;
    fotomultas:                         string;
    montoFotomultas:                    string;
    pdiCheckBateria:                    string;
    path:                               string;
    check_list_id:                      string;
    updated_at:                         Date;
    created_at:                         Date;
    id:                                 number;
}
