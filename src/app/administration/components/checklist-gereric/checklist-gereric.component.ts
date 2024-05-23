import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';

// Pipes
import { DatePipe } from '@angular/common';

// Services
import { VendeTuAutoService } from 'src/app/dashboard/pages/vender-autos/services/vende-tu-auto.service';
import { AppraiserChecklistService } from '../../pages/appraiser/services/appraiser-checklist.service';
import { SellYourCarService } from '../../pages/valuator/services/sell-your-car.service';

// Interfaces
import { Branch, Brands } from 'src/app/dashboard/pages/vender-autos/interfaces/vende-tu-auto.interface';
import { DataModels, Model } from 'src/app/dashboard/pages/comprar-autos/interfaces/compra-tu-auto/data_models.interface';
import { ForeingReview } from '../../../dashboard/pages/vender-autos/interfaces/get-foreign-review-by-sell-your-car-id.interface';
import { SellCarValuation } from '../../pages/appraiser/interfaces/sell-car-valuation.interface';
import { ValuatorChecklist } from '../../pages/appraiser/interfaces/valuator.checklist.interface';
import { Technician } from '../../pages/appraiser/interfaces/technician.interface';
import { MechanicElectric } from '../../interfaces/mechanic-electric.interface';
import { MechanicalElectric } from '../../interfaces/mechanical-electric.interface';
import { IntReview } from '../../pages/appraiser/interfaces/int-review.interface';
import { InteriorReview } from '../../pages/appraiser/interfaces/interior-review.interface';
import { CertificationVeh } from '../../pages/appraiser/interfaces/certification-veh.interface';
import { CertificationVehicle } from '../../pages/appraiser/interfaces/certification-vehicle.interface';
import { DataChecklist, ChecklistValuation } from '../../pages/appraiser/interfaces/checklist-valuation.interface';
import { UpdateStatusAll } from '../../pages/appraiser/interfaces/update-status-all.interface';
import { Updstandbyparts } from '../../pages/valuator/interfaces/update-standby-parts.interface';
import { GetAppraiserTechnicians, AppraiserTechnician } from '../../../dashboard/pages/vender-autos/interfaces/get-appraiser-technicians.interface';

// Animations
import Swal, { SweetAlertIcon } from 'sweetalert2';

// Components
import { RevisionExternalPictureComponent } from '../../pages/appraiser-technician/components/revision-external-picture/revision-external-picture.component';
import { SparePartsComponent } from '../../pages/appraiser-technician/components/spare-parts/spare-parts.component';
import { RevisionInternalPictureComponent } from '../../pages/appraiser-technician/components/revision-internal-picture/revision-internal-picture.component';
import { PaintingWorksComponent } from '../../pages/valuator/components/painting-works/painting-works.component';

@Component({
  selector: 'app-checklist-gereric',
  templateUrl: './checklist-gereric.component.html',
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
  ],
  providers: [
    DatePipe
  ]
})

export class ChecklistGerericComponent implements OnInit {
  @ViewChild('inputdate') inputdate!: ElementRef<HTMLInputElement>;
  @ViewChild('dateLastMaintenance') dateLastMaintenance!: ElementRef<HTMLInputElement>;

  // References
  public spinner: boolean = false;
  public extReviewSpinner:boolean = false;
  public roleActived: number = 0;
  public statuSelect: string = '';
  public myIdTechnician!: number;

  public _localS: any;
  public technician_id!: number;
  public id!: number;
  public user_id: number = 0;
  public inPreparation: string = '';
  public idIntRev!: number;
  public idCert!: number;
  public idMechanicElec!: number;

  // References Form
  public generalDataForm!: UntypedFormGroup;
  public extReviewForm!: UntypedFormGroup;
  public intReviewForm!: UntypedFormGroup;
  public mechanicElectricForm!: UntypedFormGroup;
  public vehicleCertificationForm!: UntypedFormGroup;

  private _valuationFormFroupGeneral!: UntypedFormGroup;

  // References Arrays
  public brands: Branch[] = [];
  public appraiserTechnicians: AppraiserTechnician[] = [];
  public models: Model[] = [];
  public years: number[] = [];

  // Reference Slide toggle
  public checked = false;
  public checkedp = true;
  public checkedt = false;
  public checkedg = false;
  public checkedpt = false;

  public sell_your_car_id!:number;
  public foreingReview:ForeingReview | null = null;
  public existsForeingReview:boolean = false;
  public invalidFields:boolean = false;
  public dataExt:boolean = false;
  public save_update:boolean = false;
  public saveUpdateCert:boolean = false;
  public saveUpdateMech:boolean = false;
  public vesumo:boolean = false;
  public btn_follow:boolean = false;
  public btn_save:boolean = true;

  constructor(
    private _router: Router,
    private _sellYourCar: SellYourCarService,
    private _venderTuAutoService: VendeTuAutoService,
    private _formBuilder: UntypedFormBuilder,
    private _bottomSheet: MatBottomSheet,
    private _activatedRoute: ActivatedRoute,
    private _appraiserChecklistService: AppraiserChecklistService
  ) {
    // Initialization of Form
    this.generalDataFormInit();
    this.extRevFormInit();
    this.intRevFormInit();
    this.mechanicElectricFormInit();
    this.vehicleCertificationFormInit();

    if (localStorage.getItem('user')) {
      this._localS = JSON.parse(localStorage.getItem('user')!);
    }

    // Checking role user for show mat-steps
    this.checkRoleUserForSteps();

    this.getChecklist(this._activatedRoute.snapshot.params.sell_your_car_id);
    this.getClientVehicle(this._activatedRoute.snapshot.params.sell_your_car_id);
    this.getMechanicElectric(this._activatedRoute.snapshot.params.sell_your_car_id);
    this.getInteriorReview(this._activatedRoute.snapshot.params.sell_your_car_id);
    this.getVehicleCertification(this._activatedRoute.snapshot.params.sell_your_car_id);
  }

  ngOnInit(): void {
    // Calling the initial functions of the form
    this.getBrands();
    this.getAppraiserTechnicians();

    // Years of vehicles allowed
    let year = new Date().getFullYear()+1;
    for (let i = year; i > year-23; i--) {
      this.years.push(i);
    }

    // obtener sell_your_car_id
    this._activatedRoute.params.subscribe(params => {
      if( params['sell_your_car_id'] != undefined ){
        this.sell_your_car_id = +params['sell_your_car_id'];
        this.extReviewForm.patchValue({
          condition: 'no',
          sell_your_car_id: this.sell_your_car_id
        });
        this.vehicleHasModifications();
        this.getForeingReview();
      }
    });
  }

  get nameInvalid() {
    return this.generalDataForm.get('name')!.invalid && (this.generalDataForm.get('name')!.dirty || this.generalDataForm.get('name')!.touched);
  }

  get surnameInvalid() {
    return this.generalDataForm.get('surname')!.invalid && (this.generalDataForm.get('surname')!.dirty || this.generalDataForm.get('surname')!.touched);
  }

  get phoneLength() {
    let phone = this.generalDataForm.get('phone')!.value;
    return this.generalDataForm.get('phone')!.touched && (phone.length < 10 || phone.length > 10);
  }

  get distributorInvalid() {
    return this.generalDataForm.get('distributor')!.invalid && (this.generalDataForm.get('distributor')!.dirty || this.generalDataForm.get('distributor')!.touched);
  }

  get origincountryInvalid() {
    return this.generalDataForm.get('origin_country')!.invalid && (this.generalDataForm.get('origin_country')!.dirty || this.generalDataForm.get('origin_country')!.touched);
  }

  get transmissionInvalid() {
    return this.generalDataForm.get('transmission')!.invalid && (this.generalDataForm.get('transmission')!.dirty || this.generalDataForm.get('transmission')!.touched);
  }

  get enginesuctionInvalid() {
    return this.generalDataForm.get('engine_suction')!.invalid && (this.generalDataForm.get('engine_suction')!.dirty || this.generalDataForm.get('engine_suction')!.touched);
  }

  get startstopInvalid() {
    return this.generalDataForm.get('start_stop')!.invalid && (this.generalDataForm.get('start_stop')!.dirty || this.generalDataForm.get('start_stop')!.touched);
  }

  get dateInvalid() {
    return this.generalDataForm.get('valuation_date')!.invalid && (this.generalDataForm.get('valuation_date')!.dirty || this.generalDataForm.get('valuation_date')!.touched);
  }

  get vinInvalid() {
    return this.generalDataForm.get('vin')!.invalid && (this.generalDataForm.get('vin')!.dirty || this.generalDataForm.get('vin')!.touched);
  }

  get versionInvalid() {
    return this.generalDataForm.get('version')!.invalid && (this.generalDataForm.get('version')!.dirty || this.generalDataForm.get('version')!.touched);
  }

  get mileageInvalid() {
    return this.generalDataForm.get('mileage')!.invalid && (this.generalDataForm.get('mileage')!.dirty || this.generalDataForm.get('mileage')!.touched);
  }

