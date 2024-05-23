import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Component, Inject } from '@angular/core';

// Animations
import Swal from "sweetalert2";

// Services
import { SellYourCarService } from '../../services/sell-your-car.service';

// Interfaces
import { Documentation, Documents, GetDocumentImagen, PostDocumentation, UpdateDocument } from '../../interfaces/documentation.interface';
import { GetDocumentation } from '../../interfaces/get-documentation.interface';
import { StoreDocumentation } from '../../interfaces/store-documentation.interface';

@Component({
  selector: 'app-documentation-vehicle',
  templateUrl: './documentation-vehicle.component.html',
  styleUrls: ['./documentation-vehicle.component.css']
})

export class DocumentationVehicleComponent {

  // References
  public url: string = environment.baseUrl;
  public documents: Documents[] = []; 
  public spinner: boolean = false; 
  public spinnerEnvio: boolean = false; 
  public save_documents:boolean = false;
  public checkt12:boolean = false;
  public checkt11:boolean = false;
  public checkt10:boolean = false;
  public checkt9:boolean = false;
  public checkt8:boolean = false;
  public checkt7:boolean = false;
  public checkt6:boolean = false;
  public checkt5:boolean = false;
  public checkt4:boolean = false;
  public checkt3:boolean = false;
  public checkt2:boolean = false;
  public checkt1:boolean = false;
  public tenencia12!: number;
  public tenencia11!: number;
  public tenencia10!: number;
  public tenencia9!: number;
  public tenencia8!: number;
  public tenencia7!: number;
  public tenencia6!: number;
  public tenencia5!: number;
  public tenencia4!: number;
  public tenencia3!: number;
  public tenencia2!: number;
  public tenencia1!: number;
  public compraGA!:number;
  public ventaGA!:number;
  public compraTI!:number;
  public ventaTI!:number;
  public compraGAdisabled: boolean = true;
  public ventaGAdisabled: boolean = true;
  public compraTIdisabled: boolean = true;
  public ventaTIdisabled: boolean = true;
  public btn_load:boolean = true;
  public btn_watch:boolean = false;
  // public checklistID: number = this.data.checklist_id;
  public sellyourcarID: number = this.data.id;

  // References Form
  public takeInformation!: UntypedFormGroup;
  public documentationCar!: UntypedFormGroup;
  public documentsPlateProcedures!: UntypedFormGroup;
  public years: number[] = [];
  private _valuationFormFroupGeneral!: UntypedFormGroup;


  constructor(
    private _router: Router,
    private _formBuilder: UntypedFormBuilder,
    private _sellYourCarService: SellYourCarService, 
    @Inject(MAT_BOTTOM_SHEET_DATA) 
    public data: any,
    private bottomsheet: MatBottomSheetRef
    ) { 
    // Initialization of method
    // this.initDocuments();
    // Years of vehicles allowed
    let year = new Date().getFullYear();
    for (let i = year; i > year-12; i--) {      
      this.years.push(i);      
    }

    this.tenencia12 = this.years[0];
    this.tenencia11 = this.years[1];
    this.tenencia10 = this.years[2];
    this.tenencia9 = this.years[3];
    this.tenencia8 = this.years[4];
    this.tenencia7 = this.years[5];
    this.tenencia6 = this.years[6];
    this.tenencia5 = this.years[7];
    this.tenencia4 = this.years[8];
    this.tenencia3 = this.years[9];
    this.tenencia2 = this.years[10];
    this.tenencia1 = this.years[11];
    
    
    // Initialization Form
    this.takeInformationFormInit();
    this.documentationCarFormInit();
    this.documentsPlateProceduresFormInit();
    // this.getDocumentation(this.data.checklist_id);
    this.getDocumentation(this.data.id);
  }

  // Form points take information

  get contratoCompraVentaFirmadoInvalid(){
    return this.takeInformation.get('contratoCompraVentaFirmado')!.invalid && (this.takeInformation.get('contratoCompraVentaFirmado')!.dirty || this.takeInformation.get('contratoCompraVentaFirmado')!.touched);
  }
  
  get facturaOriginalInvalid(){
    return this.takeInformation.get('facturaOriginal')!.invalid && (this.takeInformation.get('facturaOriginal')!.dirty || this.takeInformation.get('facturaOriginal')!.touched);
  }
  
  get copiaFacturaOrigenInvalid(){
    return this.takeInformation.get('copiaFacturaOrigen')!.invalid && (this.takeInformation.get('copiaFacturaOrigen')!.dirty || this.takeInformation.get('copiaFacturaOrigen')!.touched);
  }
  
  get copiaFielIneInvalid(){
    return this.takeInformation.get('copiaFielIne')!.invalid && (this.takeInformation.get('copiaFielIne')!.dirty || this.takeInformation.get('copiaFielIne')!.touched);
  }
  
  get curpInvalid(){
    return this.takeInformation.get('curp')!.invalid && (this.takeInformation.get('curp')!.dirty || this.takeInformation.get('curp')!.touched);
  }
  
  get acuseRespuestaCambioRolInvalid(){
    return this.takeInformation.get('acuseRespuestaCambioRol')!.invalid && (this.takeInformation.get('acuseRespuestaCambioRol')!.dirty || this.takeInformation.get('acuseRespuestaCambioRol')!.touched);
  }
  
  get adeudosTenenciaInvalid(){
    return this.takeInformation.get('adeudosTenencia')!.invalid && (this.takeInformation.get('adeudosTenencia')!.dirty || this.takeInformation.get('adeudosTenencia')!.touched);
  }
  
