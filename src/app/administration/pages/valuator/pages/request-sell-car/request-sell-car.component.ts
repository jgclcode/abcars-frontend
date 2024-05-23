import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Angular Material
import { MatBottomSheet } from '@angular/material/bottom-sheet';

// Animations
import Swal from 'sweetalert2';

// Services
import { AppraiserChecklistService } from '../../../appraiser/services/appraiser-checklist.service';
import { PaintingWorksService } from '../../services/painting-works.service';
import { SellYourCarService } from '../../services/sell-your-car.service';
import { SparePartsService } from '../../../spare-parts/services/spare-parts.service';

// Components
import { CheckviewReqservComponent } from '../checkview-reqserv/checkview-reqserv.component';

// Interfaces
import { SellCarValuation } from '../../../appraiser/interfaces/sell-car-valuation.interface';
import { ValuatorChecklist } from '../../../appraiser/interfaces/valuator.checklist.interface';
import { ChecklistValuation } from '../../../appraiser/interfaces/checklist-valuation.interface';
import { GetSpareParts } from '../../../spare-parts/interfaces/spare-parts.interface';
import { SellYourCar } from '../../interfaces/sell-your-car.interface';
import { Updstandbyparts } from '../../interfaces/update-standby-parts.interface';
import { Datum } from '../../interfaces/owned_preowned.interface';

interface Seller {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-request-sell-car',
  templateUrl: './request-sell-car.component.html',
  styles: [`
  ::ng-deep .mat-step-header .mat-step-icon-selected {
    background-color: #707070 !important; 
  }

  ::ng-deep .mat-step-header .mat-step-icon-state-edit {
    background-color: #FFCB54 !important; 
  }

  ::ng-deep .mat-slide-toggle.mat-checked .mat-slide-toggle-bar {
    background-color: #FFCB54 !important;
  }

  ::ng-deep .mat-slide-toggle.mat-checked .mat-slide-toggle-thumb {
    background-color: #707070 !important;
  }

  ::ng-deep textarea.mat-input-element {
    resize: none !important;
  }
  `
  ]
})
export class RequestSellCarComponent implements OnInit {
  @ViewChild('workforce') workforce!:ElementRef<HTMLInputElement>;
  @ViewChild('spare_parts') spare_parts!:ElementRef<HTMLInputElement>;
  @ViewChild('hyp') hyp!:ElementRef<HTMLInputElement>;

  // References Form
  public quotationForm!: UntypedFormGroup;
  private _valuationFormGroupGeneral!: UntypedFormGroup;

  // Reference vin
  public vin!:string;

  // Reference Sell your car
  public sellYourCar_id!: number;

  // Reference id Checklist
  public id!: number;
  public idAll!: number;

  // Reference status Checklist
  public status: string = '';

  // Reference Slide toggle
  public checked   = false;
  public checkedp  = false;
  public checkedt  = false;
  public checkedg  = false;
  public checkedpt = false;
  public sparePartsInactive = true;
  public workforceInactive = true;
  public d = new Date();
  public roleActived: number = 0;
  public actualUser!: any;
  public user_id!: number;
  public inPreparation: string = '';

  public ownedPreowneds: Datum[] = [];