  get colorInvalid() {
    return this.generalDataForm.get('color')!.invalid && (this.generalDataForm.get('color')!.dirty || this.generalDataForm.get('color')!.touched);
  }

  get cylinderInvalid() {
    return this.generalDataForm.get('cilindres')!.invalid && (this.generalDataForm.get('cilindres')!.dirty || this.generalDataForm.get('cilindres')!.touched);
  }

  get engineInvalid() {
    return this.generalDataForm.get('engine_type')!.invalid && (this.generalDataForm.get('engine_type')!.dirty || this.generalDataForm.get('engine_type')!.touched);
  }

  // Vehicle Getters
  get brandInvalid() {
    return this.generalDataForm.get('brand')!.invalid && (this.generalDataForm.get('brand')!.dirty || this.generalDataForm.get('brand')!.touched);
  }

  get modelInvalid() {
    return this.generalDataForm.get('model')!.invalid && (this.generalDataForm.get('model')!.dirty || this.generalDataForm.get('model')!.touched);
  }

  get yearInvalid() {
    return this.generalDataForm.get('year')!.invalid && (this.generalDataForm.get('year')!.dirty || this.generalDataForm.get('year')!.touched);
  }

  get appraiserTechnicianInvalid() {
    return this.generalDataForm.get('appraiserTechnician')!.invalid && (this.generalDataForm.get('appraiserTechnician')!.dirty || this.generalDataForm.get('appraiserTechnician')!.touched);
  }

  // Form points Exterior revision
  public reqDisabled( val:string ): boolean {
    return false; //this.extReviewForm.get(val)!.value != 'a2' && this.dataExt;
  }

  get conditionInvalid() {
    return this.extReviewForm.get('condition')!.invalid && (this.extReviewForm.get('condition')!.dirty || this.extReviewForm.get('condition')!.touched);
  }

  get req1Invalid() {
    return this.extReviewForm.get('req1')!.invalid && (this.extReviewForm.get('req1')!.dirty || this.extReviewForm.get('req1')!.touched);
  }

  get req2Invalid() {
    return this.extReviewForm.get('req2')!.invalid && (this.extReviewForm.get('req2')!.dirty || this.extReviewForm.get('req2')!.touched);
  }

  get req3Invalid() {
    return this.extReviewForm.get('req3')!.invalid && (this.extReviewForm.get('req3')!.dirty || this.extReviewForm.get('req3')!.touched);
  }

  get req4Invalid() {
    return this.extReviewForm.get('req4')!.invalid && (this.extReviewForm.get('req4')!.dirty || this.extReviewForm.get('req4')!.touched);
  }

  get req5Invalid() {
    return this.extReviewForm.get('req5')!.invalid && (this.extReviewForm.get('req5')!.dirty || this.extReviewForm.get('req5')!.touched);
  }

  get req6Invalid() {
    return this.extReviewForm.get('req6')!.invalid && (this.extReviewForm.get('req6')!.dirty || this.extReviewForm.get('req6')!.touched);
  }

  get req7Invalid() {
    return this.extReviewForm.get('req7')!.invalid && (this.extReviewForm.get('req7')!.dirty || this.extReviewForm.get('req7')!.touched);
  }

  get req8Invalid() {
    return this.extReviewForm.get('req8')!.invalid && (this.extReviewForm.get('req8')!.dirty || this.extReviewForm.get('req8')!.touched);
  }

  get req9Invalid() {
    return this.extReviewForm.get('req9')!.invalid && (this.extReviewForm.get('req9')!.dirty || this.extReviewForm.get('req9')!.touched);
  }

  get req10Invalid() {
    return this.extReviewForm.get('req10')!.invalid && (this.extReviewForm.get('req10')!.dirty || this.extReviewForm.get('req10')!.touched);
  }

  get req11Invalid() {
    return this.extReviewForm.get('req11')!.invalid && (this.extReviewForm.get('req11')!.dirty || this.extReviewForm.get('req11')!.touched);
  }

  get req12Invalid() {
    return this.extReviewForm.get('req12')!.invalid && (this.extReviewForm.get('req12')!.dirty || this.extReviewForm.get('req12')!.touched);
  }

  get req13Invalid() {
    return this.extReviewForm.get('req13')!.invalid && (this.extReviewForm.get('req13')!.dirty || this.extReviewForm.get('req13')!.touched);
  }

  get req14Invalid() {
    return this.extReviewForm.get('req14')!.invalid && (this.extReviewForm.get('req14')!.dirty || this.extReviewForm.get('req14')!.touched);
  }

  get req15Invalid() {
    return this.extReviewForm.get('req15')!.invalid && (this.extReviewForm.get('req15')!.dirty || this.extReviewForm.get('req15')!.touched);
  }

  get req16Invalid() {
    return this.extReviewForm.get('req16')!.invalid && (this.extReviewForm.get('req16')!.dirty || this.extReviewForm.get('req16')!.touched);
  }

  get req17Invalid() {
    return this.extReviewForm.get('req17')!.invalid && (this.extReviewForm.get('req17')!.dirty || this.extReviewForm.get('req17')!.touched);
  }

  get req18Invalid() {
    return this.extReviewForm.get('req18')!.invalid && (this.extReviewForm.get('req18')!.dirty || this.extReviewForm.get('req18')!.touched);
  }

  get req19Invalid() {
    return this.extReviewForm.get('req19')!.invalid && (this.extReviewForm.get('req19')!.dirty || this.extReviewForm.get('req19')!.touched);
  }

  get req20Invalid() {
    return this.extReviewForm.get('req20')!.invalid && (this.extReviewForm.get('req20')!.dirty || this.extReviewForm.get('req20')!.touched);
  }

  get req21Invalid() {
    return this.extReviewForm.get('req21')!.invalid && (this.extReviewForm.get('req21')!.dirty || this.extReviewForm.get('req21')!.touched);
  }

  get req22Invalid() {
    return this.extReviewForm.get('req22')!.invalid && (this.extReviewForm.get('req22')!.dirty || this.extReviewForm.get('req22')!.touched);
  }

  // Form points Interior revision

  get iq1Invalid() {
    return this.intReviewForm.get('iq1')!.invalid && (this.intReviewForm.get('iq1')!.dirty || this.intReviewForm.get('iq1')!.touched);
  }

  get iq2Invalid() {
    return this.intReviewForm.get('iq2')!.invalid && (this.intReviewForm.get('iq2')!.dirty || this.intReviewForm.get('iq2')!.touched);
  }

  get iq3Invalid() {
    return this.intReviewForm.get('iq3')!.invalid && (this.intReviewForm.get('iq3')!.dirty || this.intReviewForm.get('iq3')!.touched);
  }

  get iq4Invalid() {
    return this.intReviewForm.get('iq4')!.invalid && (this.intReviewForm.get('iq4')!.dirty || this.intReviewForm.get('iq4')!.touched);
  }

  get iq5Invalid() {
    return this.intReviewForm.get('iq5')!.invalid && (this.intReviewForm.get('iq5')!.dirty || this.intReviewForm.get('iq5')!.touched);
  }

  get iq6Invalid() {
    return this.intReviewForm.get('iq6')!.invalid && (this.intReviewForm.get('iq6')!.dirty || this.intReviewForm.get('iq6')!.touched);
  }

  get iq7Invalid() {
    return this.intReviewForm.get('iq7')!.invalid && (this.intReviewForm.get('iq7')!.dirty || this.intReviewForm.get('iq7')!.touched);
  }

  get iq8Invalid() {
    return this.intReviewForm.get('iq8')!.invalid && (this.intReviewForm.get('iq8')!.dirty || this.intReviewForm.get('iq8')!.touched);
  }

  get iq9Invalid() {
    return this.intReviewForm.get('iq9')!.invalid && (this.intReviewForm.get('iq9')!.dirty || this.intReviewForm.get('iq9')!.touched);
  }

  get iq10Invalid() {
    return this.intReviewForm.get('iq10')!.invalid && (this.intReviewForm.get('iq10')!.dirty || this.intReviewForm.get('iq10')!.touched);
  }

  get iq11Invalid() {
    return this.intReviewForm.get('iq11')!.invalid && (this.intReviewForm.get('iq11')!.dirty || this.intReviewForm.get('iq11')!.touched);
  }

  get iq12Invalid() {
    return this.intReviewForm.get('iq12')!.invalid && (this.intReviewForm.get('iq12')!.dirty || this.intReviewForm.get('iq12')!.touched);
  }

  get iq13Invalid() {
    return this.intReviewForm.get('iq13')!.invalid && (this.intReviewForm.get('iq13')!.dirty || this.intReviewForm.get('iq13')!.touched);
  }

  get iq14Invalid() {
    return this.intReviewForm.get('iq14')!.invalid && (this.intReviewForm.get('iq14')!.dirty || this.intReviewForm.get('iq14')!.touched);
  }

  get iq15Invalid() {
    return this.intReviewForm.get('iq15')!.invalid && (this.intReviewForm.get('iq15')!.dirty || this.intReviewForm.get('iq15')!.touched);
  }