  get montoAdeudoTenenciaInvalid(){
    return this.takeInformation.get('montoAdeudoTenencia')!.invalid && (this.takeInformation.get('montoAdeudoTenencia')!.dirty || this.takeInformation.get('montoAdeudoTenencia')!.touched);
  }
  
  get tenenciasOriginalesInvalid(){
    return this.takeInformation.get('tenenciasOriginales')!.invalid && (this.takeInformation.get('tenenciasOriginales')!.dirty || this.takeInformation.get('tenenciasOriginales')!.touched);
  }
  
  get agnosTenenciasInvalid(){
    return this.takeInformation.get('agnosTenencias')!.invalid && (this.takeInformation.get('agnosTenencias')!.dirty || this.takeInformation.get('agnosTenencias')!.touched);
  }
  
  get tarjetaDeCirculacionInvalid(){
    return this.takeInformation.get('tarjetaDeCirculacion')!.invalid && (this.takeInformation.get('tarjetaDeCirculacion')!.dirty || this.takeInformation.get('tarjetaDeCirculacion')!.touched);
  }
  
  get copiaGuiaAutometricaInvalid(){
    return this.takeInformation.get('copiaGuiaAutometrica')!.invalid && (this.takeInformation.get('copiaGuiaAutometrica')!.dirty || this.takeInformation.get('copiaGuiaAutometrica')!.touched);
  }
  
  // get compraGuiaAInvalid(){
  //   return this.takeInformation.get('compraGuiaA')!.invalid && (this.takeInformation.get('compraGuiaA')!.dirty || this.takeInformation.get('compraGuiaA')!.touched);
  // }
  
  // get ventaGuiaAInvalid(){
  //   return this.takeInformation.get('ventaGuiaA')!.invalid && (this.takeInformation.get('ventaGuiaA')!.dirty || this.takeInformation.get('ventaGuiaA')!.touched);
  // }
  
  get consultaIntelimotorsInvalid(){
    return this.takeInformation.get('consultaIntelimotors')!.invalid && (this.takeInformation.get('consultaIntelimotors')!.dirty || this.takeInformation.get('consultaIntelimotors')!.touched);
  }
  
  // get compraIntelimotorsInvalid(){
  //   return this.takeInformation.get('compraIntelimotors')!.invalid && (this.takeInformation.get('compraIntelimotors')!.dirty || this.takeInformation.get('compraIntelimotors')!.touched);
  // }
  
  // get ventaIntelimotorsInvalid(){
  //   return this.takeInformation.get('ventaIntelimotors')!.invalid && (this.takeInformation.get('ventaIntelimotors')!.dirty || this.takeInformation.get('ventaIntelimotors')!.touched);
  // }
  
  get facturaOriginalFinancieraInvalid(){
    return this.takeInformation.get('facturaOriginalFinanciera')!.invalid && (this.takeInformation.get('facturaOriginalFinanciera')!.dirty || this.takeInformation.get('facturaOriginalFinanciera')!.touched);
  }
  
  get verificacionFiscalDeFacturasInvalid(){
    return this.takeInformation.get('verificacionFiscalDeFacturas')!.invalid && (this.takeInformation.get('verificacionFiscalDeFacturas')!.dirty || this.takeInformation.get('verificacionFiscalDeFacturas')!.touched);
  }
  
  get validacionIneInvalid(){
    return this.takeInformation.get('validacionIne')!.invalid && (this.takeInformation.get('validacionIne')!.dirty || this.takeInformation.get('validacionIne')!.touched);
  }
  
  get comprobanteDomicilioInvalid(){
    return this.takeInformation.get('comprobanteDomicilio')!.invalid && (this.takeInformation.get('comprobanteDomicilio')!.dirty || this.takeInformation.get('comprobanteDomicilio')!.touched);
  }
  
  get repuveInvalid(){
    return this.takeInformation.get('repuve')!.invalid && (this.takeInformation.get('repuve')!.dirty || this.takeInformation.get('repuve')!.touched);
  }
  
  get checklistCienPuntosInvalid(){
    return this.takeInformation.get('checklistCienPuntos')!.invalid && (this.takeInformation.get('checklistCienPuntos')!.dirty || this.takeInformation.get('checklistCienPuntos')!.touched);
  }
  
  get copiasFacturasIntermediasConEndosoInvalid(){
    return this.takeInformation.get('copiasFacturasIntermediasConEndoso')!.invalid && (this.takeInformation.get('copiasFacturasIntermediasConEndoso')!.dirty || this.takeInformation.get('copiasFacturasIntermediasConEndoso')!.touched);
  }
  
  get validacionFacturaParteAgenciaInvalid(){
    return this.takeInformation.get('validacionFacturaParteAgencia')!.invalid && (this.takeInformation.get('validacionFacturaParteAgencia')!.dirty || this.takeInformation.get('validacionFacturaParteAgencia')!.touched);
  }
  
  get constanciaSituacionFiscalInvalid(){
    return this.takeInformation.get('constanciaSituacionFiscal')!.invalid && (this.takeInformation.get('constanciaSituacionFiscal')!.dirty || this.takeInformation.get('constanciaSituacionFiscal')!.touched);
  }
  
  get cambioRolCdTacInvalid(){
    return this.takeInformation.get('cambioRolCdTac')!.invalid && (this.takeInformation.get('cambioRolCdTac')!.dirty || this.takeInformation.get('cambioRolCdTac')!.touched);
  }
  
  get consultaTransunionInvalid(){
    return this.takeInformation.get('consultaTransunion')!.invalid && (this.takeInformation.get('consultaTransunion')!.dirty || this.takeInformation.get('consultaTransunion')!.touched);
  }
  