  sellers: Seller[] = [
    {value: 'AGUILAR ALONSO MIGUEL ANGEL ELEAZAR', viewValue: 'AGUILAR ALONSO MIGUEL ANGEL ELEAZAR'},
    {value: 'ALBERTO RIVERA CONTRERAS', viewValue: 'ALBERTO RIVERA CONTRERAS'},
    {value: 'BALLESTEROS GONZALEZ JUAN', viewValue: 'BALLESTEROS GONZALEZ JUAN'},
    {value: 'BARRANCO NAHUACATL EDGAR', viewValue: 'BARRANCO NAHUACATL EDGAR'},
    {value: 'CALDERON ROSAS LUIS MANUEL', viewValue: 'CALDERON ROSAS LUIS MANUEL'},
    {value: 'CALIXTO ROMERO MARCO ANTONIO', viewValue: 'CALIXTO ROMERO MARCO ANTONIO'},
    {value: 'CARDENAS DE LA CERDA CECILIA', viewValue: 'CARDENAS DE LA CERDA CECILIA'},
    {value: 'CAZARES CRUZ AURORA', viewValue: 'CAZARES CRUZ AURORA'},
    {value: 'CHACON OROZCO GABRIEL', viewValue: 'CHACON OROZCO GABRIEL'},
    {value: 'DE BOTTON ORUE FLOR SUSANA', viewValue: 'DE BOTTON ORUE FLOR SUSANA'},
    {value: 'DOMINGUEZ ESCAMILLA EDUARDO GAUDENCIO', viewValue: 'DOMINGUEZ ESCAMILLA EDUARDO GAUDENCIO'},
    {value: 'FLORES VERA CIRILO', viewValue: 'FLORES VERA CIRILO'},
    {value: 'FONSECA FLORES MARIA BELEN', viewValue: 'FONSECA FLORES MARIA BELEN'},
    {value: 'FUENTES FLORES MONSERRAT', viewValue: 'FUENTES FLORES MONSERRAT'},
    {value: 'GOMEZ RAMIREZ JOSE RAMON', viewValue: 'GOMEZ RAMIREZ JOSE RAMON'},
    {value: 'GONZALEZ LEZAMA MARIA FERNANDA', viewValue: 'GONZALEZ LEZAMA MARIA FERNANDA'},
    {value: 'GUILLEN AGUILAR FIDEL EDUARDO', viewValue: 'GUILLEN AGUILAR FIDEL EDUARDO'},
    {value: 'KAREN PADILLA', viewValue: 'KAREN PADILLA'},
    {value: 'HERRERA HERNANDEZ GERARDO', viewValue: 'HERRERA HERNANDEZ GERARDO'},
    {value: 'JIMENEZ GONZALEZ CARLOS', viewValue: 'JIMENEZ GONZALEZ CARLOS'},
    {value: 'LOPEZ ROJAS OMAR', viewValue: 'LOPEZ ROJAS OMAR'},
    {value: 'LUNA AGUILAR HUGO EMILIO', viewValue: 'LUNA AGUILAR HUGO EMILIO'},
    {value: 'MARCIAL OSORIO ALBERTO', viewValue: 'MARCIAL OSORIO ALBERTO'},
    {value: 'MARQUEZ ACOSTA HECTOR ALBERTO', viewValue: 'MARQUEZ ACOSTA HECTOR ALBERTO'},
    {value: 'MENDOZA HERNANDEZ ANGEL', viewValue: 'MENDOZA HERNANDEZ ANGEL'},
    {value: 'PADILLA GONZALEZ KAREN', viewValue: 'PADILLA GONZALEZ KAREN'},
    {value: 'PERALTA DIAZ RAFAEL', viewValue: 'PERALTA DIAZ RAFAEL'},
    {value: 'PEREZ FUENTES CESAR AUGUSTO', viewValue: 'PEREZ FUENTES CESAR AUGUSTO'},
    {value: 'PORTILLO DIAZ DIANA', viewValue: 'PORTILLO DIAZ DIANA'},
    {value: 'RAMIREZ RAMIREZ SALVADOR', viewValue: 'RAMIREZ RAMIREZ SALVADOR'},
    {value: 'ROJAS PORTILLO CARLOS ARIEL', viewValue: 'ROJAS PORTILLO CARLOS ARIEL'},
    {value: 'ROMERO CERON MARCOS', viewValue: 'ROMERO CERON MARCOS'},
    {value: 'ROSALVA SANCHEZ RODRIGUEZ', viewValue: 'ROSALVA SANCHEZ RODRIGUEZ'},
    {value: 'SANCHEZ LOYOLA JESUS RAUL', viewValue: 'SANCHEZ LOYOLA JESUS RAUL'},
    {value: 'TAPIA NOE FABIAN ALONSO', viewValue: 'TAPIA NOE FABIAN ALONSO'},
    {value: 'TORRES CRUZ JORGE AMBROSIO', viewValue: 'TORRES CRUZ JORGE AMBROSIO'},
    {value: 'VAZQUEZ MORALES JORGE LUIS', viewValue: 'VAZQUEZ MORALES JORGE LUIS'},
    {value: 'VIDAL ANDRADE GILBERTO', viewValue: 'VIDAL ANDRADE GILBERTO'},
    {value: 'ZAVALA ACEVEDO JAVIER JESUS', viewValue: 'ZAVALA ACEVEDO JAVIER JESUS'},
    {value: 'MAX JUNCO', viewValue: 'MAX JUNCO'},
    {value: 'ROCIO MARTINEZ', viewValue: 'ROCIO MARTINEZ'},
    {value: 'DANIELA SALINAS', viewValue: 'DANIELA SALINAS'},
    {value: 'ELVIA REYES', viewValue: 'ELVIA REYES'},
    {value: 'NAUHUACATL HERNANDEZ HECTOR URIEL', viewValue: 'NAUHUACATL HERNANDEZ HECTOR URIEL'},
    {value: 'RAMIREZ TORRES JACOB NOEL', viewValue: 'RAMIREZ TORRES JACOB NOEL'},
    {value: 'BARDESI ZAMORA EDUARDO', viewValue: 'BARDESI ZAMORA EDUARDO'},
    {value: 'ALBERTO RIVERA CONTRERAS', viewValue: 'ALBERTO RIVERA CONTRERAS'},
    {value: 'PEREZ HERNANDEZ CARLOS IVAN', viewValue: 'PEREZ HERNANDEZ CARLOS IVAN'},
    {value: 'Alan Cruz Pacheco Jimenez', viewValue: 'Alan Cruz Pacheco Jimenez'},
    {value: 'Juan Luis Ayala Valdez', viewValue: 'Juan Luis Ayala Valdez'},
    {value: 'Rebeca Lopez Rodriguez', viewValue: 'Rebeca Lopez Rodriguez'},
    {value: 'Sergio Saul Trujillo Sanchez', viewValue: 'Sergio Saul Trujillo Sanchez'},
    {value: 'Ramon Uribe Villegas', viewValue: 'Ramon Uribe Villegas'},
    {value: 'Yovana Barquera Cardoso', viewValue: 'Yovana Barquera Cardoso'},
    {value: 'Jorge Fernando Rojas Rosas', viewValue: 'Jorge Fernando Rojas Rosas'},
    {value: 'Shamanta Yanin Jorge Rodriguez', viewValue: 'Shamanta Yanin Jorge Rodriguez'},
    {value: 'Mario Alberto Lopez Soto', viewValue: 'Mario Alberto Lopez Soto'},
    {value: 'Armando Santander Colin', viewValue: 'Armando Santander Colin'},
    {value: 'Enrique Guillermo Garduño Maldonado', viewValue: 'Enrique Guillermo Garduño Maldonado'},
    {value: 'Miguel Angel Peralta Vazquez', viewValue: 'Miguel Angel Peralta Vazquez'},
    {value: 'Erick Christian Rasgado Marroquin', viewValue: 'Erick Christian Rasgado Marroquin'},
    {value: 'Gonzalo Quintana Morales', viewValue: 'Gonzalo Quintana Morales'},
    {value: 'Alejandra Leticia Mendoza Marquez', viewValue: 'Alejandra Leticia Mendoza Marquez'},
    {value: 'Antonio de Jesus Angeles Hernandez', viewValue: 'Antonio de Jesus Angeles Hernandez'},
    {value: 'Maria Ailin Carolina Herrera Hernandez', viewValue: 'Maria Ailin Carolina Herrera Hernandez'},
    {value: 'Kevin Jesus Rojas Navarrete', viewValue: 'Kevin Jesus Rojas Navarrete'},
    {value: 'Israel Rojas Lazcano', viewValue: 'Israel Rojas Lazcano'},
    {value: 'Pablo Isaac Ruiz Herrera', viewValue: 'Pablo Isaac Ruiz Herrera'},
    {value: 'Ernesto Barrera Osorio', viewValue: 'Ernesto Barrera Osorio'},
  ];

