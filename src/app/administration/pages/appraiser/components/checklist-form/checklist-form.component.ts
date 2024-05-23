import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

// Animations
import Swal from "sweetalert2";

// Services
import { VendeTuAutoService } from 'src/app/dashboard/pages/vender-autos/services/vende-tu-auto.service';
import { AppraiserChecklistService } from '../../services/appraiser-checklist.service';

// Interfaces
import { DataModels, Model } from 'src/app/dashboard/pages/comprar-autos/interfaces/compra-tu-auto/data_models.interface';
import { Branch, Brands } from 'src/app/dashboard/pages/vender-autos/interfaces/vende-tu-auto.interface';
import { SellCarValuation } from '../../interfaces/sell-car-valuation.interface';
import { ValuatorChecklist } from '../../interfaces/valuator.checklist.interface';
import { ChecklistValuation } from '../../interfaces/checklist-valuation.interface';

// Pipes
import { DatePipe } from '@angular/common';

import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Technician } from '../../interfaces/technician.interface';

@Component({
  selector: 'app-checklist-form',
  templateUrl: './checklist-form.component.html',
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

export class ChecklistFormComponent implements OnInit {
  @ViewChild('workforce') workforce!:ElementRef<HTMLInputElement>;
  @ViewChild('spare_parts') spare_parts!:ElementRef<HTMLInputElement>;
  @ViewChild('hyp') hyp!:ElementRef<HTMLInputElement>;
  @ViewChild('inputdate') inputdate!: ElementRef<HTMLInputElement>;

  // Reference loading
  public spinner: boolean = false;

  // References Form
  public generalDataForm!: UntypedFormGroup;
  public extReviewForm!: UntypedFormGroup;
  public intReviewForm!: UntypedFormGroup;
  public mechanicElectricForm!: UntypedFormGroup;
  public vehicleCertificationForm!: UntypedFormGroup;
  public quotationForm!: UntypedFormGroup;

  private _valuationFormGroupGeneral!: UntypedFormGroup;

  // References Arrays
  public brands: Branch[] = [];
  public models: Model[] = [];
  public years: number[] = [];

  // Reference Slide toggle
  public checked = false;
  public checkedp = false;
  public checkedt = false;
  public checkedg = false;

  // Reference vin
  public vin!:string;
  public vinChecklist!:string;
  public directPurchase!: boolean;
  public warrantyManual!: boolean;

  // Sell your car
  public sellYourCar_id!: number;
  public total: number = 0;

  // Reference id Checklist
  public id!: number;

  // reference status Checklist
  public statuSelect: string = '';

  // Reference localStorage
  public _localS: any;

  // Reference user_id
  public technician_id!: number;

  constructor(
    private _router: Router,
    private _datePipe: DatePipe,
    private _formBuilder: UntypedFormBuilder,
    private _venderTuAutoService: VendeTuAutoService,
    private _activatedRoute: ActivatedRoute,
    private _appraiserChecklistService: AppraiserChecklistService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef
  ) {
    // Initialization of Form
    this.generalDataFormInit();
    this.extRevFormInit();
    this.intRevFormInit();
    this.mechanicElectricFormInit();
    this.vehicleCertificationFormInit();
    this.quotationFormInit();

    // Get vin
    this.vin = this._activatedRoute.snapshot.params.vin;

    if (localStorage.getItem('user')) {

      this._localS = JSON.parse(localStorage.getItem('user')!);

    }

    if (this.data.vin) {
      this.vinChecklist = this.data.vin;
      this.getChecklistValuation(this.data.vin);
      this.getAppraiserChecklist(this.data.vin);
    }else{
      this.getChecklistValuation(this._activatedRoute.snapshot.params.vin);
      this.getAppraiserChecklist(this.id);/* El parámetro era vin */
    }
  }

  ngOnInit(): void {

    // console.log(this.vin);
    // this.getAppraiserChecklist(this.vin);
    // this.getAppraiserChecklist(this.vinChecklist);

    // Calling the initial functions of the form
    this.getBrands();

    // Years of vehicles allowed
    let year = new Date().getFullYear();
    for (let i = year; i > year-10; i--) {
      this.years.push(i);
    }

    this.scrollTop();
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();
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

  /* get plateInvalid() {
    return this.generalDataForm.get('plates')!.invalid && (this.generalDataForm.get('plates')!.dirty || this.generalDataForm.get('plates')!.touched);
  } */

  get cylinderInvalid() {
    return this.generalDataForm.get('cilindres')!.invalid && (this.generalDataForm.get('cilindres')!.dirty || this.generalDataForm.get('cilindres')!.touched);
  }

  // Vehicle Getters
  get brandInvalid() {
    return this.generalDataForm.get('brand')!.invalid && (this.generalDataForm.get('brand')!.dirty || this.generalDataForm.get('brand')!.touched);
  }

  get yearInvalid() {
    return this.generalDataForm.get('year')!.invalid && (this.generalDataForm.get('year')!.dirty || this.generalDataForm.get('year')!.touched);
  }

  // Form points Exterior revision

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

  // Form Mechanical and Electrical points
  get cvq1Invalid() {
    return this.vehicleCertificationForm.get('cvq1')!.invalid && (this.vehicleCertificationForm.get('cvq1')!.dirty || this.vehicleCertificationForm.get('cvq1')!.touched);
  }

  get cvq2Invalid() {
    return this.vehicleCertificationForm.get('cvq2')!.invalid && (this.vehicleCertificationForm.get('cvq2')!.dirty || this.vehicleCertificationForm.get('cvq2')!.touched);
  }

  get cvq3Invalid() {
    return this.vehicleCertificationForm.get('cvq3')!.invalid && (this.vehicleCertificationForm.get('cvq3')!.dirty || this.vehicleCertificationForm.get('cvq3')!.touched);
  }

  get cvq4Invalid() {
    return this.vehicleCertificationForm.get('cvq4')!.invalid && (this.vehicleCertificationForm.get('cvq4')!.dirty || this.vehicleCertificationForm.get('cvq4')!.touched);
  }

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

  /* get totalInvalid() {
    return this.quotationForm.get('total')!.invalid && (this.quotationForm.get('total')!.dirty || this.quotationForm.get('total')!.touched);
  } */

  get take_valueInvalid() {
    return this.quotationForm.get('take_value')!.invalid && (this.quotationForm.get('take_value')!.dirty || this.quotationForm.get('take_value')!.touched);
  }

  get final_offerInvalid() {
    return this.quotationForm.get('final_offer')!.invalid && (this.quotationForm.get('final_offer')!.dirty || this.quotationForm.get('final_offer')!.touched);
  }

  // technician, manager, appraiser signature form
  /* get name_technicalInvalid() {
    return this.quotationForm.get('name_technical')!.invalid && (this.quotationForm.get('name_technical')!.dirty || this.quotationForm.get('name_technical')!.touched);
  }

  get name_managerInvalid() {
    return this.quotationForm.get('name_manager')!.invalid && (this.quotationForm.get('name_manager')!.dirty || this.quotationForm.get('name_manager')!.touched);
  }

  get name_appraiserInvalid() {
    return this.quotationForm.get('name_appraiser')!.invalid && (this.quotationForm.get('name_appraiser')!.dirty || this.quotationForm.get('name_appraiser')!.touched);
  } */

  get checkboxInvalid() {
    return this.extReviewForm.get('checkbox')!.invalid && this.extReviewForm.get('checkbox')!.touched;
  }

  /**
   * Form Initialization
   */
  private extRevFormInit(){
    this.extReviewForm = this._formBuilder.group({
      req1: ['', Validators.required],
      req2: ['', Validators.required],
      req3: ['', Validators.required],
      req4: ['', Validators.required],
      req5: ['', Validators.required],
      req6: ['', Validators.required],
      req7: ['', Validators.required],
      req8: ['', Validators.required],
      req9: ['', Validators.required],
      req10: ['', Validators.required],
      req11: ['', Validators.required],
      req12: ['', Validators.required],
      req13: ['', Validators.required],
      req14: ['', Validators.required],
      req15: ['', Validators.required],
      req16: ['', Validators.required],
      req17: ['', Validators.required],
      req18: ['', Validators.required],
      req19: ['', Validators.required],
      req20: ['', Validators.required],
      req21: ['', Validators.required],
      req22: ['', Validators.required]
    });
  }

  private intRevFormInit(){
    this.intReviewForm = this._formBuilder.group({
      iq1: ['', Validators.required],
      iq2: ['', Validators.required],
      iq3: ['', Validators.required],
      iq4: ['', Validators.required],
      iq5: ['', Validators.required],
      iq6: ['', Validators.required],
      iq7: ['', Validators.required],
      iq8: ['', Validators.required],
      iq9: ['', Validators.required],
      iq10: ['', Validators.required],
      iq11: ['', Validators.required],
      iq12: ['', Validators.required],
      iq13: ['', Validators.required],
      iq14: ['', Validators.required],
      iq15: ['', Validators.required],
      iq16: ['', Validators.required],
      iq17: ['', Validators.required]
    });
  }

  private mechanicElectricFormInit(){
    this.mechanicElectricForm = this._formBuilder.group({
      meq1: ['', Validators.required],
      meq2: ['', Validators.required],
      meq3: ['', Validators.required],
      meq4: ['', Validators.required],
      meq5: ['', Validators.required],
      meq6: ['', Validators.required],
      meq7: ['', Validators.required],
      meq8: ['', Validators.required],
      meq9: ['', Validators.required],
      meq10: ['', Validators.required],
      meq11: ['', Validators.required],
      meq12: ['', Validators.required],
      meq13: ['', Validators.required],
      meq14: ['', Validators.required],
      meq15: ['', Validators.required],
      meq16: ['', Validators.required],
      meq17: ['', Validators.required],
      meq18: ['', Validators.required],
      meq19: ['', Validators.required],
      meq20: ['', Validators.required],
      meq21: ['', Validators.required],
      meq22: ['', Validators.required],
      meq23: ['', Validators.required],
      meq24: ['', Validators.required],
      meq25: ['', Validators.required],
      meq26: ['', Validators.required],
      meq27: ['', Validators.required],
      meq28: ['', Validators.required],
      meq29: ['', Validators.required],
      meq30: ['', Validators.required],
      meq31: ['', Validators.required],
      meq32: ['', Validators.required],
      meq33: ['', Validators.required],
      meq34: ['', Validators.required],
      meq35: ['', Validators.required],
      meq36: ['', Validators.required],
      meq37: ['', Validators.required],
      breakedd: ['', [Validators.required, Validators.pattern("[0-9\.]{1,5}"), Validators.minLength(1), Validators.maxLength(5)]],
      breakeid: ['', [Validators.required, Validators.pattern("[0-9\.]{1,10}"), Validators.minLength(1), Validators.maxLength(5)]],
      breakeit: ['', [Validators.required, Validators.pattern("[0-9\.]{1,10}"), Validators.minLength(1), Validators.maxLength(5)]],
      breakedt: ['', [Validators.required, Validators.pattern("[0-9\.]{1,10}"), Validators.minLength(1), Validators.maxLength(5)]],
      meq38: ['', Validators.required],
      meq39: ['', Validators.required],
      meq40: ['', Validators.required],
      depthdd: ['', [Validators.required, Validators.pattern("[0-9\.]{1,10}"), Validators.minLength(1), Validators.maxLength(5)]],
      depthid: ['', [Validators.required, Validators.pattern("[0-9\.]{1,10}"), Validators.minLength(1), Validators.maxLength(5)]],
      depthit: ['', [Validators.required, Validators.pattern("[0-9\.]{1,10}"), Validators.minLength(1), Validators.maxLength(5)]],
      depthdt: ['', [Validators.required, Validators.pattern("[0-9\.]{1,10}"), Validators.minLength(1), Validators.maxLength(5)]],
      meq41: ['', Validators.required],
      meq42: ['', Validators.required],
      meq43: ['', Validators.required],
      meq44: ['', Validators.required],
      meq45: ['', Validators.required],
      meq46: ['', Validators.required],
      meq47: ['', Validators.required],
      meq48: ['', Validators.required],
      meq49: ['', Validators.required],
      meq50: ['', Validators.required],
      meq51: ['', Validators.required]
    });
  }

  private vehicleCertificationFormInit(){
    this.vehicleCertificationForm = this._formBuilder.group({
      cvq1: ['', Validators.required],
      cvq2: ['', Validators.required],
      cvq3: ['', Validators.required],
      cvq4: ['', Validators.required],
      cvq5: ['', Validators.required],
      cvq6: ['', Validators.required],
      cvq7: ['', Validators.required],
      cvq8: ['', Validators.required],
      cvq9: ['', Validators.required],
      cvq11: ['', Validators.required],
      cvq12: ['', Validators.required],
    });
  }

  private quotationFormInit(){
    this.quotationForm = this._formBuilder.group({
      take: [0, Validators.required],
      sale: [0, Validators.required],
      workforce: [0, Validators.required],
      spare_parts: [0, Validators.required],
      hyp: [0, Validators.required],
      total: [0], /* , Validators.required */
      take_value: [0, Validators.required],
      final_offer: [0, Validators.required],
      comments: ['']
      /* name_technical: ['awdaw', Validators.required],
      name_manager: ['Juan Pérez Uno', Validators.required],
      name_appraiser: ['Juan Pérez Dos', Validators.required] */
    });
  }

  private generalDataFormInit(){
    this.generalDataForm = this._formBuilder.group({
      name: ['Louis', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      surname: ['Pietro', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      phone: ['2234323456', [Validators.required, Validators.pattern("[0-9]+"), Validators.minLength(10), Validators.maxLength(10)]],
      distributor: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      valuation_date: ['', Validators.required],
      vin: ['01234567890123456', [Validators.required, Validators.pattern("[a-zA-Z0-9]+"), Validators.minLength(17), Validators.maxLength(17)]],
      version: ['Louis', Validators.required],
      mileage: ['123', [Validators.required, Validators.pattern("[0-9]{1,10}"), Validators.minLength(1), Validators.maxLength(10)]],
      color: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      plates: [''/* , [Validators.required, Validators.pattern("[a-zA-Z0-9]+"), Validators.minLength(7), Validators.maxLength(7)] */],
      cilindres: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9]+"), Validators.minLength(1), Validators.maxLength(8)]], /* Validators.pattern("[0-9]{1,10}") */
      brand: ['', Validators.required],
      year: ['', Validators.required],
      warranty_manual: [],
      direct_purchase: [],
      take_into_account: [],
      valid_warranty: []
    });
  }

  public getAppraiserChecklist(vin: number){  /* El parámetro era del tipo string */
    // this._appraiserChecklistService.getAppraiserChecklist(vin).subscribe(
    //   ({ code, status, sell_car_valuation_id }: SellCarValuation) => {
    //     if (code === 200 && status === 'success') {
    //       // console.log(sell_car_valuation_id);
    //       this.sellYourCar_id = sell_car_valuation_id.id;
    //       this.generalDataForm.patchValue({
    //         name:    sell_car_valuation_id.client_sale.user.name,
    //         surname: sell_car_valuation_id.client_sale.user.surname,
    //         phone:   sell_car_valuation_id.client_sale.phone1,
    //         vin:     sell_car_valuation_id.vin,
    //         brand:   sell_car_valuation_id.brand.id.toString(),
    //         version:   sell_car_valuation_id.version,
    //         year:    sell_car_valuation_id.year.toString(),
    //         mileage:    sell_car_valuation_id.km
    //       });

    //       this.generalDataForm.controls['name'].disable();
    //       this.generalDataForm.controls['surname'].disable();
    //       this.generalDataForm.controls['phone'].disable();
    //       this.generalDataForm.controls['vin'].disable();
    //       this.generalDataForm.controls['brand'].disable();
    //       this.generalDataForm.controls['version'].disable();
    //       this.generalDataForm.controls['year'].disable();
    //     }
    //   }
    // );
  }

  public getChecklistValuation(vin: string){
    this._appraiserChecklistService.getChecklistValuation(vin)
    .subscribe({
      // ( (resp: any) => { console.log(resp);})
      next: ({ code, status, DataChecklist }: ChecklistValuation) => {
        if (code === '200' && status === 'success') {

          if (DataChecklist.warranty_manual == 'yes') {
            this.checked = true;   
            this.generalDataForm.controls['warranty_manual'].setValue(this.checked);
          }else{
            this.checked = false;
            this.generalDataForm.controls['warranty_manual'].setValue(this.checked);
          }

          if (DataChecklist.direct_purchase == 'yes') {
            this.checkedp = true;
            this.generalDataForm.controls['direct_purchase'].setValue(this.checkedp);
          }else{
            this.checkedp = false;
            this.generalDataForm.controls['direct_purchase'].setValue(this.checkedp);
          }

          if (DataChecklist.take_into_account == 'yes') {
            this.checkedt = true;
            this.generalDataForm.controls['take_into_account'].setValue(this.checkedt);
          } else {
            this.checkedt = false;
            this.generalDataForm.controls['take_into_account'].setValue(this.checkedt);
          }

          if (DataChecklist.valid_warranty == 'yes') {
            this.checkedg = true;
            this.generalDataForm.controls['valid_warranty'].setValue(this.checkedg)
          } else {
            this.checkedg = false;
            this.generalDataForm.controls['valid_warranty'].setValue(this.checkedg);
          }

          this.generalDataForm.patchValue({
            distributor: DataChecklist.distributor,
            valuation_date: DataChecklist.valuation_date,
            color: DataChecklist.color,
            plates: DataChecklist.plates,
            cilindres: DataChecklist.cilindres
          });

          let valuationDate = DataChecklist.valuation_date.toString();
          let vd = valuationDate.split("-").reverse().join("-")
          this.inputdate.nativeElement.value = vd;

          this.extReviewForm.patchValue({
            req1: DataChecklist.req1,
            req2: DataChecklist.req2,
            req3: DataChecklist.req3,
            req4: DataChecklist.req4,
            req5: DataChecklist.req5,
            req6: DataChecklist.req6,
            req7: DataChecklist.req7,
            req8: DataChecklist.req8,
            req9: DataChecklist.req9,
            req10: DataChecklist.req10,
            req11: DataChecklist.req11,
            req12: DataChecklist.req12,
            req13: DataChecklist.req13,
            req14: DataChecklist.req14,
            req15: DataChecklist.req15,
            req16: DataChecklist.req16,
            req17: DataChecklist.req17,
            req18: DataChecklist.req18,
            req19: DataChecklist.req19,
            req20: DataChecklist.req20,
            req21: DataChecklist.req21,
            req22: DataChecklist.req22,
          });

          this.intReviewForm.patchValue({
            iq1: DataChecklist.iq1,
            iq2: DataChecklist.iq2,
            iq3: DataChecklist.iq3,
            iq4: DataChecklist.iq4,
            iq5: DataChecklist.iq5,
            iq6: DataChecklist.iq6,
            iq7: DataChecklist.iq7,
            iq8: DataChecklist.iq8,
            iq9: DataChecklist.iq9,
            iq10: DataChecklist.iq10,
            iq11: DataChecklist.iq11,
            iq12: DataChecklist.iq12,
            iq13: DataChecklist.iq13,
            iq14: DataChecklist.iq14,
            iq15: DataChecklist.iq15,
            iq16: DataChecklist.iq16,
            iq17: DataChecklist.iq17,
          });

          this.mechanicElectricForm.patchValue({
            meq1: DataChecklist.meq1,
            meq2: DataChecklist.meq2,
            meq3: DataChecklist.meq3,
            meq4: DataChecklist.meq4,
            meq5: DataChecklist.meq5,
            meq6: DataChecklist.meq6,
            meq7: DataChecklist.meq7,
            meq8: DataChecklist.meq8,
            meq9: DataChecklist.meq9,
            meq10: DataChecklist.meq10,
            meq11: DataChecklist.meq11,
            meq12: DataChecklist.meq12,
            meq13: DataChecklist.meq13,
            meq14: DataChecklist.meq14,
            meq15: DataChecklist.meq15,
            meq16: DataChecklist.meq16,
            meq17: DataChecklist.meq17,
            meq18: DataChecklist.meq18,
            meq19: DataChecklist.meq19,
            meq20: DataChecklist.meq20,
            meq21: DataChecklist.meq21,
            meq22: DataChecklist.meq22,
            meq23: DataChecklist.meq23,
            meq24: DataChecklist.meq24,
            meq25: DataChecklist.meq25,
            meq26: DataChecklist.meq26,
            meq27: DataChecklist.meq27,
            meq28: DataChecklist.meq28,
            meq29: DataChecklist.meq29,
            meq30: DataChecklist.meq30,
            meq31: DataChecklist.meq31,
            meq32: DataChecklist.meq32,
            meq33: DataChecklist.meq33,
            meq34: DataChecklist.meq34,
            meq35: DataChecklist.meq35,
            meq36: DataChecklist.meq36,
            meq37: DataChecklist.meq37,
            breakedd: DataChecklist.breakedd,
            breakeid: DataChecklist.breakeid,
            breakeit: DataChecklist.breakeit,
            breakedt: DataChecklist.breakedt,
            meq38: DataChecklist.meq38,
            meq39: DataChecklist.meq39,
            meq40: DataChecklist.meq40,
            depthdd: DataChecklist.depthdd,
            depthid: DataChecklist.depthid,
            depthit: DataChecklist.depthit,
            depthdt: DataChecklist.depthdt,
            meq41: DataChecklist.meq41,
            meq42: DataChecklist.meq42,
            meq43: DataChecklist.meq43,
            meq44: DataChecklist.meq44,
            meq45: DataChecklist.meq45,
            meq46: DataChecklist.meq46,
            meq47: DataChecklist.meq47,
            meq48: DataChecklist.meq48,
            meq49: DataChecklist.meq49,
            meq50: DataChecklist.meq50,
            meq51: DataChecklist.meq51,
          });

          this.vehicleCertificationForm.patchValue({
            cvq1: DataChecklist.cvq1,
            cvq2: DataChecklist.cvq2,
            cvq3: DataChecklist.cvq3,
            cvq4: DataChecklist.cvq4,
            cvq5: DataChecklist.cvq5,
            cvq6: DataChecklist.cvq6,
            cvq7: DataChecklist.cvq7,
            cvq8: DataChecklist.cvq8,
            cvq9: DataChecklist.cvq9,
            cvq11: DataChecklist.cvq11,
            cvq12: DataChecklist.cvq12,
          });

          this.quotationForm.patchValue({
            take: DataChecklist.take,
            sale: DataChecklist.sale,
            workforce: DataChecklist.workforce,
            spare_parts: DataChecklist.spare_parts,
            hyp: DataChecklist.hyp,
            total: DataChecklist.total,
            take_value: DataChecklist.take_value,
            final_offer: DataChecklist.final_offer,
            comments: DataChecklist.comments
            /* name_technical: DataChecklist.name_technical,
            name_manager: DataChecklist.name_manager,
            name_appraiser: DataChecklist.name_appraiser, */
          });
        } 

        // generalDataForm Fields disable   Desde aqui

        this.generalDataForm.controls['distributor'].disable();
        this.generalDataForm.controls['valuation_date'].disable();
        this.generalDataForm.controls['mileage'].disable();
        this.generalDataForm.controls['color'].disable();
        this.generalDataForm.controls['plates'].disable();
        this.generalDataForm.controls['cilindres'].disable();
        this.generalDataForm.controls['warranty_manual'].disable();
        this.generalDataForm.controls['direct_purchase'].disable();
        this.generalDataForm.controls['take_into_account'].disable();
        this.generalDataForm.controls['valid_warranty'].disable();

        // extReviewForm Fields disable

        // this.extReviewForm.controls['req1'].disable();
        DataChecklist.req1  === 'a2' || DataChecklist.req1  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.extReviewForm.controls['req1'].enable() : this.extReviewForm.controls['req1'].disable();
        DataChecklist.req2  === 'a2' || DataChecklist.req2  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.extReviewForm.controls['req2'].enable() : this.extReviewForm.controls['req2'].disable();
        DataChecklist.req3  === 'a2' || DataChecklist.req3  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.extReviewForm.controls['req3'].enable() : this.extReviewForm.controls['req3'].disable();
        DataChecklist.req4  === 'a2' || DataChecklist.req4  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.extReviewForm.controls['req4'].enable() : this.extReviewForm.controls['req4'].disable();
        DataChecklist.req5  === 'a2' || DataChecklist.req5  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.extReviewForm.controls['req5'].enable() : this.extReviewForm.controls['req5'].disable();
        DataChecklist.req6  === 'a2' || DataChecklist.req6  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.extReviewForm.controls['req6'].enable() : this.extReviewForm.controls['req6'].disable();
        DataChecklist.req7  === 'a2' || DataChecklist.req7  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.extReviewForm.controls['req7'].enable() : this.extReviewForm.controls['req7'].disable();
        DataChecklist.req8  === 'a2' || DataChecklist.req8  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.extReviewForm.controls['req8'].enable() : this.extReviewForm.controls['req8'].disable();
        DataChecklist.req9  === 'a2' || DataChecklist.req9  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.extReviewForm.controls['req9'].enable() : this.extReviewForm.controls['req9'].disable();
        DataChecklist.req10 === 'a2' || DataChecklist.req10 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.extReviewForm.controls['req10'].enable() : this.extReviewForm.controls['req10'].disable();
        DataChecklist.req11 === 'a2' || DataChecklist.req11 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.extReviewForm.controls['req11'].enable() : this.extReviewForm.controls['req11'].disable();
        DataChecklist.req12 === 'a2' || DataChecklist.req12 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.extReviewForm.controls['req12'].enable() : this.extReviewForm.controls['req12'].disable();
        DataChecklist.req13 === 'a2' || DataChecklist.req13 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.extReviewForm.controls['req13'].enable() : this.extReviewForm.controls['req13'].disable();
        DataChecklist.req14 === 'a2' || DataChecklist.req14 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.extReviewForm.controls['req14'].enable() : this.extReviewForm.controls['req14'].disable();
        DataChecklist.req15 === 'a2' || DataChecklist.req15 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.extReviewForm.controls['req15'].enable() : this.extReviewForm.controls['req15'].disable();
        DataChecklist.req16 === 'a2' || DataChecklist.req16 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.extReviewForm.controls['req16'].enable() : this.extReviewForm.controls['req16'].disable();
        DataChecklist.req17 === 'a2' || DataChecklist.req17 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.extReviewForm.controls['req17'].enable() : this.extReviewForm.controls['req17'].disable();
        DataChecklist.req18 === 'a2' || DataChecklist.req18 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.extReviewForm.controls['req18'].enable() : this.extReviewForm.controls['req18'].disable();
        DataChecklist.req19 === 'a2' || DataChecklist.req19 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.extReviewForm.controls['req19'].enable() : this.extReviewForm.controls['req19'].disable();
        DataChecklist.req20 === 'a2' || DataChecklist.req20 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.extReviewForm.controls['req20'].enable() : this.extReviewForm.controls['req20'].disable();
        DataChecklist.req21 === 'a2' || DataChecklist.req21 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.extReviewForm.controls['req21'].enable() : this.extReviewForm.controls['req21'].disable();
        DataChecklist.req22 === 'a2' || DataChecklist.req22 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.extReviewForm.controls['req22'].enable() : this.extReviewForm.controls['req22'].disable();
        
        // intReviewForm Fields disable

        // this.intReviewForm.controls['iq1'].disable();
        DataChecklist.iq1  === 'a2' || DataChecklist.iq1  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.intReviewForm.controls['iq1'].enable() : this.intReviewForm.controls['iq1'].disable();
        DataChecklist.iq2  === 'a2' || DataChecklist.iq2  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.intReviewForm.controls['iq2'].enable() : this.intReviewForm.controls['iq2'].disable();
        DataChecklist.iq3  === 'a2' || DataChecklist.iq3  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.intReviewForm.controls['iq3'].enable() : this.intReviewForm.controls['iq3'].disable();
        DataChecklist.iq4  === 'a2' || DataChecklist.iq4  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.intReviewForm.controls['iq4'].enable() : this.intReviewForm.controls['iq4'].disable();
        DataChecklist.iq5  === 'a2' || DataChecklist.iq5  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.intReviewForm.controls['iq5'].enable() : this.intReviewForm.controls['iq5'].disable();
        DataChecklist.iq6  === 'a2' || DataChecklist.iq6  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.intReviewForm.controls['iq6'].enable() : this.intReviewForm.controls['iq6'].disable();
        DataChecklist.iq7  === 'a2' || DataChecklist.iq7  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.intReviewForm.controls['iq7'].enable() : this.intReviewForm.controls['iq7'].disable();
        DataChecklist.iq8  === 'a2' || DataChecklist.iq8  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.intReviewForm.controls['iq8'].enable() : this.intReviewForm.controls['iq8'].disable();
        DataChecklist.iq9  === 'a2' || DataChecklist.iq9  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.intReviewForm.controls['iq9'].enable() : this.intReviewForm.controls['iq9'].disable();
        DataChecklist.iq10 === 'a2' || DataChecklist.iq10 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.intReviewForm.controls['iq10'].enable() : this.intReviewForm.controls['iq10'].disable();
        DataChecklist.iq11 === 'a2' || DataChecklist.iq11 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.intReviewForm.controls['iq11'].enable() : this.intReviewForm.controls['iq11'].disable();
        DataChecklist.iq12 === 'a2' || DataChecklist.iq12 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.intReviewForm.controls['iq12'].enable() : this.intReviewForm.controls['iq12'].disable();
        DataChecklist.iq13 === 'a2' || DataChecklist.iq13 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.intReviewForm.controls['iq13'].enable() : this.intReviewForm.controls['iq13'].disable();
        DataChecklist.iq14 === 'a2' || DataChecklist.iq14 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.intReviewForm.controls['iq14'].enable() : this.intReviewForm.controls['iq14'].disable();
        DataChecklist.iq15 === 'a2' || DataChecklist.iq15 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.intReviewForm.controls['iq15'].enable() : this.intReviewForm.controls['iq15'].disable();
        DataChecklist.iq16 === 'a2' || DataChecklist.iq16 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.intReviewForm.controls['iq16'].enable() : this.intReviewForm.controls['iq16'].disable();
        DataChecklist.iq17 === 'a2' || DataChecklist.iq17 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.intReviewForm.controls['iq17'].enable() : this.intReviewForm.controls['iq17'].disable();
        
        // mechanicElectricForm Fields disable
        
        // this.mechanicElectricForm.controls['meq1'].disable();
        DataChecklist.meq1  === 'a2' || DataChecklist.meq1  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq1'].enable() : this.mechanicElectricForm.controls['meq1'].disable();
        DataChecklist.meq2  === 'a2' || DataChecklist.meq2  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq2'].enable() : this.mechanicElectricForm.controls['meq2'].disable();
        DataChecklist.meq3  === 'a2' || DataChecklist.meq3  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq3'].enable() : this.mechanicElectricForm.controls['meq3'].disable();
        DataChecklist.meq4  === 'a2' || DataChecklist.meq4  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq4'].enable() : this.mechanicElectricForm.controls['meq4'].disable();
        DataChecklist.meq5  === 'a2' || DataChecklist.meq5  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq5'].enable() : this.mechanicElectricForm.controls['meq5'].disable();
        DataChecklist.meq6  === 'a2' || DataChecklist.meq6  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq6'].enable() : this.mechanicElectricForm.controls['meq6'].disable();
        DataChecklist.meq7  === 'a2' || DataChecklist.meq7  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq7'].enable() : this.mechanicElectricForm.controls['meq7'].disable();
        DataChecklist.meq8  === 'a2' || DataChecklist.meq8  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq8'].enable() : this.mechanicElectricForm.controls['meq8'].disable();
        DataChecklist.meq9  === 'a2' || DataChecklist.meq9  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq9'].enable() : this.mechanicElectricForm.controls['meq9'].disable();
        DataChecklist.meq10 === 'a2' || DataChecklist.meq10 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq10'].enable() : this.mechanicElectricForm.controls['meq10'].disable();
        DataChecklist.meq11 === 'a2' || DataChecklist.meq11 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq11'].enable() : this.mechanicElectricForm.controls['meq11'].disable();
        DataChecklist.meq12 === 'a2' || DataChecklist.meq12 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq12'].enable() : this.mechanicElectricForm.controls['meq12'].disable();
        DataChecklist.meq13 === 'a2' || DataChecklist.meq13 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq13'].enable() : this.mechanicElectricForm.controls['meq13'].disable();
        DataChecklist.meq14 === 'a2' || DataChecklist.meq14 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq14'].enable() : this.mechanicElectricForm.controls['meq14'].disable();
        DataChecklist.meq15 === 'a2' || DataChecklist.meq15 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq15'].enable() : this.mechanicElectricForm.controls['meq15'].disable();
        DataChecklist.meq16 === 'a2' || DataChecklist.meq16 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq16'].enable() : this.mechanicElectricForm.controls['meq16'].disable();
        DataChecklist.meq17 === 'a2' || DataChecklist.meq17 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq17'].enable() : this.mechanicElectricForm.controls['meq17'].disable();
        DataChecklist.meq18 === 'a2' || DataChecklist.meq18 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq18'].enable() : this.mechanicElectricForm.controls['meq18'].disable();
        DataChecklist.meq19 === 'a2' || DataChecklist.meq19 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq19'].enable() : this.mechanicElectricForm.controls['meq19'].disable();
        DataChecklist.meq20 === 'a2' || DataChecklist.meq20 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq20'].enable() : this.mechanicElectricForm.controls['meq20'].disable();
        DataChecklist.meq21 === 'a2' || DataChecklist.meq21 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq21'].enable() : this.mechanicElectricForm.controls['meq21'].disable();
        DataChecklist.meq22 === 'a2' || DataChecklist.meq22 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq22'].enable() : this.mechanicElectricForm.controls['meq22'].disable();
        DataChecklist.meq23 === 'a2' || DataChecklist.meq23 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq23'].enable() : this.mechanicElectricForm.controls['meq23'].disable();
        DataChecklist.meq24 === 'a2' || DataChecklist.meq24 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq24'].enable() : this.mechanicElectricForm.controls['meq24'].disable();
        DataChecklist.meq25 === 'a2' || DataChecklist.meq25 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq25'].enable() : this.mechanicElectricForm.controls['meq25'].disable();
        DataChecklist.meq26 === 'a2' || DataChecklist.meq26 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq26'].enable() : this.mechanicElectricForm.controls['meq26'].disable();
        DataChecklist.meq27 === 'a2' || DataChecklist.meq27 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq27'].enable() : this.mechanicElectricForm.controls['meq27'].disable();
        DataChecklist.meq28 === 'a2' || DataChecklist.meq28 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq28'].enable() : this.mechanicElectricForm.controls['meq28'].disable();
        DataChecklist.meq29 === 'a2' || DataChecklist.meq29 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq29'].enable() : this.mechanicElectricForm.controls['meq29'].disable();
        DataChecklist.meq30 === 'a2' || DataChecklist.meq30 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq30'].enable() : this.mechanicElectricForm.controls['meq30'].disable();
        DataChecklist.meq31 === 'a2' || DataChecklist.meq31 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq31'].enable() : this.mechanicElectricForm.controls['meq31'].disable();
        DataChecklist.meq32 === 'a2' || DataChecklist.meq32 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq32'].enable() : this.mechanicElectricForm.controls['meq32'].disable();
        DataChecklist.meq33 === 'a2' || DataChecklist.meq33 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq33'].enable() : this.mechanicElectricForm.controls['meq33'].disable();
        DataChecklist.meq34 === 'a2' || DataChecklist.meq34 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq34'].enable() : this.mechanicElectricForm.controls['meq34'].disable();
        DataChecklist.meq35 === 'a2' || DataChecklist.meq35 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq35'].enable() : this.mechanicElectricForm.controls['meq35'].disable();
        DataChecklist.meq36 === 'a2' || DataChecklist.meq36 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq36'].enable() : this.mechanicElectricForm.controls['meq36'].disable();
        DataChecklist.meq37 === 'a2' || DataChecklist.meq37 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq37'].enable() : this.mechanicElectricForm.controls['meq37'].disable();
        this.mechanicElectricForm.controls['breakedd'].disable();
        this.mechanicElectricForm.controls['breakeid'].disable();
        this.mechanicElectricForm.controls['breakeit'].disable();
        this.mechanicElectricForm.controls['breakedt'].disable();
        DataChecklist.meq38 === 'a2' || DataChecklist.meq38 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq38'].enable() : this.mechanicElectricForm.controls['meq38'].disable();
        DataChecklist.meq39 === 'a2' || DataChecklist.meq39 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq39'].enable() : this.mechanicElectricForm.controls['meq39'].disable();
        DataChecklist.meq40 === 'a2' || DataChecklist.meq40 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq40'].enable() : this.mechanicElectricForm.controls['meq40'].disable();
        this.mechanicElectricForm.controls['depthdd'].disable();
        this.mechanicElectricForm.controls['depthid'].disable();
        this.mechanicElectricForm.controls['depthit'].disable();
        this.mechanicElectricForm.controls['depthdt'].disable();
        DataChecklist.meq41 === 'a2' || DataChecklist.meq41 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq41'].enable() : this.mechanicElectricForm.controls['meq41'].disable();
        DataChecklist.meq42 === 'a2' || DataChecklist.meq42 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq42'].enable() : this.mechanicElectricForm.controls['meq42'].disable();
        DataChecklist.meq43 === 'a2' || DataChecklist.meq43 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq43'].enable() : this.mechanicElectricForm.controls['meq43'].disable();
        DataChecklist.meq44 === 'a2' || DataChecklist.meq44 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq44'].enable() : this.mechanicElectricForm.controls['meq44'].disable();
        DataChecklist.meq45 === 'a2' || DataChecklist.meq45 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq45'].enable() : this.mechanicElectricForm.controls['meq45'].disable();
        DataChecklist.meq46 === 'a2' || DataChecklist.meq46 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq46'].enable() : this.mechanicElectricForm.controls['meq46'].disable();
        DataChecklist.meq47 === 'a2' || DataChecklist.meq47 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq47'].enable() : this.mechanicElectricForm.controls['meq47'].disable();
        DataChecklist.meq48 === 'a2' || DataChecklist.meq48 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq48'].enable() : this.mechanicElectricForm.controls['meq48'].disable();
        DataChecklist.meq49 === 'a2' || DataChecklist.meq49 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq49'].enable() : this.mechanicElectricForm.controls['meq49'].disable();
        DataChecklist.meq50 === 'a2' || DataChecklist.meq50 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq50'].enable() : this.mechanicElectricForm.controls['meq50'].disable();
        DataChecklist.meq51 === 'a2' || DataChecklist.meq51 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.mechanicElectricForm.controls['meq51'].enable() : this.mechanicElectricForm.controls['meq51'].disable();
        
        // vehicleCertificationForm Fields disable
        
        // this.vehicleCert ificationForm.controls['cvq1'].disable();
        DataChecklist.cvq1  === 'a2' || DataChecklist.cvq1  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.vehicleCertificationForm.controls['cvq1'].enable() : this.vehicleCertificationForm.controls['cvq1'].disable();
        DataChecklist.cvq2  === 'a2' || DataChecklist.cvq2  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.vehicleCertificationForm.controls['cvq2'].enable() : this.vehicleCertificationForm.controls['cvq2'].disable();
        DataChecklist.cvq3  === 'a2' || DataChecklist.cvq3  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.vehicleCertificationForm.controls['cvq3'].enable() : this.vehicleCertificationForm.controls['cvq3'].disable();
        DataChecklist.cvq4  === 'a2' || DataChecklist.cvq4  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.vehicleCertificationForm.controls['cvq4'].enable() : this.vehicleCertificationForm.controls['cvq4'].disable();
        DataChecklist.cvq5  === 'a2' || DataChecklist.cvq5  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.vehicleCertificationForm.controls['cvq5'].enable() : this.vehicleCertificationForm.controls['cvq5'].disable();
        DataChecklist.cvq6  === 'a2' || DataChecklist.cvq6  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.vehicleCertificationForm.controls['cvq6'].enable() : this.vehicleCertificationForm.controls['cvq6'].disable();
        DataChecklist.cvq7  === 'a2' || DataChecklist.cvq7  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.vehicleCertificationForm.controls['cvq7'].enable() : this.vehicleCertificationForm.controls['cvq7'].disable();
        DataChecklist.cvq8  === 'a2' || DataChecklist.cvq8  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.vehicleCertificationForm.controls['cvq8'].enable() : this.vehicleCertificationForm.controls['cvq8'].disable();
        DataChecklist.cvq9  === 'a2' || DataChecklist.cvq9  === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.vehicleCertificationForm.controls['cvq9'].enable() : this.vehicleCertificationForm.controls['cvq9'].disable();
        DataChecklist.cvq11 === 'a2' || DataChecklist.cvq11 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.vehicleCertificationForm.controls['cvq11'].enable() : this.vehicleCertificationForm.controls['cvq11'].disable();
        DataChecklist.cvq12 === 'a2' || DataChecklist.cvq12 === 'a3' && DataChecklist.status === 'bought' && DataChecklist.status === 'readyForSale' ? this.vehicleCertificationForm.controls['cvq12'].enable() : this.vehicleCertificationForm.controls['cvq12'].disable();

      },
      error: (error) => {
        this.onSubmit();
      }
    });
  }

  /**
   * Get Brands
   */
  private getBrands() {
    this._venderTuAutoService.brands()
    .subscribe({
      next: ({ code, brands }: Brands) => {
        this.brands = (code === 200) ? brands : [];
      }
    });
  }

  /**
   * Get Models by Brand Selected
   */
  public getModels(brand_id: number) {
    this._venderTuAutoService.getModels(brand_id)
    .subscribe({
      next: ({ code, models }: DataModels) => {
        this.models = (code === 200) ? models : [];
      }
    });
  }

  /**
   * Form Information
   */
  public onSubmit() {
    // Change spinner
    this.spinner = true;

    this._appraiserChecklistService.getChecklistAppraiser()
    .subscribe({
      next: ({ code, status, Check_List }: ValuatorChecklist) => {
        // Busca el id dentro del arreglo.
        const find = Check_List.data.some(cl => cl.sell_your_car_id === this.sellYourCar_id);          /* cl.id */

        if (code == '200' && status == 'success') {
          // Si es true, actualiza el checklist
          if (find) {
            // Buscamos y filtramos el checklist para solo obtener el objeto deseado.
            const check = Check_List.data.filter(cl => cl.sell_your_car_id === this.sellYourCar_id);   /* cl.id */
            this.id = check[0].id;
            if (check[0].status === 'bought' || check[0].status === 'readyForSale') {
              this.statuSelect = 'readyForSale';
            }else{
              this.statuSelect = 'reviewed';
            }
            this.updateChecklist(this.id, this.sellYourCar_id);
            return;
          } else {
            this.setChecklist(this.sellYourCar_id);
            return;
          }
        } else {
          this.setChecklist(this.sellYourCar_id);
            return;
        }
      }
    });
  }

  public setChecklist(id: number){

    this._appraiserChecklistService.getTechnician(this._localS.id)
    .subscribe({
      next: ((resp: Technician) => {
        // console.log(resp.data_technician.id);
        this.technician_id = resp.data_technician.id;
      })
    });

    this._valuationFormGroupGeneral = {
      'sell_your_car_id': id,
      'technician_id': this.technician_id,
      ...this.generalDataForm.value,
      'warranty_manual': (this.generalDataForm.get('warranty_manual')?.value) ? 'yes' : 'no',
      'direct_purchase': (this.generalDataForm.get('direct_purchase')?.value) ? 'yes' : 'no',
      'take_into_account': (this.generalDataForm.get('take_into_account')?.value) ? 'yes' : 'no',
      'valid_warranty': (this.generalDataForm.get('valid_warranty')?.value) ? 'yes' : 'no',
      ...this.extReviewForm.value,
      ...this.intReviewForm.value,
      ...this.mechanicElectricForm.value,
      ...this.vehicleCertificationForm.value,
      ...this.quotationForm.value
    };

    this._appraiserChecklistService.setAppraiserChecklist(this._valuationFormGroupGeneral)
    .subscribe({
      next: ((resp: ValuatorChecklist) => {
        // console.log(resp);
        if (resp.code === '200' && resp.status === 'success') {
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

    this._appraiserChecklistService.updateAppraiserKm(id, { km: this.generalDataForm.get('mileage')?.value })
    .subscribe({
      next: ((resp: SellCarValuation) => {
        // console.log(resp);
      })
    });

  }

  public updateChecklist(id: number, sellYourCarId: number){
    this._valuationFormGroupGeneral = {
      'id': id,
      'sell_your_car_id': sellYourCarId,
      ...this.generalDataForm.value,
      'warranty_manual': (this.generalDataForm.get('warranty_manual')?.value) ? 'yes' : 'no',
      'direct_purchase': (this.generalDataForm.get('direct_purchase')?.value) ? 'yes' : 'no',
      'take_into_account': (this.generalDataForm.get('take_into_account')?.value) ? 'yes' : 'no',
      'valid_warranty': (this.generalDataForm.get('valid_warranty')?.value) ? 'yes' : 'no',
      'status': this.statuSelect,
      ...this.extReviewForm.getRawValue(),
      ...this.extReviewForm.value,
      ...this.intReviewForm.getRawValue(),
      ...this.intReviewForm.value,
      ...this.mechanicElectricForm.getRawValue(),
      ...this.mechanicElectricForm.value,
      ...this.vehicleCertificationForm.getRawValue(),
      ...this.vehicleCertificationForm.value,
      ...this.quotationForm.value,
    };

    this._appraiserChecklistService.updateAppraiserKm(sellYourCarId, { km: this.generalDataForm.get('mileage')?.value })
    .subscribe({
      next: ((resp: SellCarValuation) => {
        // console.log(resp);
      })
    });

    this._appraiserChecklistService.updateAppraiserChecklist(id, this._valuationFormGroupGeneral)
    .subscribe({
      next: ((resp: ValuatorChecklist) => {
        // console.log(resp);
        // Change spinner
        this.spinner = false;
      })
    });
  }

  public onSubmitAll(){
    this._appraiserChecklistService.getChecklistAppraiser()
    .subscribe({
      next: ({ code, status, Check_List }: ValuatorChecklist) => {
        // Busca el id desntro del arreglo.
        const find = Check_List.data.some(cl => cl.sell_your_car_id === this.sellYourCar_id); /* cl.id */
        if (code == '200' && status == 'success') {
          // Si es true, actualiza el checklist
          if (find) {
            // Buscamos y filtramos el checklist para solo obtener el objeto deseado.
            const check = Check_List.data.filter(cl => cl.sell_your_car_id === this.sellYourCar_id);  /* cl.id */
            this.id = check[0].id;
            if (check[0].status === 'bought' || check[0].status === 'readyForSale') {
              this.statuSelect = 'readyForSale';
            }else{
              this.statuSelect = 'reviewed';
            }
            this.updateChecklistAll(this.id, this.sellYourCar_id);
            return;
          }else{
            this.statuSelect = 'reviewed';
            this.setChecklistAll(this.sellYourCar_id);
            return;
          }
        } else {
          this.statuSelect = 'reviewed';
          this.setChecklistAll(this.sellYourCar_id);
          return;
        }
      }
    });
  }

  public setChecklistAll(id: number){

    this._appraiserChecklistService.getTechnician(this._localS.id)
    .subscribe({
      next: ((resp: Technician) => {
        // console.log(resp.data_technician.id);
        this.technician_id = resp.data_technician.id;
      })
    });

    this._valuationFormGroupGeneral = {
      'sell_your_car_id': id,
      'technician_id': this.technician_id,
      ...this.generalDataForm.value,
      'warranty_manual': (this.generalDataForm.get('warranty_manual')?.value) ? 'yes' : 'no',
      'direct_purchase': (this.generalDataForm.get('direct_purchase')?.value) ? 'yes' : 'no',
      'take_into_account': (this.generalDataForm.get('take_into_account')?.value) ? 'yes' : 'no',
      'valid_warranty': (this.generalDataForm.get('valid_warranty')?.value) ? 'yes' : 'no',
      'status': this.statuSelect,
      ...this.extReviewForm.value,
      ...this.intReviewForm.value,
      ...this.mechanicElectricForm.value,
      ...this.vehicleCertificationForm.value,
      ...this.quotationForm.value
    };

    this._appraiserChecklistService.updateAppraiserKm(id, { km: this.generalDataForm.get('mileage')?.value })
    .subscribe({
      next: ((resp: SellCarValuation) => {
        // console.log(resp);
      })
    });

    this._appraiserChecklistService.setAppraiserChecklist(this._valuationFormGroupGeneral)
    .subscribe({
      next: ((resp: ValuatorChecklist) => {
        // console.log(resp);

        if (resp.code === '200' && resp.status === 'success') {
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

          this._bottomSheetRef.dismiss();
          this._router.navigateByUrl('/admin/appraiser/valuaciones');
          window.location.reload();
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
        // Redirect
        this._router.navigateByUrl('/admin/appraiser/valuaciones');
      })
    });
  }

  public updateChecklistAll(id: number, sellYourCarId: number){
    this._valuationFormGroupGeneral = {
      'id': id,
      'sell_your_car_id': sellYourCarId,
      ...this.generalDataForm.value,
      'warranty_manual': (this.generalDataForm.get('warranty_manual')?.value) ? 'yes' : 'no',
      'direct_purchase': (this.generalDataForm.get('direct_purchase')?.value) ? 'yes' : 'no',
      'take_into_account': (this.generalDataForm.get('take_into_account')?.value) ? 'yes' : 'no',
      'valid_warranty': (this.generalDataForm.get('valid_warranty')?.value) ? 'yes' : 'no',
      'status': this.statuSelect,
      ...this.extReviewForm.getRawValue(),
      ...this.extReviewForm.value,
      ...this.intReviewForm.getRawValue(),
      ...this.intReviewForm.value,
      ...this.mechanicElectricForm.getRawValue(),
      ...this.mechanicElectricForm.value,
      ...this.vehicleCertificationForm.getRawValue(),
      ...this.vehicleCertificationForm.value,
      ...this.quotationForm.value,
    };

    this._appraiserChecklistService.updateAppraiserKm(sellYourCarId, { km: this.generalDataForm.get('mileage')?.value })
    .subscribe({
      next: ((resp: SellCarValuation) => {
        // console.log(resp);
      })
    });

    this._appraiserChecklistService.updateAppraiserChecklist(id, this._valuationFormGroupGeneral)
    .subscribe({
      next: ((resp: ValuatorChecklist) => {
        // console.log(resp);
        if (resp.code === '200' && resp.status === 'success') {
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

          this._bottomSheetRef.dismiss();
          this._router.navigateByUrl('/admin/appraiser/valuaciones');
          window.location.reload();
        } else {
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
        // Redirect
        this._router.navigateByUrl('/admin/appraiser/valuaciones');
      })
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

}