  get fotomultasInvalid(){
    return this.takeInformation.get('fotomultas')!.invalid && (this.takeInformation.get('fotomultas')!.dirty || this.takeInformation.get('fotomultas')!.touched);
  }
  
  get montoFotomultasInvalid(){
    return this.takeInformation.get('montoFotomultas')!.invalid && (this.takeInformation.get('montoFotomultas')!.dirty || this.takeInformation.get('montoFotomultas')!.touched);
  }
  
  get pdiCheckBateriaInvalid(){
    return this.takeInformation.get('pdiCheckBateria')!.invalid && (this.takeInformation.get('pdiCheckBateria')!.dirty || this.takeInformation.get('pdiCheckBateria')!.touched);
  }

  // Form points unit documentation
  get manualDelPropietarioInvalid(){
    return this.documentationCar.get('manualDelPropietario')!.invalid && (this.documentationCar.get('manualDelPropietario')!.dirty || this.documentationCar.get('manualDelPropietario')!.touched);
  }
  
  get gatoInvalid(){
    return this.documentationCar.get('gato')!.invalid && (this.documentationCar.get('gato')!.dirty || this.documentationCar.get('gato')!.touched);
  }
  
  get llantaRefaccionInvalid(){
    return this.documentationCar.get('llantaRefaccion')!.invalid && (this.documentationCar.get('llantaRefaccion')!.dirty || this.documentationCar.get('llantaRefaccion')!.touched);
  }
  
  get antenaInvalid(){
    return this.documentationCar.get('antena')!.invalid && (this.documentationCar.get('antena')!.dirty || this.documentationCar.get('antena')!.touched);
  }
  
  get comprobanteUltimaVerificacionInvalid(){
    return this.documentationCar.get('comprobanteUltimaVerificacion')!.invalid && (this.documentationCar.get('comprobanteUltimaVerificacion')!.dirty || this.documentationCar.get('comprobanteUltimaVerificacion')!.touched);
  }
  
  get carnetDeServicioInvalid(){
    return this.documentationCar.get('carnetDeServicio')!.invalid && (this.documentationCar.get('carnetDeServicio')!.dirty || this.documentationCar.get('carnetDeServicio')!.touched);
  }
  
  get maneralOLlaveDeTuercasInvalid(){
    return this.documentationCar.get('maneralOLlaveDeTuercas')!.invalid && (this.documentationCar.get('maneralOLlaveDeTuercas')!.dirty || this.documentationCar.get('maneralOLlaveDeTuercas')!.touched);
  }
  
  get reflejantesInvalid(){
    return this.documentationCar.get('reflejantes')!.invalid && (this.documentationCar.get('reflejantes')!.dirty || this.documentationCar.get('reflejantes')!.touched);
  }
  
  get duplicadoDeLlavesInvalid(){
    return this.documentationCar.get('duplicadoDeLlaves')!.invalid && (this.documentationCar.get('duplicadoDeLlaves')!.dirty || this.documentationCar.get('duplicadoDeLlaves')!.touched);
  }
  
  get bajaDePlacasInvalid(){
    return this.documentationCar.get('bajaDePlacas')!.invalid && (this.documentationCar.get('bajaDePlacas')!.dirty || this.documentationCar.get('bajaDePlacas')!.touched);
  }
  
  get birlosDeSeguridadInvalid(){
    return this.documentationCar.get('birlosDeSeguridad')!.invalid && (this.documentationCar.get('birlosDeSeguridad')!.dirty || this.documentationCar.get('birlosDeSeguridad')!.touched);
  }
  
  get peliculaDeSeguridadInvalid(){
    return this.documentationCar.get('peliculaDeSeguridad')!.invalid && (this.documentationCar.get('peliculaDeSeguridad')!.dirty || this.documentationCar.get('peliculaDeSeguridad')!.touched);
  }
  
  get cablesPasaCorrienteInvalid(){
    return this.documentationCar.get('cablesPasaCorriente')!.invalid && (this.documentationCar.get('cablesPasaCorriente')!.dirty || this.documentationCar.get('cablesPasaCorriente')!.touched);
  }
  
  get numSerieInvalid(){
    return this.documentationCar.get('numSerie')!.invalid && (this.documentationCar.get('numSerie')!.dirty || this.documentationCar.get('numSerie')!.touched);
  }
  
  get herramientaInvalid(){
    return this.documentationCar.get('herramienta')!.invalid && (this.documentationCar.get('herramienta')!.dirty || this.documentationCar.get('herramienta')!.touched);
  }
  
  get odometroKilometrajeInvalid(){
    return this.documentationCar.get('odometroKilometraje')!.invalid && (this.documentationCar.get('odometroKilometraje')!.dirty || this.documentationCar.get('odometroKilometraje')!.touched);
  }
  
  get manualYPolizaInvalid(){
    return this.documentationCar.get('manualYPoliza')!.invalid && (this.documentationCar.get('manualYPoliza')!.dirty || this.documentationCar.get('manualYPoliza')!.touched);
  }
  
  get llantasInvalid(){
    return this.documentationCar.get('llantas')!.invalid && (this.documentationCar.get('llantas')!.dirty || this.documentationCar.get('llantas')!.touched);
  }
  
  get sellosDeServicioInvalid(){
    return this.documentationCar.get('sellosDeServicio')!.invalid && (this.documentationCar.get('sellosDeServicio')!.dirty || this.documentationCar.get('sellosDeServicio')!.touched);
  }
  