  constructor(
    private _router: Router,
    private _formBuilder: UntypedFormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _sparePartsService: SparePartsService,
    private _appraiserChecklistService: AppraiserChecklistService,
    private _sellYourCar: SellYourCarService,
    private _bottomSheet: MatBottomSheet,
    private _paintingWorksService: PaintingWorksService
  ) { 
    this.quotationFormInit();
    this.getChecklistValuation(this._activatedRoute.snapshot.params.id);
    this.getChecklistValuationAll(this._activatedRoute.snapshot.params.id);
    // Check user role
    this.checkUserRole();
  }

  ngAfterViewInit(){
    this.getSpareParts(this._activatedRoute.snapshot.params.id);
  }
  
  ngOnInit(): void {
    // Get vin
    this.idAll = this._activatedRoute.snapshot.params.id;
    this._appraiserChecklistService.getAppraiserChecklist(this._activatedRoute.snapshot.params.id)
    .subscribe({
      next: (resp) => {
        if (resp.sell_car_valuation_id.status !== 'valued' && resp.sell_car_valuation_id.status !== 'ready_to_buy') { /* && resp.sell_car_valuation_id.status !== 'buy' */
          this.getSparePartshours(this._activatedRoute.snapshot.params.id);
          this.getSpareParts(this._activatedRoute.snapshot.params.id);
          this.getBodyworkCost(this._activatedRoute.snapshot.params.id);
        }
      }
    });
    // this.getAppraiserChecklist(this.id);  /* El parámetro era el vin */
    this._appraiserChecklistService.ownedPreowned()
    .subscribe( resp => {
      this.ownedPreowneds = resp.data;
    })
  }