  get iq16Invalid() {
    return this.intReviewForm.get('iq16')!.invalid && (this.intReviewForm.get('iq16')!.dirty || this.intReviewForm.get('iq16')!.touched);
  }

  get iq17Invalid() {
    return this.intReviewForm.get('iq17')!.invalid && (this.intReviewForm.get('iq17')!.dirty || this.intReviewForm.get('iq17')!.touched);
  }

  // Form Mechanical and Electrical points

  get meq1Invalid() {
    return this.mechanicElectricForm.get('meq1')!.invalid && (this.mechanicElectricForm.get('meq1')!.dirty || this.mechanicElectricForm.get('meq1')!.touched);
  }

  get meq2Invalid() {
    return this.mechanicElectricForm.get('meq2')!.invalid && (this.mechanicElectricForm.get('meq2')!.dirty || this.mechanicElectricForm.get('meq2')!.touched);
  }

  get meq3Invalid() {
    return this.mechanicElectricForm.get('meq3')!.invalid && (this.mechanicElectricForm.get('meq3')!.dirty || this.mechanicElectricForm.get('meq3')!.touched);
  }

  get meq4Invalid() {
    return this.mechanicElectricForm.get('meq4')!.invalid && (this.mechanicElectricForm.get('meq4')!.dirty || this.mechanicElectricForm.get('meq4')!.touched);
  }

  get meq5Invalid() {
    return this.mechanicElectricForm.get('meq5')!.invalid && (this.mechanicElectricForm.get('meq5')!.dirty || this.mechanicElectricForm.get('meq5')!.touched);
  }

  get meq6Invalid() {
    return this.mechanicElectricForm.get('meq6')!.invalid && (this.mechanicElectricForm.get('meq6')!.dirty || this.mechanicElectricForm.get('meq6')!.touched);
  }

  get meq7Invalid() {
    return this.mechanicElectricForm.get('meq7')!.invalid && (this.mechanicElectricForm.get('meq7')!.dirty || this.mechanicElectricForm.get('meq7')!.touched);
  }

  get meq8Invalid() {
    return this.mechanicElectricForm.get('meq8')!.invalid && (this.mechanicElectricForm.get('meq8')!.dirty || this.mechanicElectricForm.get('meq8')!.touched);
  }

  get meq9Invalid() {
    return this.mechanicElectricForm.get('meq9')!.invalid && (this.mechanicElectricForm.get('meq9')!.dirty || this.mechanicElectricForm.get('meq9')!.touched);
  }

  get meq10Invalid() {
    return this.mechanicElectricForm.get('meq10')!.invalid && (this.mechanicElectricForm.get('meq10')!.dirty || this.mechanicElectricForm.get('meq10')!.touched);
  }

  get meq11Invalid() {
    return this.mechanicElectricForm.get('meq11')!.invalid && (this.mechanicElectricForm.get('meq11')!.dirty || this.mechanicElectricForm.get('meq11')!.touched);
  }

  get meq12Invalid() {
    return this.mechanicElectricForm.get('meq12')!.invalid && (this.mechanicElectricForm.get('meq12')!.dirty || this.mechanicElectricForm.get('meq12')!.touched);
  }

  get meq13Invalid() {
    return this.mechanicElectricForm.get('meq13')!.invalid && (this.mechanicElectricForm.get('meq13')!.dirty || this.mechanicElectricForm.get('meq13')!.touched);
  }

  get meq14Invalid() {
    return this.mechanicElectricForm.get('meq14')!.invalid && (this.mechanicElectricForm.get('meq14')!.dirty || this.mechanicElectricForm.get('meq14')!.touched);
  }

  get meq15Invalid() {
    return this.mechanicElectricForm.get('meq15')!.invalid && (this.mechanicElectricForm.get('meq15')!.dirty || this.mechanicElectricForm.get('meq15')!.touched);
  }

  get meq16Invalid() {
    return this.mechanicElectricForm.get('meq16')!.invalid && (this.mechanicElectricForm.get('meq16')!.dirty || this.mechanicElectricForm.get('meq16')!.touched);
  }

  get meq17Invalid() {
    return this.mechanicElectricForm.get('meq17')!.invalid && (this.mechanicElectricForm.get('meq17')!.dirty || this.mechanicElectricForm.get('meq17')!.touched);
  }

  get meq18Invalid() {
    return this.mechanicElectricForm.get('meq18')!.invalid && (this.mechanicElectricForm.get('meq18')!.dirty || this.mechanicElectricForm.get('meq18')!.touched);
  }

  get meq19Invalid() {
    return this.mechanicElectricForm.get('meq19')!.invalid && (this.mechanicElectricForm.get('meq19')!.dirty || this.mechanicElectricForm.get('meq19')!.touched);
  }

  get meq20Invalid() {
    return this.mechanicElectricForm.get('meq20')!.invalid && (this.mechanicElectricForm.get('meq20')!.dirty || this.mechanicElectricForm.get('meq20')!.touched);
  }

  get meq21Invalid() {
    return this.mechanicElectricForm.get('meq21')!.invalid && (this.mechanicElectricForm.get('meq21')!.dirty || this.mechanicElectricForm.get('meq21')!.touched);
  }

  get meq22Invalid() {
    return this.mechanicElectricForm.get('meq22')!.invalid && (this.mechanicElectricForm.get('meq22')!.dirty || this.mechanicElectricForm.get('meq22')!.touched);
  }

  get meq23Invalid() {
    return this.mechanicElectricForm.get('meq23')!.invalid && (this.mechanicElectricForm.get('meq23')!.dirty || this.mechanicElectricForm.get('meq23')!.touched);
  }

  get meq24Invalid() {
    return this.mechanicElectricForm.get('meq24')!.invalid && (this.mechanicElectricForm.get('meq24')!.dirty || this.mechanicElectricForm.get('meq24')!.touched);
  }

  get meq25Invalid() {
    return this.mechanicElectricForm.get('meq25')!.invalid && (this.mechanicElectricForm.get('meq25')!.dirty || this.mechanicElectricForm.get('meq25')!.touched);
  }

  get meq26Invalid() {
    return this.mechanicElectricForm.get('meq26')!.invalid && (this.mechanicElectricForm.get('meq26')!.dirty || this.mechanicElectricForm.get('meq26')!.touched);
  }

  get meq27Invalid() {
    return this.mechanicElectricForm.get('meq27')!.invalid && (this.mechanicElectricForm.get('meq27')!.dirty || this.mechanicElectricForm.get('meq27')!.touched);
  }

  get meq28Invalid() {
    return this.mechanicElectricForm.get('meq28')!.invalid && (this.mechanicElectricForm.get('meq28')!.dirty || this.mechanicElectricForm.get('meq28')!.touched);
  }

  get meq29Invalid() {
    return this.mechanicElectricForm.get('meq29')!.invalid && (this.mechanicElectricForm.get('meq29')!.dirty || this.mechanicElectricForm.get('meq29')!.touched);
  }

  get meq30Invalid() {
    return this.mechanicElectricForm.get('meq30')!.invalid && (this.mechanicElectricForm.get('meq30')!.dirty || this.mechanicElectricForm.get('meq30')!.touched);
  }

  get meq31Invalid() {
    return this.mechanicElectricForm.get('meq31')!.invalid && (this.mechanicElectricForm.get('meq31')!.dirty || this.mechanicElectricForm.get('meq31')!.touched);
  }

  get meq32Invalid() {
    return this.mechanicElectricForm.get('meq32')!.invalid && (this.mechanicElectricForm.get('meq32')!.dirty || this.mechanicElectricForm.get('meq32')!.touched);
  }

  get meq33Invalid() {
    return this.mechanicElectricForm.get('meq33')!.invalid && (this.mechanicElectricForm.get('meq33')!.dirty || this.mechanicElectricForm.get('meq33')!.touched);
  }

  get meq34Invalid() {
    return this.mechanicElectricForm.get('meq34')!.invalid && (this.mechanicElectricForm.get('meq34')!.dirty || this.mechanicElectricForm.get('meq34')!.touched);
  }

  get meq35Invalid() {
    return this.mechanicElectricForm.get('meq35')!.invalid && (this.mechanicElectricForm.get('meq35')!.dirty || this.mechanicElectricForm.get('meq35')!.touched);
  }

  get meq36Invalid() {
    return this.mechanicElectricForm.get('meq36')!.invalid && (this.mechanicElectricForm.get('meq36')!.dirty || this.mechanicElectricForm.get('meq36')!.touched);
  }

  get meq37Invalid() {
    return this.mechanicElectricForm.get('meq37')!.invalid && (this.mechanicElectricForm.get('meq37')!.dirty || this.mechanicElectricForm.get('meq37')!.touched);
  }

  get breakeDDInvalid() {
    return this.mechanicElectricForm.get('breakedd')!.invalid && (this.mechanicElectricForm.get('breakedd')!.dirty || this.mechanicElectricForm.get('breakedd')!.touched);
  }

  get breakeIDInvalid() {
    return this.mechanicElectricForm.get('breakeid')!.invalid && (this.mechanicElectricForm.get('breakeid')!.dirty || this.mechanicElectricForm.get('breakeid')!.touched);
  }