  get unidadFrenteTraseraCostadosCajuelaYCofreInvalid(){
    return this.documentationCar.get('unidadFrenteTraseraCostadosCajuelaYCofre')!.invalid && (this.documentationCar.get('unidadFrenteTraseraCostadosCajuelaYCofre')!.dirty || this.documentationCar.get('unidadFrenteTraseraCostadosCajuelaYCofre')!.touched);
  }
  
  get llantaRefaccionFotoInvalid(){
    return this.documentationCar.get('llantaRefaccionFoto')!.invalid && (this.documentationCar.get('llantaRefaccionFoto')!.dirty || this.documentationCar.get('llantaRefaccionFoto')!.touched);
  }
  
  get fotosEnRampaParteBajaYDagnosInvalid(){
    return this.documentationCar.get('fotosEnRampaParteBajaYDagnos')!.invalid && (this.documentationCar.get('fotosEnRampaParteBajaYDagnos')!.dirty || this.documentationCar.get('fotosEnRampaParteBajaYDagnos')!.touched);
  }
  
  // Form Documents for plate procedures
  get placasFisicasInvalid(){
    return this.documentsPlateProcedures.get('placasFisicas')!.invalid && (this.documentsPlateProcedures.get('placasFisicas')!.dirty || this.documentsPlateProcedures.get('placasFisicas')!.touched);
  }
  
  get pagosCompletosTenenciasInvalid(){
    return this.documentsPlateProcedures.get('pagosCompletosTenencias')!.invalid && (this.documentsPlateProcedures.get('pagosCompletosTenencias')!.dirty || this.documentsPlateProcedures.get('pagosCompletosTenencias')!.touched);
  }
  
  get facturaConEndososInvalid(){
    return this.documentsPlateProcedures.get('facturaConEndosos')!.invalid && (this.documentsPlateProcedures.get('facturaConEndosos')!.dirty || this.documentsPlateProcedures.get('facturaConEndosos')!.touched);
  }
  
  get tarjetaDeCirculacionPlatesInvalid(){
    return this.documentsPlateProcedures.get('tarjetaDeCirculacionPlates')!.invalid && (this.documentsPlateProcedures.get('tarjetaDeCirculacionPlates')!.dirty || this.documentsPlateProcedures.get('tarjetaDeCirculacionPlates')!.touched);
  }
  
  get ineCopiaFielInvalid(){
    return this.documentsPlateProcedures.get('ineCopiaFiel')!.invalid && (this.documentsPlateProcedures.get('ineCopiaFiel')!.dirty || this.documentsPlateProcedures.get('ineCopiaFiel')!.touched);
  }
  
  get edoCtaFinancieraObancoIndicaMontoALiquidarInvalid(){
    return this.documentsPlateProcedures.get('edoCtaFinancieraObancoIndicaMontoALiquidar')!.invalid && (this.documentsPlateProcedures.get('edoCtaFinancieraObancoIndicaMontoALiquidar')!.dirty || this.documentsPlateProcedures.get('edoCtaFinancieraObancoIndicaMontoALiquidar')!.touched);
  }
  
  get actaConstitutivaInvalid(){
    return this.documentsPlateProcedures.get('actaConstitutiva')!.invalid && (this.documentsPlateProcedures.get('actaConstitutiva')!.dirty || this.documentsPlateProcedures.get('actaConstitutiva')!.touched);
  }
  
  get ineRepresentanteMoralInvalid(){
    return this.documentsPlateProcedures.get('ineRepresentanteMoral')!.invalid && (this.documentsPlateProcedures.get('ineRepresentanteMoral')!.dirty || this.documentsPlateProcedures.get('ineRepresentanteMoral')!.touched);
  }
  
  get poderRepresentanteLegalInvalid(){
    return this.documentsPlateProcedures.get('poderRepresentanteLegal')!.invalid && (this.documentsPlateProcedures.get('poderRepresentanteLegal')!.dirty || this.documentsPlateProcedures.get('poderRepresentanteLegal')!.touched);
  }



  /**
   * Init method for get documentation items
   */
  /* public initDocuments() { 
    this._sellYourCarService.documentation().subscribe(
      ({ code, status, documents }: Documentation) => {
        if (code === 200 && status === 'success') {                   
          this.documents = documents;

          // Get names documents
          documents.forEach(document => {
            this.getDocumentImagen(this.data.checklist_id, document.id);
          });
        }
      }, error => {
        this.documents = [];
      }
    );
  } */

  /** 
    * Form Initialization
    */
  private takeInformationFormInit(){
    this.takeInformation = this._formBuilder.group({
      contratoCompraVentaFirmado: ['', Validators.required],
      facturaOriginal: ['', Validators.required],
      copiaFacturaOrigen: ['', Validators.required],
      copiaFielIne: ['', Validators.required],
      curp: ['', Validators.required],
      acuseRespuestaCambioRol: ['', Validators.required],
      adeudosTenencia: ['', Validators.required],
      montoAdeudoTenencia: ['', [Validators.required, Validators.max(999999)]],
      tenenciasOriginales: ['', Validators.required],
      // agnosTenencias: ['', Validators.required],
      tenencia_12: [],
      tenencia_11: [],
      tenencia_10: [],
      tenencia_9: [],
      tenencia_8: [],
      tenencia_7: [],
      tenencia_6: [],
      tenencia_5: [],
      tenencia_4: [],
      tenencia_3: [],
      tenencia_2: [],
      tenencia_1: [],
      tarjetaDeCirculacion: ['', Validators.required],
      copiaGuiaAutometrica: ['', Validators.required],
      // compraGuiaA: ['', [Validators.required, Validators.max(9999999)]],
      // ventaGuiaA: ['', [Validators.required, Validators.max(9999999)]],
      consultaIntelimotors: ['', Validators.required],
      // compraIntelimotors: ['', [Validators.required, Validators.max(9999999)]],
      // ventaIntelimotors: ['', [Validators.required, Validators.max(9999999)]],
      facturaOriginalFinanciera: ['', Validators.required],
      verificacionFiscalDeFacturas: ['', Validators.required],
      validacionIne: ['', Validators.required],
      comprobanteDomicilio: ['', Validators.required],
      repuve: ['', Validators.required],
      checklistCienPuntos: ['', Validators.required],
      copiasFacturasIntermediasConEndoso: ['', Validators.required],
      validacionFacturaParteAgencia: ['', Validators.required],
      constanciaSituacionFiscal: ['', Validators.required],
      cambioRolCdTac: ['', Validators.required],
      consultaTransunion: ['', Validators.required],
      fotomultas: ['', Validators.required],
      montoFotomultas: ['', [Validators.required, Validators.max(999999)]],
      pdiCheckBateria: ['', Validators.required]
    });
  }
  