  // Form Quotation points
  get takeInvalid() {
    return this.quotationForm.get('take')!.invalid && (this.quotationForm.get('take')!.dirty || this.quotationForm.get('take')!.touched);
  }

  get saleInvalid() {
    return this.quotationForm.get('sale')!.invalid && (this.quotationForm.get('sale')!.dirty || this.quotationForm.get('sale')!.touched);
  }

  get workforceInvalid() {
    return this.quotationForm.get('workforce')!.invalid && (this.quotationForm.get('workforce')!.dirty || this.quotationForm.get('workforce')!.touched);
  }

  get spare_partsInvalid() {
    return this.quotationForm.get('spare_parts')!.invalid && (this.quotationForm.get('spare_parts')!.dirty || this.quotationForm.get('spare_parts')!.touched);
  }

  get hypInvalid() {
    return this.quotationForm.get('hyp')!.invalid && (this.quotationForm.get('hyp')!.dirty || this.quotationForm.get('hyp')!.touched);
  }

  get take_valueInvalid() {
    return this.quotationForm.get('take_value')!.invalid && (this.quotationForm.get('take_value')!.dirty || this.quotationForm.get('take_value')!.touched);
  }
  
  get final_offerInvalid() {
    return this.quotationForm.get('final_offer')!.invalid && (this.quotationForm.get('final_offer')!.dirty || this.quotationForm.get('final_offer')!.touched);
  }
  
  get new_offerInvalid() {
    return this.quotationForm.get('new_offer')!.invalid && (this.quotationForm.get('new_offer')!.dirty || this.quotationForm.get('new_offer')!.touched);
  }
  
  get takeIntelimotorsInvalid() {
    return this.quotationForm.get('take_intelimotors')!.invalid && (this.quotationForm.get('take_intelimotors')!.dirty || this.quotationForm.get('take_intelimotors')!.touched);
  }

  get saleIntelimotorsInvalid() {
    return this.quotationForm.get('sale_intelimotors')!.invalid && (this.quotationForm.get('sale_intelimotors')!.dirty || this.quotationForm.get('sale_intelimotors')!.touched);
  }

  /* get name_technicalInvalid() {
    return this.quotationForm.get('name_technical')!.invalid && (this.quotationForm.get('name_technical')!.dirty || this.quotationForm.get('name_technical')!.touched);
  }

  get name_managerInvalid() {
    return this.quotationForm.get('name_manager')!.invalid && (this.quotationForm.get('name_manager')!.dirty || this.quotationForm.get('name_manager')!.touched);
  }

  get name_appraiserInvalid() {
    return this.quotationForm.get('name_appraiser')!.invalid && (this.quotationForm.get('name_appraiser')!.dirty || this.quotationForm.get('name_appraiser')!.touched);
  } */

  get sellerInvalid() {
    return this.quotationForm.get('seller')!.invalid && (this.quotationForm.get('seller')!.dirty || this.quotationForm.get('seller')!.touched);
  }