  get breakeITInvalid() {
    return this.mechanicElectricForm.get('breakeit')!.invalid && (this.mechanicElectricForm.get('breakeit')!.dirty || this.mechanicElectricForm.get('breakeit')!.touched);
  }

  get breakeDTInvalid() {
    return this.mechanicElectricForm.get('breakedt')!.invalid && (this.mechanicElectricForm.get('breakedt')!.dirty || this.mechanicElectricForm.get('breakedt')!.touched);
  }

  get meq38Invalid() {
    return this.mechanicElectricForm.get('meq38')!.invalid && (this.mechanicElectricForm.get('meq38')!.dirty || this.mechanicElectricForm.get('meq38')!.touched);
  }

  get meq39Invalid() {
    return this.mechanicElectricForm.get('meq39')!.invalid && (this.mechanicElectricForm.get('meq39')!.dirty || this.mechanicElectricForm.get('meq39')!.touched);
  }

  get meq40Invalid() {
    return this.mechanicElectricForm.get('meq40')!.invalid && (this.mechanicElectricForm.get('meq40')!.dirty || this.mechanicElectricForm.get('meq40')!.touched);
  }

  get depthDDInvalid() {
    return this.mechanicElectricForm.get('depthdd')!.invalid && (this.mechanicElectricForm.get('depthdd')!.dirty || this.mechanicElectricForm.get('depthdd')!.touched);
  }

  get depthIDInvalid() {
    return this.mechanicElectricForm.get('depthid')!.invalid && (this.mechanicElectricForm.get('depthid')!.dirty || this.mechanicElectricForm.get('depthid')!.touched);
  }

  get depthITInvalid() {
    return this.mechanicElectricForm.get('depthit')!.invalid && (this.mechanicElectricForm.get('depthit')!.dirty || this.mechanicElectricForm.get('depthit')!.touched);
  }

  get depthDTInvalid() {
    return this.mechanicElectricForm.get('depthdt')!.invalid && (this.mechanicElectricForm.get('depthdt')!.dirty || this.mechanicElectricForm.get('depthdt')!.touched);
  }

  get meq41Invalid() {
    return this.mechanicElectricForm.get('meq41')!.invalid && (this.mechanicElectricForm.get('meq41')!.dirty || this.mechanicElectricForm.get('meq41')!.touched);
  }

  get meq42Invalid() {
    return this.mechanicElectricForm.get('meq42')!.invalid && (this.mechanicElectricForm.get('meq42')!.dirty || this.mechanicElectricForm.get('meq42')!.touched);
  }

  get meq43Invalid() {
    return this.mechanicElectricForm.get('meq43')!.invalid && (this.mechanicElectricForm.get('meq43')!.dirty || this.mechanicElectricForm.get('meq43')!.touched);
  }

  get meq44Invalid() {
    return this.mechanicElectricForm.get('meq44')!.invalid && (this.mechanicElectricForm.get('meq44')!.dirty || this.mechanicElectricForm.get('meq44')!.touched);
  }

  get meq45Invalid() {
    return this.mechanicElectricForm.get('meq45')!.invalid && (this.mechanicElectricForm.get('meq45')!.dirty || this.mechanicElectricForm.get('meq45')!.touched);
  }

  get meq46Invalid() {
    return this.mechanicElectricForm.get('meq46')!.invalid && (this.mechanicElectricForm.get('meq46')!.dirty || this.mechanicElectricForm.get('meq46')!.touched);
  }

  get meq47Invalid() {
    return this.mechanicElectricForm.get('meq47')!.invalid && (this.mechanicElectricForm.get('meq47')!.dirty || this.mechanicElectricForm.get('meq47')!.touched);
  }

  get meq48Invalid() {
    return this.mechanicElectricForm.get('meq48')!.invalid && (this.mechanicElectricForm.get('meq48')!.dirty || this.mechanicElectricForm.get('meq48')!.touched);
  }

  get meq49Invalid() {
    return this.mechanicElectricForm.get('meq49')!.invalid && (this.mechanicElectricForm.get('meq49')!.dirty || this.mechanicElectricForm.get('meq49')!.touched);
  }

  get meq50Invalid() {
    return this.mechanicElectricForm.get('meq50')!.invalid && (this.mechanicElectricForm.get('meq50')!.dirty || this.mechanicElectricForm.get('meq50')!.touched);
  }

  get meq51Invalid() {
    return this.mechanicElectricForm.get('meq51')!.invalid && (this.mechanicElectricForm.get('meq51')!.dirty || this.mechanicElectricForm.get('meq51')!.touched);
  }

  // Form Vehicle certification points
  get cvq1Invalid() {
    return this.vehicleCertificationForm.get('cvq1')!.invalid && (this.vehicleCertificationForm.get('cvq1')!.dirty || this.vehicleCertificationForm.get('cvq1')!.touched);
  }

  get cvq2Invalid() {
    return this.vehicleCertificationForm.get('cvq2')!.invalid && (this.vehicleCertificationForm.get('cvq2')!.dirty || this.vehicleCertificationForm.get('cvq2')!.touched);
  }

  get cvq3Invalid() {
    return this.vehicleCertificationForm.get('cvq3')!.invalid && (this.vehicleCertificationForm.get('cvq3')!.dirty || this.vehicleCertificationForm.get('cvq3')!.touched);
  }

  /* get cvq4Invalid() {
    return this.vehicleCertificationForm.get('cvq4')!.invalid && (this.vehicleCertificationForm.get('cvq4')!.dirty || this.vehicleCertificationForm.get('cvq4')!.touched);
  } */

  /* get invalidLastMaintenance() {
    return this.vehicleCertificationForm.get('dateLastMaintenance')!.invalid && (this.vehicleCertificationForm.get('dateLastMaintenance')!.dirty || this.vehicleCertificationForm.get('dateLastMaintenance')!.touched);
  } */

  get cvq5Invalid() {
    return this.vehicleCertificationForm.get('cvq5')!.invalid && (this.vehicleCertificationForm.get('cvq5')!.dirty || this.vehicleCertificationForm.get('cvq5')!.touched);
  }

  get cvq6Invalid() {
    return this.vehicleCertificationForm.get('cvq6')!.invalid && (this.vehicleCertificationForm.get('cvq6')!.dirty || this.vehicleCertificationForm.get('cvq6')!.touched);
  }

  get cvq7Invalid() {
    return this.vehicleCertificationForm.get('cvq7')!.invalid && (this.vehicleCertificationForm.get('cvq7')!.dirty || this.vehicleCertificationForm.get('cvq7')!.touched);
  }

  get cvq8Invalid() {
    return this.vehicleCertificationForm.get('cvq8')!.invalid && (this.vehicleCertificationForm.get('cvq8')!.dirty || this.vehicleCertificationForm.get('cvq8')!.touched);
  }

  get cvq9Invalid() {
    return this.vehicleCertificationForm.get('cvq9')!.invalid && (this.vehicleCertificationForm.get('cvq9')!.dirty || this.vehicleCertificationForm.get('cvq9')!.touched);
  }

  get cvq11Invalid() {
    return this.vehicleCertificationForm.get('cvq11')!.invalid && (this.vehicleCertificationForm.get('cvq11')!.dirty || this.vehicleCertificationForm.get('cvq11')!.touched);
  }

  get cvq12Invalid() {
    return this.vehicleCertificationForm.get('cvq12')!.invalid && (this.vehicleCertificationForm.get('cvq12')!.dirty || this.vehicleCertificationForm.get('cvq12')!.touched);
  }

  /**
   * Form Initialization
   */
  private extRevFormInit(){
    this.extReviewForm = this._formBuilder.group({
      condition: ['', Validators.required],
      req1: ['', Validators.required],
      req2: ['', Validators.required],
      req3: ['', Validators.required],
      req4: ['', Validators.required],
      req5: ['a3', Validators.required],
      req6: ['a3', Validators.required],
      req7: ['a3', Validators.required],
      req8: ['a3', Validators.required],
      req9: ['a3', Validators.required],
      req10: ['a3', Validators.required],
      req11: ['a3', Validators.required],
      req12: ['a3', Validators.required],
      req13: ['a3', Validators.required],
      req14: ['a3', Validators.required],
      req15: ['a3', Validators.required],
      req16: ['a3', Validators.required],
      req17: ['a3', Validators.required],
      req18: ['a3', Validators.required],
      req19: ['a3', Validators.required],
      req20: ['a3', Validators.required],
      req21: ['a3', Validators.required],
      req22: ['a3', Validators.required],
      commentary: [null],
      sell_your_car_id: ['', Validators.required],
    });
  }