  private documentationCarFormInit(){
    this.documentationCar = this._formBuilder.group({
      manualDelPropietario: ['', Validators.required],
      gato: ['', Validators.required],
      llantaRefaccion: ['', Validators.required],
      antena: ['', Validators.required],
      comprobanteUltimaVerificacion: ['', Validators.required],
      carnetDeServicio: ['', Validators.required],
      maneralOLlaveDeTuercas: ['', Validators.required],
      reflejantes: ['', Validators.required],
      duplicadoDeLlaves: ['', Validators.required],
      bajaDePlacas: ['', Validators.required],
      birlosDeSeguridad: ['', Validators.required],
      peliculaDeSeguridad: ['', Validators.required],
      cablesPasaCorriente: ['', Validators.required],
      numSerie: ['', Validators.required],
      herramienta: ['', Validators.required],
      odometroKilometraje: ['', Validators.required],
      manualYPoliza: ['', Validators.required],
      llantas: ['', Validators.required],
      sellosDeServicio: ['', Validators.required],
      unidadFrenteTraseraCostadosCajuelaYCofre: ['', Validators.required],
      llantaRefaccionFoto: ['', Validators.required],
      fotosEnRampaParteBajaYDagnos: ['', Validators.required],

    });
  }

  private documentsPlateProceduresFormInit(){
    this.documentsPlateProcedures = this._formBuilder.group({
      placasFisicas: ['', Validators.required],
      pagosCompletosTenencias: ['', Validators.required],
      facturaConEndosos: ['', Validators.required],
      tarjetaDeCirculacionPlates: ['', Validators.required],
      ineCopiaFiel: ['', Validators.required],
      edoCtaFinancieraObancoIndicaMontoALiquidar: ['', Validators.required],
      actaConstitutiva: ['', Validators.required],
      ineRepresentanteMoral: ['', Validators.required],
      poderRepresentanteLegal: ['', Validators.required],
      observations: [null]
    });
  }