  private quotationFormInit(){
    this.quotationForm = this._formBuilder.group({
      take: [0, Validators.required],
      sale: [0, Validators.required],
      take_intelimotors: [0, Validators.required],
      sale_intelimotors: [0, Validators.required],
      workforce: [0, [Validators.required, Validators.pattern("[0-9\.]{1,7}")]],
      spare_parts: [0, [Validators.required, Validators.pattern("[0-9\.]{1,7}")]],
      hyp: [0, [Validators.required, Validators.pattern("[0-9\.]{1,7}")]],
      total: [0], /* , Validators.required */
      take_value: [0, Validators.required],
      final_offer: [0, Validators.required],
      new_offer: [0], /* Validators.required */
      comments: [''],
      warranty_manual: [],
      direct_purchase: [],
      take_into_account: [],
      valid_warranty: [],
      direct_purchase_take_account: [],
      /* name_technical: ['awdaw', Validators.required],
      name_manager: ['Juan Pérez Uno', Validators.required],
      name_appraiser: ['Juan Pérez Dos', Validators.required] */
      seller: ['', Validators.required],
      ownedPreowned: ['']
    });
  }

  private checkUserRole(){
    this.actualUser = JSON.parse(localStorage.getItem('user')!);

    switch (this.actualUser.role) {
      case 'valuator':
        this.roleActived = 1;
        break;
    
      case 'spare_parts_manager':
        this.roleActived = 2;
        break;
    }

  }

  public getSparePartshours(id: number){
    this._sparePartsService.getSparePartsBySell(id)
    .subscribe({
      next: (resp) => {
        let sum = 0;
        resp.spare_parts.map(sp => {
          if (sp.status === 'approved') {
            sum += sp.hours;
          }
          if (sp.status === 'on hold') {
            sum += sp.hours;
          }
        });
        // Set new values in quotation form
        if (resp.distributor[0].distributor === 'Vecsa pachuca') {
          this.quotationForm.controls['workforce'].setValue(Number(sum * 45).toFixed(2));
        }else{
          this.quotationForm.controls['workforce'].setValue(Number(sum * 45).toFixed(2));
        }
        /* this.quotationForm.patchValue({
          ...this.quotationForm,
          workforce: (sum * 45)
        }); */
        this.onCotizacion();
      }
    });
  }

  public getBodyworkCost(id: number){
    this._paintingWorksService.getPaintingWorks(id)
    .subscribe({
      next: resp => {
        let sum = 0;
        resp.painting_works.map(pw => {
          if (pw.status === 'approved') {
            sum += pw.amount;
          }
          if (pw.status === 'on hold') {
            sum += pw.amount;
          }
        });
        // Set new values in quotation form
        this.quotationForm.controls['hyp'].setValue(sum);
        this.onCotizacion();
        let theDay = this.getToday(this.d.getDay());
        if (theDay === 'Domingo') {
          this.sparePartsInactive = false;
          this.workforceInactive = false;
        }
      }
    });
  }

  public getToday(day: number){
    let weekDay = new Array(7);
    weekDay[0] = 'Domingo';
    weekDay[1] = 'Lunes';
    weekDay[2] = 'Martes';
    weekDay[3] = 'Miércoles';
    weekDay[4] = 'Jueves';
    weekDay[5] = 'Viernes';
    weekDay[6] = 'Sábado';
    return weekDay[day];
  }

  public getSpareParts(id: number) {
    this._sparePartsService.getSparePartsBySell(id)
    .subscribe({
      next: ({ code, status, spare_parts }: GetSpareParts) => {
        if (code === 200 && status === 'success') {
          // Iterator spare_parts
          let numbers = new Array();
          let productPriceAmount = 0;

          spare_parts.map(spare => {
            if (spare.status === 'approved') {
              this.sparePartsInactive = true;
              switch (spare.type_part) {
                case 'original':
                  productPriceAmount = (spare.priceOriginal * spare.amount);
                  numbers.push(productPriceAmount);
                break;

                case 'generic':
                  productPriceAmount = (spare.priceGeneric * spare.amount);
                  numbers.push(productPriceAmount);
                break;

                case 'used':
                  productPriceAmount = (spare.priceUsed * spare.amount);
                  numbers.push(productPriceAmount);
                break;
              }
            }

            if (spare.status === 'on hold') {
              this.sparePartsInactive = false;
            }
          })

          const total = numbers.reduce((total, current) => total + current, 0)

          // Set new value of total spare_parts
          this.quotationForm.controls['spare_parts'].setValue(total);
        }
      }
    });
  }