  private intRevFormInit(){
    this.intReviewForm = this._formBuilder.group({
      iq1: ['a3', Validators.required],
      iq2: ['a3', Validators.required],
      iq3: ['a3', Validators.required],
      iq4: ['a3', Validators.required],
      iq5: ['a3', Validators.required],
      iq6: ['a3', Validators.required],
      iq7: ['a3', Validators.required],
      iq8: ['a3', Validators.required],
      iq9: ['a3', Validators.required],
      iq10: ['a3', Validators.required],
      iq11: ['a3', Validators.required],
      iq12: ['a3', Validators.required],
      iq13: ['a3', Validators.required],
      iq14: ['a3', Validators.required],
      iq15: ['a3', Validators.required],
      iq16: ['a3', Validators.required],
      iq17: ['a3', Validators.required]
    });
  }

  private mechanicElectricFormInit(){
    this.mechanicElectricForm = this._formBuilder.group({
      meq1: ['a3', Validators.required],
      meq2: ['a3', Validators.required],
      meq3: ['a3', Validators.required],
      meq4: ['a3', Validators.required],
      meq5: ['a3', Validators.required],
      meq6: ['a3', Validators.required],
      meq7: ['a3', Validators.required],
      meq8: ['a3', Validators.required],
      meq9: ['a3', Validators.required],
      meq10: ['a3', Validators.required],
      meq11: ['a3', Validators.required],
      meq12: ['a3', Validators.required],
      meq13: ['a3', Validators.required],
      meq14: ['a3', Validators.required],
      meq15: ['a3', Validators.required],
      meq16: ['a3', Validators.required],
      meq17: ['a3', Validators.required],
      meq18: ['a3', Validators.required],
      meq19: ['a3', Validators.required],
      meq20: ['a3', Validators.required],
      meq21: ['a3', Validators.required],
      meq22: ['a3', Validators.required],
      meq23: ['a3', Validators.required],
      meq24: ['a3', Validators.required],
      meq25: ['a3', Validators.required],
      meq26: ['a3', Validators.required],
      meq27: ['a3', Validators.required],
      meq28: ['a3', Validators.required],
      meq29: ['a3', Validators.required],
      meq30: ['a3', Validators.required],
      meq31: ['a3', Validators.required],
      meq32: ['a3', Validators.required],
      meq33: ['a3', Validators.required],
      meq34: ['a3', Validators.required],
      meq35: ['a3', Validators.required],
      meq36: ['a3', Validators.required],
      meq37: ['a3', Validators.required],
      // breakedd: ['', [Validators.required, Validators.pattern("[0-9\.]{1,4}"), Validators.minLength(1), Validators.maxLength(2)]], /* [0-9\.]{1,5} */
      breakedd: ['', [Validators.required, Validators.max(24)]],
      breakeid: ['', [Validators.required, Validators.max(24)]], /* [0-9\.]{1,10} */
      breakeit: ['', [Validators.required, Validators.max(24)]],
      breakedt: ['', [Validators.required, Validators.max(24)]],
      meq38: ['a3', Validators.required],
      meq39: ['a3', Validators.required],
      meq40: ['a3', Validators.required],
      // depthdd: ['', [Validators.required, Validators.pattern("[0-9\.]{1,4}"), Validators.minLength(1), Validators.maxLength(2)]],
      depthdd: ['', [Validators.required, Validators.max(24)]],
      depthid: ['', [Validators.required, Validators.max(24)]],
      depthit: ['', [Validators.required, Validators.max(24)]],
      depthdt: ['', [Validators.required, Validators.max(24)]],
      meq41: ['a3', Validators.required],
      meq42: ['a3', Validators.required],
      meq43: ['a3', Validators.required],
      meq44: ['a3', Validators.required],
      meq45: ['a3', Validators.required],
      meq46: ['a3', Validators.required],
      meq47: ['a3', Validators.required],
      meq48: ['a3', Validators.required],
      meq49: ['a3', Validators.required],
      meq50: ['a3', Validators.required],
      meq51: ['a3', Validators.required],
      commentaryMechanical: [null]
    });
  }

  private vehicleCertificationFormInit(){
    this.vehicleCertificationForm = this._formBuilder.group({
      cvq1: ['a3', Validators.required],
      cvq2: ['a3', Validators.required],
      cvq3: ['a3', Validators.required],
      // cvq4: ['a3', Validators.required],
      dateLastMaintenance: [], /* [Validators.required] */
      cvq5: ['a3', Validators.required],
      cvq6: ['a3', Validators.required],
      cvq7: ['a3', Validators.required],
      cvq8: ['a3', Validators.required],
      cvq9: ['a3', Validators.required],
      cvq11: ['a3', Validators.required],
      cvq12: ['a3', Validators.required],
      warranty_manual: [],
      direct_purchase: [],
      take_into_account: [],
      valid_warranty: [],
      direct_purchase_take_account: []
    });
  }