  public getDocumentation(id: number){
    // console.log(this.data);
    // this.takeInformation.controls['compraGuiaA'].setValue(this.data.tomaAutometrica);
    // this.takeInformation.controls['ventaGuiaA'].setValue(this.data.ventaAutometrica);
    // this.takeInformation.controls['compraIntelimotors'].setValue(this.data.tomaIntelimotors);
    // this.takeInformation.controls['ventaIntelimotors'].setValue(this.data.ventaIntelimotors);
    this.compraGA = this.data.tomaAutometrica;
    this.ventaGA = this.data.ventaAutometrica;
    this.compraTI = this.data.tomaIntelimotors;
    this.ventaTI = this.data.ventaIntelimotors;
    
    this._sellYourCarService.getDocumentation(id)
    .subscribe({
      next: ((resp: GetDocumentation) => {
        if (resp.code === 200 && resp.status === 'success') {

          // this.save_documents = true;

          if (resp.documents !== null) {
            
            if (resp.documents.tenencia_12 == this.tenencia12) {
              this.checkt12 = true;
              this.takeInformation.controls['tenencia_12'].setValue(this.checkt12);
            }else {
              this.checkt12 = false;
              this.takeInformation.controls['tenencia_12'].setValue(this.checkt12);
            }
            
            if (resp.documents.tenencia_11 == this.tenencia11) {
              this.checkt11 = true;
              this.takeInformation.controls['tenencia_11'].setValue(this.checkt11);
            }else {
              this.checkt11 = false;
              this.takeInformation.controls['tenencia_11'].setValue(this.checkt11);
            }
            
            if (resp.documents.tenencia_10 == this.tenencia10) {
              this.checkt10 = true;
              this.takeInformation.controls['tenencia_10'].setValue(this.checkt10);
            }else {
              this.checkt10 = false;
              this.takeInformation.controls['tenencia_10'].setValue(this.checkt10);
            }
            
            if (resp.documents.tenencia_9 == this.tenencia9) {
              this.checkt9 = true;
              this.takeInformation.controls['tenencia_9'].setValue(this.checkt9);
            }else {
              this.checkt9 = false;
              this.takeInformation.controls['tenencia_9'].setValue(this.checkt9);
            }
            
            if (resp.documents.tenencia_8 == this.tenencia8) {
              this.checkt8 = true;
              this.takeInformation.controls['tenencia_8'].setValue(this.checkt8);
            }else {
              this.checkt8 = false;
              this.takeInformation.controls['tenencia_8'].setValue(this.checkt8);
            }
            
            if (resp.documents.tenencia_7 == this.tenencia7) {
              this.checkt7 = true;
              this.takeInformation.controls['tenencia_7'].setValue(this.checkt7);
            }else {
              this.checkt7 = false;
              this.takeInformation.controls['tenencia_7'].setValue(this.checkt7);
            }
            
            if (resp.documents.tenencia_6 == this.tenencia6) {
              this.checkt6 = true;
              this.takeInformation.controls['tenencia_6'].setValue(this.checkt6);
            }else {
              this.checkt6 = false;
              this.takeInformation.controls['tenencia_6'].setValue(this.checkt6);
            }
            
            if (resp.documents.tenencia_5 == this.tenencia5) {
              this.checkt5 = true;
              this.takeInformation.controls['tenencia_5'].setValue(this.checkt5);
            }else {
              this.checkt5 = false;
              this.takeInformation.controls['tenencia_5'].setValue(this.checkt5);
            }
            
            if (resp.documents.tenencia_4 == this.tenencia4) {
              this.checkt4 = true;
              this.takeInformation.controls['tenencia_4'].setValue(this.checkt4);
            }else {
              this.checkt4 = false;
              this.takeInformation.controls['tenencia_4'].setValue(this.checkt4);
            }
            
            if (resp.documents.tenencia_3 == this.tenencia3) {
              this.checkt3 = true;
              this.takeInformation.controls['tenencia_3'].setValue(this.checkt3);
            }else {
              this.checkt3 = false;
              this.takeInformation.controls['tenencia_3'].setValue(this.checkt3);
            }
            
            if (resp.documents.tenencia_2 == this.tenencia2) {
              this.checkt2 = true;
              this.takeInformation.controls['tenencia_2'].setValue(this.checkt2);
            }else {
              this.checkt2 = false;
              this.takeInformation.controls['tenencia_2'].setValue(this.checkt2);
            }
            
            if (resp.documents.tenencia_1 == this.tenencia1) {
              this.checkt1 = true;
              this.takeInformation.controls['tenencia_1'].setValue(this.checkt1);
            }else {
              this.checkt1 = false;
              this.takeInformation.controls['tenencia_1'].setValue(this.checkt1);
            }

            this.takeInformation.patchValue({
              contratoCompraVentaFirmado: resp.documents.contratoCompraVentaFirmado,
              facturaOriginal: resp.documents.facturaOriginal,
              copiaFacturaOrigen: resp.documents.copiaFacturaOrigen,
              copiaFielIne: resp.documents.copiaFielIne,
              curp: resp.documents.curp,
              acuseRespuestaCambioRol: resp.documents.acuseRespuestaCambioRol,
              adeudosTenencia: resp.documents.adeudosTenencia,
              montoAdeudoTenencia: resp.documents.montoAdeudoTenencia,
              tenenciasOriginales: resp.documents.tenenciasOriginales,
              // agnosTenencias: resp.documents.agnosTenencias,
              tarjetaDeCirculacion: resp.documents.tarjetaDeCirculacion,
              copiaGuiaAutometrica: resp.documents.copiaGuiaAutometrica,
              // compraGuiaA: resp.documents.compraGuiaA,
              // ventaGuiaA: resp.documents.ventaGuiaA,
              consultaIntelimotors: resp.documents.consultaIntelimotors,
              // compraIntelimotors: resp.documents.compraIntelimotors,
              // ventaIntelimotors: resp.documents.ventaIntelimotors,
              facturaOriginalFinanciera: resp.documents.facturaOriginalFinanciera,
              verificacionFiscalDeFacturas: resp.documents.verificacionFiscalDeFacturas,
              validacionIne: resp.documents.validacionIne,
              comprobanteDomicilio: resp.documents.comprobanteDomicilio,
              repuve: resp.documents.repuve,
              checklistCienPuntos: resp.documents.checklistCienPuntos,
              copiasFacturasIntermediasConEndoso: resp.documents.copiasFacturasIntermediasConEndoso,
              validacionFacturaParteAgencia: resp.documents.validacionFacturaParteAgencia,
              constanciaSituacionFiscal: resp.documents.constanciaSituacionFiscal,
              cambioRolCdTac: resp.documents.cambioRolCdTac,
              consultaTransunion: resp.documents.consultaTransunion,
              fotomultas: resp.documents.fotomultas,
              montoFotomultas: resp.documents.montoFotomultas,
              pdiCheckBateria: resp.documents.pdiCheckBateria
            });

            this.documentationCar.patchValue({
              manualDelPropietario: resp.documents.manualDelPropietario,
              gato: resp.documents.gato,
              llantaRefaccion: resp.documents.llantaRefaccion,
              antena: resp.documents.antena,
              comprobanteUltimaVerificacion: resp.documents.comprobanteUltimaVerificacion,
              carnetDeServicio: resp.documents.carnetDeServicio,
              maneralOLlaveDeTuercas: resp.documents.maneralOLlaveDeTuercas,
              reflejantes: resp.documents.reflejantes,
              duplicadoDeLlaves: resp.documents.duplicadoDeLlaves,
              bajaDePlacas: resp.documents.bajaDePlacas,
              birlosDeSeguridad: resp.documents.birlosDeSeguridad,
              peliculaDeSeguridad: resp.documents.peliculaDeSeguridad,
              cablesPasaCorriente: resp.documents.cablesPasaCorriente,
              numSerie: resp.documents.numSerie,
              herramienta: resp.documents.herramienta,
              odometroKilometraje: resp.documents.odometroKilometraje,
              manualYPoliza: resp.documents.manualYPoliza,
              llantas: resp.documents.llantas,
              sellosDeServicio: resp.documents.sellosDeServicio,
              unidadFrenteTraseraCostadosCajuelaYCofre: resp.documents.unidadFrenteTraseraCostadosCajuelaYCofre,
              llantaRefaccionFoto: resp.documents.llantaRefaccionFoto,
              fotosEnRampaParteBajaYDagnos: resp.documents.fotosEnRampaParteBajaYDagnos
            });

            this.documentsPlateProcedures.patchValue({
              placasFisicas: resp.documents.placasFisicas,
              pagosCompletosTenencias: resp.documents.pagosCompletosTenencias,
              facturaConEndosos: resp.documents.facturaConEndosos,
              tarjetaDeCirculacionPlates: resp.documents.tarjetaDeCirculacionPlates,
              ineCopiaFiel: resp.documents.ineCopiaFiel,
              edoCtaFinancieraObancoIndicaMontoALiquidar: resp.documents.edoCtaFinancieraObancoIndicaMontoALiquidar,
              actaConstitutiva: resp.documents.actaConstitutiva,
              ineRepresentanteMoral: resp.documents.ineRepresentanteMoral,
              poderRepresentanteLegal: resp.documents.poderRepresentanteLegal,
              observations: resp.documents.observations
            });
            if (resp.documents.path == "") {
              this.btn_load = true;
              this.btn_watch = false;
            }else{
              this.btn_load = true;
              this.btn_watch = true;
            }
          }
        }
      })
    });
  }