  public getAppraiserChecklist(vin: number){  /* El parámetro era del tipo string */
    // this._appraiserChecklistService.getAppraiserChecklist(vin).subscribe(
    //   ({ code, status, sell_car_valuation_id }: SellCarValuation ) => {
    //     if (code === 200 && status === 'success') {
    //       this.sellYourCar_id = sell_car_valuation_id.id;
    //     }
    //   }
    // );
  }

  public getChecklistValuation(vin: string){
    this._appraiserChecklistService.getChecklistValuation(vin)
    .subscribe({
      next: ({ code, status, DataChecklist }: ChecklistValuation ) => {
        if (code === '200' && status === 'success') {
          if (DataChecklist.status !== 'rejected' && DataChecklist.status !== 'bought') {
            
            if (DataChecklist.warranty_manual == 'yes') {
              this.checked = true;   
              this.quotationForm.controls['warranty_manual'].setValue(this.checked);
            }else{
              this.checked = false;
              this.quotationForm.controls['warranty_manual'].setValue(this.checked);
            }

            if (DataChecklist.direct_purchase == 'yes') {
              this.checkedp = true;
              this.quotationForm.controls['direct_purchase'].setValue(this.checkedp);
            }else{
              this.checkedp = false;
              this.quotationForm.controls['direct_purchase'].setValue(this.checkedp);
            }

            if (DataChecklist.take_into_account == 'yes') {
              this.checkedt = true;
              this.quotationForm.controls['take_into_account'].setValue(this.checkedt);
            } else {
              this.checkedt = false;
              this.quotationForm.controls['take_into_account'].setValue(this.checkedt);
            }

            if (DataChecklist.valid_warranty == 'yes') {
              this.checkedg = true;
              this.quotationForm.controls['valid_warranty'].setValue(this.checkedg)
            } else {
              this.checkedg = false;
              this.quotationForm.controls['valid_warranty'].setValue(this.checkedg);
            }
            
            if (DataChecklist.direct_purchase_take_account == 'yes') {
              this.checkedpt = true;
              this.quotationForm.controls['direct_purchase_take_account'].setValue(this.checkedpt)
            } else {
              this.checkedpt = false;
              this.quotationForm.controls['direct_purchase_take_account'].setValue(this.checkedpt);
            }

            this.quotationForm.patchValue({
              take: DataChecklist.take,
              sale: DataChecklist.sale,
              take_intelimotors: DataChecklist.take_intelimotors,
              sale_intelimotors: DataChecklist.sale_intelimotors,
              workforce: DataChecklist.workforce,
              spare_parts: DataChecklist.spare_parts,
              hyp: DataChecklist.hyp,
              total: DataChecklist.total,
              take_value: DataChecklist.take_value,
              final_offer: DataChecklist.final_offer,
              new_offer: DataChecklist.new_offer,
              comments: DataChecklist.comments,
              /* name_technical: DataChecklist.name_technical,
              firm_technical: DataChecklist.firm_technical,
              name_manager: DataChecklist.name_manager,
              firm_manager: DataChecklist.firm_manager,
              name_appraiser: DataChecklist.name_appraiser,
              firm_appraiser: DataChecklist.firm_appraiser */
              seller: DataChecklist.seller,
              ownedPreowned: DataChecklist.ownedPreowned
            });
            
          } else {
            
            this.quotationForm.patchValue({
              take: DataChecklist.take,
              sale: DataChecklist.sale,
              take_intelimotors: DataChecklist.take_intelimotors,
              sale_intelimotors: DataChecklist.sale_intelimotors,
              workforce: DataChecklist.workforce,
              spare_parts: DataChecklist.spare_parts,
              hyp: DataChecklist.hyp,
              total: DataChecklist.total,
              take_value: DataChecklist.take_value,
              final_offer: DataChecklist.final_offer,
              new_offer: DataChecklist.new_offer,
              comments: DataChecklist.comments
             /*  name_technical: DataChecklist.name_technical,
              firm_technical: DataChecklist.firm_technical,
              name_manager: DataChecklist.name_manager,
              firm_manager: DataChecklist.firm_manager,
              name_appraiser: DataChecklist.name_appraiser,
              firm_appraiser: DataChecklist.firm_appraiser */
            });

            this.quotationForm.controls['take'].disable();
            this.quotationForm.controls['sale'].disable();
            this.quotationForm.controls['take_intelimotors'].disable();
            this.quotationForm.controls['sale_intelimotors'].disable();
            this.quotationForm.controls['workforce'].disable();
            this.quotationForm.controls['spare_parts'].disable();
            this.quotationForm.controls['hyp'].disable();
            this.quotationForm.controls['total'].disable();
            this.quotationForm.controls['take_value'].disable();
            this.quotationForm.controls['final_offer'].disable();
            this.quotationForm.controls['new_offer'].disable();
            this.quotationForm.controls['comments'].disable();
            this.quotationForm.controls['warranty_manual'].disable();
            this.quotationForm.controls['direct_purchase'].disable();
            this.quotationForm.controls['take_into_account'].disable();
            this.quotationForm.controls['valid_warranty'].disable();
            this.quotationForm.controls['direct_purchase_take_account'].disable();
            /* this.quotationForm.controls['name_technical'].disable();
            this.quotationForm.controls['name_manager'].disable();
            this.quotationForm.controls['name_appraiser'].disable(); */
            
          }
        }
      }, 
      error: (error) => {
        // console.log(error);
        this.onSubmit();
      }
    });
  }