  private generalDataFormInit(){
    this.generalDataForm = this._formBuilder.group({
      name: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      surname: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      phone: ['', [Validators.required, Validators.pattern("[0-9]+"), Validators.minLength(10), Validators.maxLength(10)]],
      distributor: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      origin_country: ['', Validators.required],
      transmission: ['', Validators.required],
      engine_suction: ['', Validators.required],
      start_stop: ['', Validators.required],
      valuation_date: ['', Validators.required],
      vin: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9]+"), Validators.minLength(17), Validators.maxLength(17)]],
      version: ['', Validators.required],
      mileage: ['', [Validators.required, Validators.pattern("[0-9]{1,10}"), Validators.minLength(1), Validators.maxLength(10)]],
      color: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      plates: [''/* , [Validators.required, Validators.pattern("[a-zA-Z0-9]+"), Validators.minLength(7), Validators.maxLength(7)] */],
      cilindres: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9]+"), Validators.minLength(1), Validators.maxLength(8)]],
      engine_type: ['', [Validators.required, Validators.pattern("[0-9\.]{1,4}"), Validators.minLength(1), Validators.maxLength(2)]],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', Validators.required],
      appraiserTechnician: ['', Validators.required]
    });
  }

  /**
   * Get Brands
   */
  private getBrands() {
    this._venderTuAutoService.brands().subscribe(
      ({ code, brands }: Brands) => {
        this.brands = (code === 200) ? brands : [];
      }
    );
  }

  private getAppraiserTechnicians() {
    this._venderTuAutoService.getAppraiserTechnicians().subscribe(
      ({ code, AppraiserTechnicians}: GetAppraiserTechnicians) => {
        // console.log(AppraiserTechnicians);
        this.appraiserTechnicians = (code === '200') ? AppraiserTechnicians : [];
      }
    );
  }

  /**
   * Get Models by Brand Selected
   */
  public getModels(brand_id: number) {
    this._venderTuAutoService.getModels(brand_id).subscribe(
      ({ code, models }: DataModels) => {
        this.models = (code === 200) ? models : [];
      }
    );
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

  /**
   * Helper function to convert text String to Uppercase
   * @param event keyup
   * @returns string
   */
  public convertMayus(event: any): string {
    return event.target.value = event.target.value.toUpperCase();
  }

  public dateChangeEmitter(event: MatDatepickerInputEvent<Date>) {
    let d = new Date(`${event.value}`);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    let date = [year, month, day].join('-');

    this.generalDataForm.controls['valuation_date'].setValue(date);
    let inputValue = date.split("-").reverse().join("-");
    this.inputdate.nativeElement.value = inputValue;

    // this.onSubmit(); /* Probar, para ver si lo manda con el evento change */
  }

  public lastMaintenanceEmmitter(event: MatDatepickerInputEvent<Date>) {
    let d = new Date(`${event.value}`);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    let date = [year, month, day].join('-');

    this.vehicleCertificationForm.controls['dateLastMaintenance'].setValue(date);
    let inputValue = date.split("-").reverse().join("-");
    this.dateLastMaintenance.nativeElement.value = inputValue;
  }

  public openExternalPictureForm(){
    this._bottomSheet.open(RevisionExternalPictureComponent, {
      data: { sell_your_car_id: this.sell_your_car_id },
    });
  }

  public openInternalPictureForm(){
    this._bottomSheet.open(RevisionInternalPictureComponent, {
      data: { sell_your_car_id: this.sell_your_car_id },
    });
  }

  private checkRoleUserForSteps() {
    const user = JSON.parse(localStorage.getItem('user')!);

    switch (user.role) {
      case 'appraiser':
        this.roleActived = 1;
        break;

      case 'valuator':
        this.roleActived = 2;
        break;

      case 'appraiser_technician':
        this.roleActived = 3;
        break;
    }
  }

  public extReviewSubmit():void{
    this.extReviewSpinner = true;
    if( !this.dataExt ){
      this._venderTuAutoService.setForeignReview( this.extReviewForm.value )
        .subscribe({
          next: ({ code, status, message }) => {
            if (code === '200' && status === 'success') {
              this.alerta(message, 'success');
              this.extReviewSpinner = false;
              this.getForeingReview();
            } else {
              this.alerta('Ocurrió un problema', 'error');
              this.extReviewSpinner = false;
            }
          },

          error: (error) => {
            this.alerta(error?.message, 'error');
            this.extReviewSpinner = false;
          }
        });
    }else{
      this._venderTuAutoService.updateForeignReview( this.extReviewForm.value, this.foreingReview?.id! )
        .subscribe({
          next: ({ code, status, message }) => {
            if (code === '200' && status === 'success') {
              this.alerta(message, 'success');
              this.extReviewSpinner = false;
              this.getForeingReview();
            } else {
              this.alerta('Ocurrió un problema', 'error');
              this.extReviewSpinner = false;
            }
          },
          error: (error) => {
            this.alerta(error?.message, 'error');
            this.extReviewSpinner = false;
          }
        });
    }

  }

  public vehicleHasModifications():void {
    if(this.extReviewForm.get('condition')?.value === 'no'){
      this.invalidReq(true);
    }else{
      this.invalidReq(false);
    }
  }

  private invalidReq( invalid:boolean ){
    const val = invalid ? 'a2' : '';
    this.invalidFields = invalid;
    this.extReviewForm.patchValue({
      req1: val,
      req2: val,
      req3: val,
      req4: val
    });
  }

  private getForeingReview(){
    this._venderTuAutoService.getForeingReviewBySellYourCarId( this.sell_your_car_id )
        .subscribe(
          ( { foreing_review, status } ) => {
            if( status === 'success' ){
              this.foreingReview = foreing_review;
              this.existsForeingReview = true;
              this.dataExt = true;
              this.extReviewForm.reset({
                req1: this.foreingReview.req1,
                req2: this.foreingReview.req2,
                req3: this.foreingReview.req3,
                req4: this.foreingReview.req4,
                req5: this.foreingReview.req5,
                req6: this.foreingReview.req6,
                req7: this.foreingReview.req7,
                req8: this.foreingReview.req8,
                req9: this.foreingReview.req9,
                req10: this.foreingReview.req10,
                req11: this.foreingReview.req11,
                req12: this.foreingReview.req12,
                req13: this.foreingReview.req13,
                req14: this.foreingReview.req14,
                req15: this.foreingReview.req15,
                req16: this.foreingReview.req16,
                req17: this.foreingReview.req17,
                req18: this.foreingReview.req18,
                req19: this.foreingReview.req19,
                req20: this.foreingReview.req20,
                req21: this.foreingReview.req21,
                req22: this.foreingReview.req22,
                commentary: this.foreingReview.commentary,
                sell_your_car_id: this.sell_your_car_id
              });
              if(
                this.extReviewForm.get('req1')?.value == 'a2' &&
                this.extReviewForm.get('req2')?.value == 'a2' &&
                this.extReviewForm.get('req3')?.value == 'a2' &&
                this.extReviewForm.get('req4')?.value == 'a2'
              ){
                this.vesumo = true;
                this.extReviewForm.patchValue({
                  condition: "no"
                });
                this.vehicleHasModifications();
              }else{
                this.extReviewForm.patchValue({
                  condition: "si"
                });
                this.invalidFields = false;
              }
            }
          }
        );
  }

  public alerta(message: string, type: SweetAlertIcon) {
    Swal.fire({
      icon: type,
      text: message,
      showConfirmButton: true,
      confirmButtonColor: '#EEB838',
      timer: 3500
    }).then(() => {
      this.spinner = false;
    });
  }

  public getClientVehicle(id: string){
    this._appraiserChecklistService.getAppraiserChecklist(id).subscribe(
      ({ code, status, sell_car_valuation_id}: SellCarValuation) => {
        if(code === 200 && status === 'success') {
          // Get again models for set value in carmodel control
          this.getModels(sell_car_valuation_id.brand_id);
          this.sell_your_car_id = sell_car_valuation_id.id;

          this.generalDataForm.patchValue({
            name:     sell_car_valuation_id.client_sale.user.name,
            surname:  sell_car_valuation_id.client_sale.user.surname,
            phone:    sell_car_valuation_id.client_sale.phone1,
            vin:      sell_car_valuation_id.vin,
            brand:    sell_car_valuation_id.brand_id.toString(),
            model:    sell_car_valuation_id.carmodel_id.toString(),
            date:     sell_car_valuation_id.date,
            version:  sell_car_valuation_id.version,
            year:     sell_car_valuation_id.year.toString(),
            mileage:  sell_car_valuation_id.km
          });

          let valuationDate = sell_car_valuation_id.date.toString();
          let valDate = valuationDate.slice(0,-14);

          this.generalDataForm.controls['valuation_date'].setValue(valDate);
          let vd = valDate.split("-").reverse().join("-");
          this.inputdate.nativeElement.value = vd;

          this.generalDataForm.controls['name'].disable();
          this.generalDataForm.controls['surname'].disable();
          this.generalDataForm.controls['phone'].disable();
        }
      }
    );
  }

  public getChecklist(id: string){
    this._appraiserChecklistService.getChecklistValuation(id)
    .subscribe({
      next: ({ code, status, DataChecklist}: ChecklistValuation) => {
        if (code === '200' && status === 'success') {

          if (DataChecklist.warranty_manual == 'yes') {
            this.checked = true;
            this.vehicleCertificationForm.controls['warranty_manual'].setValue(this.checked);
          }else{
            this.checked = false;
            this.vehicleCertificationForm.controls['warranty_manual'].setValue(this.checked);
          }

          if (DataChecklist.direct_purchase == 'yes' ) {
            this.checkedp = true;
            this.vehicleCertificationForm.controls['direct_purchase'].setValue(this.checkedp);
          }else{
            this.checkedp = false;
            this.vehicleCertificationForm.controls['direct_purchase'].setValue(this.checkedp);
          }

          if (DataChecklist.take_into_account == 'yes') {
            this.checkedt = true;
            this.vehicleCertificationForm.controls['take_into_account'].setValue(this.checkedt);
          } else {
            this.checkedt = false;
            this.vehicleCertificationForm.controls['take_into_account'].setValue(this.checkedt);
          }

          if (DataChecklist.valid_warranty == 'yes') {
            this.checkedg = true;
            this.vehicleCertificationForm.controls['valid_warranty'].setValue(this.checkedg)
          } else {
            this.checkedg = false;
            this.vehicleCertificationForm.controls['valid_warranty'].setValue(this.checkedg);
          }

          if (DataChecklist.direct_purchase_take_account == 'yes') {
            this.checkedpt = true;
            this.vehicleCertificationForm.controls['direct_purchase_take_account'].setValue(this.checkedpt)
          } else {
            this.checkedpt = false;
            this.vehicleCertificationForm.controls['direct_purchase_take_account'].setValue(this.checkedpt);
          }

          this.generalDataForm.patchValue({
            distributor: DataChecklist.distributor,
            origin_country: DataChecklist.origin_country,
            transmission: DataChecklist.transmission,
            engine_suction: DataChecklist.engine_suction,
            start_stop: DataChecklist.start_stop,
            valuation_date: DataChecklist.valuation_date,
            color: DataChecklist.color,
            plates: DataChecklist.plates,
            cilindres: DataChecklist.cilindres,
            engine_type: DataChecklist.engine_type,
            appraiserTechnician: DataChecklist.technician_id.toString()
          });
          let valuationDate = DataChecklist.valuation_date.toString();
          let vd = valuationDate.split("-").reverse().join("-");
          this.inputdate.nativeElement.value = vd;
          this.btn_follow = true;
          this.btn_save = false;
        }

        // generalDataForm Fields disable
        this.generalDataForm.controls['distributor'].disable();
        this.generalDataForm.controls['origin_country'].disable();
        this.generalDataForm.controls['transmission'].disable();
        this.generalDataForm.controls['engine_suction'].disable();
        this.generalDataForm.controls['start_stop'].disable();
        this.generalDataForm.controls['valuation_date'].disable();
        this.generalDataForm.controls['vin'].disable();
        this.generalDataForm.controls['brand'].disable();
        this.generalDataForm.controls['model'].disable();
        this.generalDataForm.controls['version'].disable();
        this.generalDataForm.controls['year'].disable();
        this.generalDataForm.controls['mileage'].disable();
        this.generalDataForm.controls['color'].disable();
        this.generalDataForm.controls['plates'].disable();
        this.generalDataForm.controls['cilindres'].disable();
        this.generalDataForm.controls['engine_type'].disable();
        this.generalDataForm.controls['appraiserTechnician'].disable();
      },
      error: (error) => {
        this.onGeneralData();
      }
    });
  }

  public getMechanicElectric(id: string){
    this._appraiserChecklistService.getMechanicElectronic(id)
    .subscribe({
      next: ({ code, status, DataMechanicElectronic}: MechanicalElectric) => {
        // console.log(DataMechanicElectronic);
        if (code === '200' && status === 'success') {
          this.saveUpdateMech = true;
          this.mechanicElectricForm.patchValue({
            meq1: DataMechanicElectronic.meq1,
            meq2: DataMechanicElectronic.meq2,
            meq3: DataMechanicElectronic.meq3,
            meq4: DataMechanicElectronic.meq4,
            meq5: DataMechanicElectronic.meq5,
            meq6: DataMechanicElectronic.meq6,
            meq7: DataMechanicElectronic.meq7,
            meq8: DataMechanicElectronic.meq8,
            meq9: DataMechanicElectronic.meq9,
            meq10: DataMechanicElectronic.meq10,
            meq11: DataMechanicElectronic.meq11,
            meq12: DataMechanicElectronic.meq12,
            meq13: DataMechanicElectronic.meq13,
            meq14: DataMechanicElectronic.meq14,
            meq15: DataMechanicElectronic.meq15,
            meq16: DataMechanicElectronic.meq16,
            meq17: DataMechanicElectronic.meq17,
            meq18: DataMechanicElectronic.meq18,
            meq19: DataMechanicElectronic.meq19,
            meq20: DataMechanicElectronic.meq20,
            meq21: DataMechanicElectronic.meq21,
            meq22: DataMechanicElectronic.meq22,
            meq23: DataMechanicElectronic.meq23,
            meq24: DataMechanicElectronic.meq24,
            meq25: DataMechanicElectronic.meq25,
            meq26: DataMechanicElectronic.meq26,
            meq27: DataMechanicElectronic.meq27,
            meq28: DataMechanicElectronic.meq28,
            meq29: DataMechanicElectronic.meq29,
            meq30: DataMechanicElectronic.meq30,
            meq31: DataMechanicElectronic.meq31,
            meq32: DataMechanicElectronic.meq32,
            meq33: DataMechanicElectronic.meq33,
            meq34: DataMechanicElectronic.meq34,
            meq35: DataMechanicElectronic.meq35,
            meq36: DataMechanicElectronic.meq36,
            meq37: DataMechanicElectronic.meq37,
            breakedd: DataMechanicElectronic.breakedd,
            breakeid: DataMechanicElectronic.breakeid,
            breakeit: DataMechanicElectronic.breakeit,
            breakedt: DataMechanicElectronic.breakedt,
            meq38: DataMechanicElectronic.meq38,
            meq39: DataMechanicElectronic.meq39,
            meq40: DataMechanicElectronic.meq40,
            depthdd: DataMechanicElectronic.depthdd,
            depthid: DataMechanicElectronic.depthid,
            depthit: DataMechanicElectronic.depthit,
            depthdt: DataMechanicElectronic.depthdt,
            meq41: DataMechanicElectronic.meq41,
            meq42: DataMechanicElectronic.meq42,
            meq43: DataMechanicElectronic.meq43,
            meq44: DataMechanicElectronic.meq44,
            meq45: DataMechanicElectronic.meq45,
            meq46: DataMechanicElectronic.meq46,
            meq47: DataMechanicElectronic.meq47,
            meq48: DataMechanicElectronic.meq48,
            meq49: DataMechanicElectronic.meq49,
            meq50: DataMechanicElectronic.meq50,
            meq51: DataMechanicElectronic.meq51,
            commentaryMechanical: DataMechanicElectronic.commentaryMechanical
          });
        }
      },
      error: (error) => {
        // this.onMechanicalElectronic();
      }
    });
  }

  public getInteriorReview(id: string){
    this._appraiserChecklistService.getInteriorReview(id)
    .subscribe({
      // (( resp: any ) => {console.log(resp);})
      next: ({ code, status, DataInteriorReview}: InteriorReview) => {
        // console.log(DataInteriorReview);
        if (code === '200' && status === 'success') {
          this.save_update = true;
          this.intReviewForm.patchValue({
            iq1: DataInteriorReview.iq1,
            iq2: DataInteriorReview.iq2,
            iq3: DataInteriorReview.iq3,
            iq4: DataInteriorReview.iq4,
            iq5: DataInteriorReview.iq5,
            iq6: DataInteriorReview.iq6,
            iq7: DataInteriorReview.iq7,
            iq8: DataInteriorReview.iq8,
            iq9: DataInteriorReview.iq9,
            iq10: DataInteriorReview.iq10,
            iq11: DataInteriorReview.iq11,
            iq12: DataInteriorReview.iq12,
            iq13: DataInteriorReview.iq13,
            iq14: DataInteriorReview.iq14,
            iq15: DataInteriorReview.iq15,
            iq16: DataInteriorReview.iq16,
            iq17: DataInteriorReview.iq17
          });
        }
      }, 
      error: (error) => {
        // this.onIntReviewSubmit(); Ya no manda error porque el formulario ya esta lleno con N/A así que inserta el registro, por eso comenté.
      }
    });
  }

  public getVehicleCertification(id: string){
    this._appraiserChecklistService.getVehCertification(id)
    .subscribe({
      // (( resp: any ) => {console.log(resp);})
      next: ({ code, status, DataVehicleCertification}: CertificationVehicle) => {
        // console.log(DataVehicleCertification);
        if (code === '200' && status === 'success') {
          this.saveUpdateCert = true;
          this.vehicleCertificationForm.patchValue({
            cvq1: DataVehicleCertification.cvq1,
            cvq2: DataVehicleCertification.cvq2,
            cvq3: DataVehicleCertification.cvq3,
            dateLastMaintenance: DataVehicleCertification.dateLastMaintenance,
            cvq5: DataVehicleCertification.cvq5,
            cvq6: DataVehicleCertification.cvq6,
            cvq7: DataVehicleCertification.cvq7,
            cvq8: DataVehicleCertification.cvq8,
            cvq9: DataVehicleCertification.cvq9,
            cvq11: DataVehicleCertification.cvq11,
            cvq12: DataVehicleCertification.cvq12
          });
          if (DataVehicleCertification.dateLastMaintenance != null) {
            let valuationDate = DataVehicleCertification.dateLastMaintenance.toString();
            let vd = valuationDate.split("-").reverse().join("-");
            this.dateLastMaintenance.nativeElement.value = vd;
          }
        }
      }, 
      error: (error) => {
        // Atrapa el error
      }
    });
  }

  public openSparePartsForm() {
    this._bottomSheet.open(SparePartsComponent, {
      data: {
        sell_your_car_id: this.sell_your_car_id
      },
    });
  }

  public openPaintingWorksForm(){
    this._bottomSheet.open(PaintingWorksComponent, {
      data: {
        sell_your_car_id: this.sell_your_car_id
      }
    });
  }

  public onGeneralData() {

    this.spinner = true;

    this._appraiserChecklistService.getChecklistAppraiser()
    .subscribe({
      next: ({ code, status, Check_List}: ValuatorChecklist) => {
        const find = Check_List.data.some(cl => cl.sell_your_car_id === this.sell_your_car_id);
        if (code == '200' && status == 'success') {
          if (find) {

          } else {
            this.setGeneralData(this.sell_your_car_id);
            return;
          }
        }
      }
    });

  }

  public setGeneralData(id: number){

    this._valuationFormFroupGeneral = {
      'sell_your_car_id': id,
      'technician_id': this.myIdTechnician,
      ...this.generalDataForm.value
    }

    this._appraiserChecklistService.setAppraiserChecklist(this._valuationFormFroupGeneral)
    .subscribe({
      next: ((resp: ValuatorChecklist) => {
        // console.log(resp.status);
        if (resp.code === '200' && resp.status === 'success') {
          // console.log(resp);
          this._appraiserChecklistService.getChecklistValuation(String(id))
          .subscribe({
            next: ({ DataChecklist }: ChecklistValuation ) => {
              this.id = DataChecklist.id; // Aquí se almacena el id del checklist
              this.user_id = this._localS.id;
              this.inPreparation = 'no';
              this.updateUserId(this.id);
            }
          });
          // Change spinner
          this.spinner = false;

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
      })
    });

    this._appraiserChecklistService.updateAppraiserKm(id, { km: this.generalDataForm.get('mileage')?.value, status: 'stand_by', version: this.generalDataForm.get('version')?.value, vin: this.generalDataForm.get('vin')?.value })
    .subscribe({ /* Antes status: 'pre_approved' */
      next: ((resp: SellCarValuation) => {
        // console.log(resp);

      })
    });
  }

  public updateUserId(id: number){
    this._sellYourCar.updateStatusReject(id, { preparation: this.inPreparation, user_id: this.user_id} )
    .subscribe({
      next: ( resp => {
        if (resp.code === '200' && resp.status === 'success') {
          // console.log(message);
          return;
        }
      })
    });
  }

  public onMyChange(){
    this.myIdTechnician = this.generalDataForm.controls['appraiserTechnician'].value;
  }

  public onMechanicalElectronic(){
    this.spinner = true;
    this._appraiserChecklistService.getMechanicElectronic(String(this.sell_your_car_id))
    .subscribe({
      next: ({code, status, DataMechanicElectronic}: MechanicalElectric) => {
        // console.log(DataMechanicElectronic.id, code, status);
        if (code === '200' && status === 'success') {
          this.idMechanicElec = DataMechanicElectronic.id;
          this._appraiserChecklistService.getAppraiserChecklist(String(this.sell_your_car_id))
          .subscribe({
          next: (resp => {
              // console.log(resp.sell_car_valuation_id.status);
              if (resp.sell_car_valuation_id.status === 'preparation' || resp.sell_car_valuation_id.status === 'readyForSale') {
                this.statuSelect = 'readyForSale';
              }
              this.updateMechanicElectric(this.sell_your_car_id);
            })
          });
        }
      },
      error: (error) => {
        // console.log('No encuentra el registro del MechanicalElectonic');
        this.setMechanicalElectronic(this.sell_your_car_id);
      }
    });
  }

  public updateMechanicElectric(sellYourCarId: number){
    this._valuationFormFroupGeneral = {
      'sell_your_car_id': sellYourCarId,
      ...this.generalDataForm.value,
      'status': this.statuSelect,
      ...this.mechanicElectricForm.getRawValue(),
      ...this.mechanicElectricForm.value,
    }

    this._sellYourCar.updateStatusStandByParts(sellYourCarId, { status: this.statuSelect})
    .subscribe({
      next: ( (resp: Updstandbyparts) => {
        if (resp.code === '200' && resp.status === 'success') {
          let message = 'El status cambió a readyForSale';
        }
      })
    });

    this._appraiserChecklistService.updateMechanicElectric(this.idMechanicElec, this._valuationFormFroupGeneral)
    .subscribe({
      next: ((resp: MechanicElectric) => {
        if (resp.code == 200 && resp.status === 'success') {
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
            text: 'Inserta la info de todos los registros, todos son requeridos.',
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });

          // Change spinner
          this.spinner = false;
        }
      })
    });
  }

  public setMechanicalElectronic(id: number){
    this._valuationFormFroupGeneral = {
      'sell_your_car_id': id,
      ...this.mechanicElectricForm.value
    }

    this._appraiserChecklistService.setMechanicElectronic(this._valuationFormFroupGeneral)
    .subscribe({
      next: ((resp: MechanicElectric) => {
        // console.log(resp);
        if (resp.code == 200 && resp.status === 'success') {
          this.spinner = false;
          Swal.fire({
            icon: 'success',
            title: 'Alta registro',
            text: 'Alta de registro exitoso',
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });

        } else {
          // console.log(resp);
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
      })
    });
  }

  public onIntReviewSubmit(){
    this.spinner = true;
    this._appraiserChecklistService.getInteriorReview(String(this.sell_your_car_id))
    .subscribe({
      next: ({code, status, DataInteriorReview}: InteriorReview) => {
        // console.log(DataInteriorReview.id, code, status);
        if (code === '200' && status === 'success') {
          this.idIntRev = DataInteriorReview.id;
          this._appraiserChecklistService.getAppraiserChecklist(String(this.sell_your_car_id)).subscribe(
            (resp => {
              // console.log(resp.sell_car_valuation_id.status);
              if (resp.sell_car_valuation_id.status === 'preparation' || resp.sell_car_valuation_id.status === 'readyForSale') {
                this.statuSelect = 'readyForSale';
              }
              this.updateIntStatuReview(this.sell_your_car_id);
            })
          );
        }
      },
      error: (error) => {
        // console.log('No encuentra el registro de Revisión interior');
        this.setIntReview(this.sell_your_car_id);
      }
    });
  }

  public updateIntStatuReview(sellYourCarId: number){ /* id:number,  */
    this._valuationFormFroupGeneral = {
      // 'id': id,
      'sell_your_car_id': sellYourCarId,
      ...this.generalDataForm.value,
      'status': this.statuSelect,
      ...this.intReviewForm.getRawValue(),
      ...this.intReviewForm.value,
    }

    this._sellYourCar.updateStatusStandByParts(sellYourCarId, { status: this.statuSelect})
    .subscribe({
      next: ( (resp: Updstandbyparts) => {
        if (resp.code === '200' && resp.status === 'success') {
          let message = 'El status cambió a readyForSale';
        }
      })
    });

    this._appraiserChecklistService.updateIntReview(this.idIntRev, this._valuationFormFroupGeneral)
    .subscribe({
      next: ((resp: IntReview) => {
        // console.log(typeof(resp.code));
        if (resp.code == 200 && resp.status === 'success') {
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
            text: 'Inserta la info de todos los registros, todos son requeridos.',
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });

          // Change spinner
          this.spinner = false;
        }
      })
    });
  }

  public setIntReview(id: number){
    this._valuationFormFroupGeneral = {
      'sell_your_car_id': id,
      ...this.intReviewForm.value
    }
    this._appraiserChecklistService.setIntReview(this._valuationFormFroupGeneral)
    .subscribe({
      next: ((resp: IntReview) => {
        // console.log(resp);
        if (resp.code == 200 && resp.status === 'success') {
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
          // console.log(resp);
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
      })
    });
  }

  public onVehicleCertificationSubmit(){
    this.spinner = true;
    this._appraiserChecklistService.getVehCertification(String(this.sell_your_car_id))
    .subscribe({
      next: ({code, status, DataVehicleCertification}: CertificationVehicle) => {
        if (code === '200' && status === 'success') {
          // console.log(DataVehicleCertification.id, code, status);
          this.idCert = DataVehicleCertification.id;
          this._appraiserChecklistService.getAppraiserChecklist(String(this.sell_your_car_id))
          .subscribe({
            next: (resp => {
              // console.log(resp.sell_car_valuation_id.status, resp.sell_car_valuation_id.id);
              if (resp.sell_car_valuation_id.status === 'preparation' || resp.sell_car_valuation_id.status === 'readyForSale') {
                this.statuSelect = 'readyForSale';
              }
              this.updateStatuVehicleCertification(resp.sell_car_valuation_id.id, this.sell_your_car_id);
            })
          });
        }
      },
      error: (error) => {
        // console.log('No encuentra el registro de Certificación del Vehículo');
        this.setVehCertification(this.sell_your_car_id);
      }
    });
  }

  public updateStatuVehicleCertification(id:number, sellYourCarId:number){
    this._valuationFormFroupGeneral = {
      'id': id,
      'sell_your_car_id': sellYourCarId,
      ...this.generalDataForm.value,
      'status': this.statuSelect,
      ...this.vehicleCertificationForm.getRawValue(),
      ...this.vehicleCertificationForm.value,
      'warranty_manual': (this.vehicleCertificationForm.get('warranty_manual')?.value) ? 'yes' : 'no',
      'direct_purchase': (this.vehicleCertificationForm.get('direct_purchase')?.value) ? 'yes' : 'no',
      'take_into_account': (this.vehicleCertificationForm.get('take_into_account')?.value) ? 'yes' : 'no',
      'valid_warranty': (this.vehicleCertificationForm.get('valid_warranty')?.value) ? 'yes' : 'no',
      'direct_purchase_take_account': (this.vehicleCertificationForm.get('direct_purchase_take_account')?.value) ? 'yes' : 'no'
    }

    this._appraiserChecklistService.updateStatusForms(id, this._valuationFormFroupGeneral)
    .subscribe({
      next: ((resp: UpdateStatusAll) => {
        // console.log(resp);
      })
    });

    this._sellYourCar.updateStatusStandByParts(sellYourCarId, { status: this.statuSelect})
    .subscribe({
      next: ((resp: Updstandbyparts) => {
        if (resp.code === '200' && resp.status === 'success') {
          let message = 'El status cambió a readyForSale';
        }
      })
    });

    this._appraiserChecklistService.updateVehicleCertification(this.idCert, this._valuationFormFroupGeneral)
    .subscribe({
      next: ((resp: CertificationVeh) => {
        // console.log(typeof(resp.code));
        if (resp.code == 200 && resp.status === 'success') {
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
            text: 'Inserta la info de todos los registros, todos son requeridos.',
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });

          // Change spinner
          this.spinner = false;
        }
      })
    });
  }

  public setVehCertification(id: number){
    this._valuationFormFroupGeneral = {
      'sell_your_car_id': id,
      ...this.vehicleCertificationForm.value,
      'warranty_manual': (this.vehicleCertificationForm.get('warranty_manual')?.value) ? 'yes' : 'no',
      'direct_purchase': (this.vehicleCertificationForm.get('direct_purchase')?.value) ? 'yes' : 'no',
      'take_into_account': (this.vehicleCertificationForm.get('take_into_account')?.value) ? 'yes' : 'no',
      'valid_warranty': (this.vehicleCertificationForm.get('valid_warranty')?.value) ? 'yes' : 'no',
      'direct_purchase_take_account': (this.vehicleCertificationForm.get('direct_purchase_take_account')?.value) ? 'yes' : 'no'
    }

    this._appraiserChecklistService.updateStatusForms(id, this._valuationFormFroupGeneral)
    .subscribe({
      next: ((resp: UpdateStatusAll) => {
        // console.log(resp);

      })
    });

    this._appraiserChecklistService.setVehCertification(this._valuationFormFroupGeneral)
    .subscribe({
      next: ((resp: CertificationVeh) => {
        // console.log(resp);
        if (resp.code == 200 && resp.status === 'success') {
          this.spinner = false;
          Swal.fire({
            icon: 'success',
            title: 'Alta registro',
            text: 'Alta de registro exitoso',
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });
          // this._router.navigateByUrl('/admin/valuator/vende-tu-auto');
        }else {
          // console.log(resp);
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
      })
    });
  }

}