  public onSubmit(){
    this.spinnerEnvio = true;
    // this._sellYourCarService.getDocumentation(this.data.checklist_id)
    this._sellYourCarService.getDocumentation(this.data.id)
    .subscribe({
      next: ( { code, status, documents}: GetDocumentation ) => {
        // console.log(documents.id);
        
        if (code === 200 && status === 'success' && documents != null) {
          // this.updateDocumentation(documents.id, this.data.checklist_id);
          this.updateDocumentation(documents.id, this.data.id);
        }else{
          // this.setDocumentation(this.data.checklist_id);
          this.setDocumentation(this.data.id);
        }

      }
    });
  }

  // public updateDocumentation(docuId: number, checkId: number){
  public updateDocumentation(docuId: number, sellyourcarId: number){
    this._valuationFormFroupGeneral = {
      'id': docuId,
      // 'check_list_id': checkId,
      'sell_your_car_id': sellyourcarId,
      ...this.takeInformation.getRawValue(),
      ...this.takeInformation.value,
      'tenencia_12': (this.takeInformation.get('tenencia_12')?.value ? this.tenencia12 : null),
      'tenencia_11': (this.takeInformation.get('tenencia_11')?.value ? this.tenencia11 : null),
      'tenencia_10': (this.takeInformation.get('tenencia_10')?.value ? this.tenencia10 : null),
      'tenencia_9':  (this.takeInformation.get('tenencia_9')?.value ? this.tenencia9 : null),
      'tenencia_8':  (this.takeInformation.get('tenencia_8')?.value ? this.tenencia8 : null),
      'tenencia_7':  (this.takeInformation.get('tenencia_7')?.value ? this.tenencia7 : null),
      'tenencia_6':  (this.takeInformation.get('tenencia_6')?.value ? this.tenencia6 : null),
      'tenencia_5':  (this.takeInformation.get('tenencia_5')?.value ? this.tenencia5 : null),
      'tenencia_4':  (this.takeInformation.get('tenencia_4')?.value ? this.tenencia4 : null),
      'tenencia_3':  (this.takeInformation.get('tenencia_3')?.value ? this.tenencia3 : null),
      'tenencia_2':  (this.takeInformation.get('tenencia_2')?.value ? this.tenencia2 : null),
      'tenencia_1':  (this.takeInformation.get('tenencia_1')?.value ? this.tenencia1 : null),
      // 'compraGuiaA': this.compraGA,
      // 'ventaGuiaA' : this.ventaGA,
      // 'compraIntelimotors': this.compraTI,
      // 'ventaIntelimotors' : this.ventaTI,
      ...this.documentationCar.value,
      ...this.documentsPlateProcedures.value
    }

    this._sellYourCarService.updateDocumentation(docuId, this._valuationFormFroupGeneral)
    .subscribe({
      next: ((resp: StoreDocumentation) => {
        console.log(resp);
        if (resp.code === '200' && resp.status === 'success') {
          this.spinner = false;
          Swal.fire({
            icon: 'success',
            title: 'Registro Modificado',
            text: 'El registro se Modificó con éxito',
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });
        }else {
          Swal.fire({
            icon: 'warning',
            title: 'Oupps...',
            text: 'El registro no pudo modificarse, intenta mas tarde.',
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });
          this.spinner = false;
        }
        // Redirect
        this._router.navigateByUrl('/admin/valuator/vende-tu-auto');
        window.location.reload();
      })
    });
  }

