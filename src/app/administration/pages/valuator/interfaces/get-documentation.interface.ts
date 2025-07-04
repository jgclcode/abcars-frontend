export interface GetDocumentation {
    code:      number;
    status:    string;
    documents: Documents;
}

export interface Documents {
    id:                                         number;
    contratoCompraVentaFirmado:                 string;
    facturaOriginal:                            string;
    copiaFacturaOrigen:                         string;
    copiaFielIne:                               string;
    curp:                                       string;
    acuseRespuestaCambioRol:                    string;
    adeudosTenencia:                            string;
    montoAdeudoTenencia:                        number;
    tenenciasOriginales:                        string;
    // agnosTenencias:                             number;
    tenencia_12:                                null;
    tenencia_11:                                null;
    tenencia_10:                                null;
    tenencia_9:                                 null;
    tenencia_8:                                 null;
    tenencia_7:                                 null;
    tenencia_6:                                 null;
    tenencia_5:                                 null;
    tenencia_4:                                 null;
    tenencia_3:                                 null;
    tenencia_2:                                 null;
    tenencia_1:                                 null;
    tarjetaDeCirculacion:                       string;
    copiaGuiaAutometrica:                       string;
    compraGuiaA:                                number;
    ventaGuiaA:                                 number;
    consultaIntelimotors:                       string;
    compraIntelimotors:                         number;
    ventaIntelimotors:                          number;
    facturaOriginalFinanciera:                  string;
    verificacionFiscalDeFacturas:               string;
    validacionIne:                              string;
    comprobanteDomicilio:                       string;
    repuve:                                     string;
    checklistCienPuntos:                        string;
    copiasFacturasIntermediasConEndoso:         string;
    validacionFacturaParteAgencia:              string;
    constanciaSituacionFiscal:                  string;
    cambioRolCdTac:                             string;
    consultaTransunion:                         string;
    fotomultas:                                 string;
    montoFotomultas:                            number;
    pdiCheckBateria:                            string;
    manualDelPropietario:                       string;
    gato:                                       string;
    llantaRefaccion:                            string;
    antena:                                     string;
    comprobanteUltimaVerificacion:              string;
    carnetDeServicio:                           string;
    maneralOLlaveDeTuercas:                     string;
    reflejantes:                                string;
    duplicadoDeLlaves:                          string;
    bajaDePlacas:                               string;
    birlosDeSeguridad:                          string;
    peliculaDeSeguridad:                        string;
    cablesPasaCorriente:                        string;
    numSerie:                                   string;
    herramienta:                                string;
    odometroKilometraje:                        string;
    manualYPoliza:                              string;
    llantas:                                    string;
    sellosDeServicio:                           string;
    unidadFrenteTraseraCostadosCajuelaYCofre:   string;
    llantaRefaccionFoto:                        string;
    fotosEnRampaParteBajaYDagnos:               string;
    placasFisicas:                              string;
    pagosCompletosTenencias:                    string;
    facturaConEndosos:                          string;
    tarjetaDeCirculacionPlates:                 string;
    ineCopiaFiel:                               string;
    edoCtaFinancieraObancoIndicaMontoALiquidar: string;
    actaConstitutiva:                           string;
    ineRepresentanteMoral:                      string;
    poderRepresentanteLegal:                    string;
    observations:                               null;
    path:                                       string;
    check_list_id:                              number;
    created_at:                                 Date;
    updated_at:                                 Date;
}