  public getChecklistValuationAll(id: string) {
    this._appraiserChecklistService.getChecklistValuationall(id)
    .subscribe({
      next: (resp) => {
        if (resp === 1) {
          // console.log('Pasa si es true');
          /* this.status = 'valued_standBy_parts';
          this.updateStandByParts(Number(id)); */
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oupps...',
            text: 'La valuación para éste auto no se ha realizado.',
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });

          // Redirect
          this._router.navigateByUrl('/admin/valuator/vende-tu-auto');
        }
      }
    });
  }

  // Evento Cotización
  public onCotizacion(){
    let totalReacondiciona = 0;
    // Suma de las entradas de la cotización
    let input = this.workforce.nativeElement.value;
    let input2 = this.spare_parts.nativeElement.value;
    let input3 = this.hyp.nativeElement.value;
    totalReacondiciona = parseFloat(input) + parseFloat(input2) + parseFloat(input3);

    // Set new values in quotation form
    this.quotationForm.controls['total'].setValue(totalReacondiciona);
  }

  // Submit Form
  public onSubmit(){
    // this._appraiserChecklistService.getChecklistAppraiser().subscribe(
    //   ({ code, status, Check_List }: ValuatorChecklist) => {
    //     // Busca el id dentro del arreglo.
    //     const find = Check_List.data.some(cl => cl.sell_your_car_id == this.idAll); /* cl.id */
    //     if (code == '200' && status == 'success') {
    //         // Si es true, actualiza el checklist
    //       if (find) {
    //         // Buscamos y filtramos el checklist solo para obtener el objeto deseado.
    //         const check = Check_List.data.filter(cl => cl.sell_your_car_id == this.idAll); /* cl.id */
    //         this.id = check[0].id;
    //         // check role and response
    //         switch (this.actualUser.role) {
    //           case 'valuator':
    //             this.user_id = this.actualUser.id;
    //             this.inPreparation = 'yes';
    //             this.updateUserId(this.id);
    //             this.status = 'valued';
    //             this.updateChecklist(this.id, this.idAll);
    //             break;
              
    //           case 'spare_parts_manager':
    //             this.status = 'buy_offer';
    //             this.updateChecklist(this.id, this.idAll);
    //             break;
    //         }

    //       } else {
    //         Swal.fire({
    //           icon: 'error',
    //           title: 'Oupps...',
    //           text: 'La valuación para éste auto no se ha realizado.',
    //           showConfirmButton: true,
    //           confirmButtonColor: '#EEB838',
    //           timer: 3500
    //         });

    //         // Redirect
    //         switch (this.roleActived) {
    //           case 1:
    //             this._router.navigateByUrl('/admin/valuator/vende-tu-auto');
    //             break;
              
    //           case 2:
    //             this._router.navigateByUrl('/admin/pmanager/vehicles');
    //             break;
                
    //         }
    //       }
    //     }
    //   }
    // );

    this._appraiserChecklistService.getChecklistValuation(this._activatedRoute.snapshot.params.id)
    .subscribe({
      next: ({ DataChecklist }: ChecklistValuation ) => {
        // console.log(DataChecklist.id);
        this.id = DataChecklist.id;
        // check role and response
        switch (this.actualUser.role) {
          case 'valuator':
            this.user_id = this.actualUser.id;
            this.inPreparation = 'yes';
            this.updateUserId(this.id);
            this.status = 'valued';
            this.updateChecklist(this.id, this.idAll);
            break;
          case 'spare_parts_manager':
            this.status = 'pre_preparation';
            this.updateChecklist(this.id, this.idAll);
            break;
        }
      }
    });
  }

  public updateUserId(id: number){
    this._sellYourCar.updateStatusReject(id, { preparation: this.inPreparation, user_id: this.user_id} )
    .subscribe({
      next: (resp) => {
        if (resp.code === '200' && resp.status === 'success') {
          let message = 'Se insertó el user_id';
        }
      }
    });
  }

  public updateChecklist(id: number, sellYourCarId: number){

    this._sellYourCar.updateStatusStandByParts(sellYourCarId, { status: this.status})
    .subscribe({
      next: (resp: Updstandbyparts) => {
        if (resp.code === '200' && resp.status === 'success') {
          let message = 'El status cambió a valued || status cambió a buy_offer';
        }
      }
    });

    this._valuationFormGroupGeneral = {
      'id': id,
      'sell_your_car_id': sellYourCarId,
      // 'status': this.status,
      ...this.quotationForm.value,
      'warranty_manual': (this.quotationForm.get('warranty_manual')?.value) ? 'yes' : 'no',
      'direct_purchase': (this.quotationForm.get('direct_purchase')?.value) ? 'yes' : 'no',
      'take_into_account': (this.quotationForm.get('take_into_account')?.value) ? 'yes' : 'no',
      'valid_warranty': (this.quotationForm.get('valid_warranty')?.value) ? 'yes' : 'no',
      'direct_purchase_take_account': (this.quotationForm.get('direct_purchase_take_account')?.value) ? 'yes' : 'no',
      'seller': this.quotationForm.get('seller')?.value,
      'ownedPreowned': this.quotationForm.get('ownedPreowned')?.value
    };

    this._sellYourCar.updateQuotationSell(id, this._valuationFormGroupGeneral)
    .subscribe({
      next: (resp: ValuatorChecklist) => {
        
        if (resp.code === '200' && resp.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Alta registro',
            text: 'Alta de registro exitoso',
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oupps...',
            text: 'Inserta la info de todos los registros, todos son requeridos.',
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          })
        }

        // Redirect
        switch (this.roleActived) {
          case 1:
            this._router.navigateByUrl('/admin/valuator/vende-tu-auto');
            break;
        
          case 2:
            this._router.navigateByUrl('/admin/pmanager/vehicles');
            break;
        }
      }
    });
  }

  /**
   * Checking length input
   * @param object any input
   */
  public maxLengthCheck(object: any) {
    if (object.value.length > object.maxLength) {
      object.value = object.value.slice(0, object.maxLength)
    }
  }

  // Open Bottom Sheet
  // public openBottomSheet(){
  //   this._appraiserChecklistService.getChecklistAppraiser().subscribe(
  //     ({ code, status, Check_List }: ValuatorChecklist) => {
  //       const find = Check_List.data.some(cl => cl.sell_your_car_id === this.sellYourCar_id); /* cl.id */
  //       if (code == '200' && status == 'success') {
  //         if (find) {
  //           this._bottomSheet.open(CheckviewReqservComponent, {
  //             data: { id: this.vin}
  //           });
  //         } else {
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Oupps...',
  //             text: 'La valuación para éste auto no se ha realizado.'
  //           });
  //         }
  //       }
  //     }
  //   );
    
  // }

  public openBottomSheetRating(){
    this._sellYourCar.getSellYourCarRequets()
    .subscribe({
      next: (resp) => {
        /* console.log(resp.sell_your_car);
        console.log(this.idAll); */
        const find = resp.sell_your_car.data.filter(syc => syc.id == this.idAll);
        this.vin = find[0].vin;
        // console.log(this.vin);
      }
    });

    this._appraiserChecklistService.getChecklistValuationall(String(this.idAll))
    .subscribe({
      next: (resp) => {
        if (resp === 1) {
          this._bottomSheet.open(CheckviewReqservComponent, {
            data: { id: this.idAll, vin: this.vin }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oupps...',
            text: 'La valuación para éste auto no se ha realizado.',
            confirmButtonColor: '#EEB838',
          });
        }
      }
    });
  }

}