  // public setDocumentation(checkId: number){
  public setDocumentation(sellyourcarId: number){
    this._valuationFormFroupGeneral = {
      // 'check_list_id': checkId,
      'sell_your_car_id': sellyourcarId,
      ...this.takeInformation.value,
      'tenencia_12': (this.takeInformation.get('tenencia_12')?.value ? this.tenencia12 : null),
      'tenencia_11': (this.takeInformation.get('tenencia_11')?.value ? this.tenencia11 : null),
      'tenencia_10': (this.takeInformation.get('tenencia_10')?.value ? this.tenencia10 : null),
      'tenencia_9':  (this.takeInformation.get('tenencia_9')?.value ? this.tenencia9 : null),
      'tenencia_8':  (this.takeInformation.get('tenencia_8')?.value ? this.tenencia8 : null),
      'tenencia_7':  (this.takeInformation.get('tenencia_7')?.value ? this.tenencia7 : null),
      'tenencia_6':  (this.takeInformation.get('tenencia_6')?.value ? this.tenencia6 : null),
      'tenencia_5':  (this.takeInformation.get('tenencia_5')?.value ? this.tenencia5 : null),
      'tenencia_4':  (this.takeInformation.get('tenencia_4')?.value ? this.tenencia4 : null),
      'tenencia_3':  (this.takeInformation.get('tenencia_3')?.value ? this.tenencia3 : null),
      'tenencia_2':  (this.takeInformation.get('tenencia_2')?.value ? this.tenencia2 : null),
      'tenencia_1':  (this.takeInformation.get('tenencia_1')?.value ? this.tenencia1 : null),
      // 'compraGuiaA': this.compraGA,
      // 'ventaGuiaA' : this.ventaGA,
      // 'compraIntelimotors': this.compraTI,
      // 'ventaIntelimotors' : this.ventaTI,
      ...this.documentationCar.value,
      ...this.documentsPlateProcedures.value
    }
    // console.log('Entro a insertar');
    this._sellYourCarService.setDocumentation(this._valuationFormFroupGeneral)
    .subscribe({
      next: ((resp: StoreDocumentation) => {
        // console.log(resp);
        
        if (resp.code === '200' && resp.status === 'success') {
          // console.log(resp.code);
          this.spinner = false;
          Swal.fire({
            icon: 'success',
            title: 'Alta registro',
            text: 'Alta de registro exitoso',
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });
        }else {
          Swal.fire({
            icon: 'warning',
            title: 'Información...',
            text: 'Inserta la info de todos los registros, todos son requeridos.',
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });

          // Change spinner
          this.spinner = false;
        }
        // Redirect
        this._router.navigateByUrl('/admin/valuator/vende-tu-auto');
        window.location.reload();
      })
    });
  }
  /**
   * Upload Documentation  
   */
  public uploadDocument(file: any, document_id: number) {
    this.spinner = true;

    // Set information
    const form = {
      picture: file.target.files[0],
      check_list_id: this.data.checklist_id,
      document_id,
    };

    // Launch request POST
    this._sellYourCarService.postDocument(form).subscribe({
      next: ({ code, status, message }: PostDocumentation) => {
        if (code === '200' && status === 'success') {
          // Alert
          Swal.fire({
            icon: 'success',
            text: message,
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3000
          });

          this.spinner = false;
          
          // Launch again initDocuments()
          // this.initDocuments();
        }
      },
      error: error => {
        this.spinner = false;
        
        // Alert
        Swal.fire({
          icon: 'error',
          text: 'No se pudo subir el documento, por favor intente nuevamente o verifique su información.',
          showConfirmButton: true,
          confirmButtonColor: '#EEB838',
          timer: 3000
        });
      }
    });
  }

  public uploadDocuments(file: any){

    const picture = file.target.files[0];
    // const check_list_id = this.data.checklist_id;
    const sell_your_car_id = this.data.id;

    // Launch request POST
    // this._sellYourCarService.updatePdfDocument(check_list_id, picture)
    this._sellYourCarService.updatePdfDocument(sell_your_car_id, picture)
    .subscribe({
      next: ({ code, status, message }: UpdateDocument) => {
        if (code === '200' && status === 'success') {
          // Alert
          Swal.fire({
            icon: 'success',
            text: message,
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3000
          });

          this.btn_load = true;
          this.btn_watch = true;
          this.spinner = false;
        }
      }, 
      error: (error) => { 
        this.spinner = false;
        
        // Alert
        Swal.fire({
          icon: 'error',
          text: 'No se pudo subir el documento, por favor intente nuevamente o verifique su información.',
          showConfirmButton: true,
          confirmButtonColor: '#EEB838',
          timer: 3000
        });
      }
    });
  }

  /**
   * updateDocument
   */
  public updateDocument(document_id: number, file: any) {
    this.spinner = true;

    const picture = file.target.files[0];

    this._sellYourCarService.updateDocument(document_id, picture)
    .subscribe({
      next: ({ code, status, message }: UpdateDocument) => {
        if (code === '200' && status === 'success') {
          // Alert
          Swal.fire({
            icon: 'success',
            text: message,
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3000
          });

          this.spinner = false;

          // Launch again initDocuments()
          // this.initDocuments();
        }
      },
      error: (error) => {
        // Alert
        Swal.fire({
          icon: 'error',
          text: 'No se pudo actualizar el documento, por favor intente nuevamente o verifique su información.',
          showConfirmButton: true,
          confirmButtonColor: '#EEB838',
          timer: 3000
        });
      }
    });
  }

  /**
   * Close Bottom Sheet
   */
  public closeWindow(){
    this.bottomsheet.dismiss();
  }
  /**
   * Checking exists picture of document
  */  
  /* public getDocumentImagen(check_lists_id: number, document_id: number) {
    this._sellYourCarService.getDocumentImagen(check_lists_id, document_id).subscribe(
      ({ code, status, document_image }: GetDocumentImagen) => {
        if (code === 200 && status === 'success' && document_image !== null) {
          // Find & Set path
          this.documents.map((document, index) => {
            if (document.id === document_image.document_id) {              
              this.documents[index].update_document_id = document_image.id;
              this.documents[index].pathname = document_image.path;
            }
          });
        }        
      }
    );
  } */

}