import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

// Services
import { VendeTuAutoService } from '../../../vender-autos/services/vende-tu-auto.service';
import { DetailService } from '../../../comprar-autos/services/detail/detail.service';
import { FinancingService } from '../../services/financing.service';
import { AuthService } from 'src/app/auth/services/auth.service';

// Interfaces
import { DataModels, Model } from '../../../comprar-autos/interfaces/compra-tu-auto/data_models.interface';
import { State, StateElement, Financing, Reference, UploadFilesFinancing } from '../../interfaces/financing/financing';
import { VehicleData, Vehicle } from '../../../comprar-autos/interfaces/detail/vehicle_data.interface';
import { UserEmailData } from '../../../vender-autos/interfaces/user-email-data.interface';
import { Branch, Brands } from '../../../vender-autos/interfaces/vende-tu-auto.interface';
import { Client, Register } from 'src/app/auth/interfaces/register.interface';
import { Login } from 'src/app/auth/interfaces/login.interface';

// Pipes
import { DatePipe } from '@angular/common';

// Animations
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-financing-form',
  templateUrl: './financing-form.component.html',
  styleUrls: ['./financing-form.component.css'],
  providers: [
    DatePipe,
    { 
      provide: STEPPER_GLOBAL_OPTIONS, 
      useValue: { 
        showError: true 
      } 
    }
  ]
})

export class FinancingFormComponent implements OnInit{
  // References of Help
  public spinner: boolean = false;
  public maxDate?: Date; 

  // References forms
  public financingFormGroup!: UntypedFormGroup;  
  public clientFormGroup!: UntypedFormGroup;
  public generalFormGroup!: UntypedFormGroup;
  public questionsFormGroup!: UntypedFormGroup;
  public filesFormGroup!: UntypedFormGroup;
  private financing!: UntypedFormGroup;
  
  // References "Price"    
  public priceMax = 3000000;
  public priceMin = 0;  
  public priceValue = this.priceMin;  

  // References "Hitch"  
  public hitchMax = 2400000;
  public hitchMin = 0;  
  public hitchValue: number = this.hitchMin;  

  // References arrays
  public years: number[] = [];
  public models: Model[] = [];
  public brands: Branch[] = [];
  public states: StateElement[] = [];

  public userAgent: string = '';

  public selected = '60';

  public vin!:string;
  public userId!:string;

  // Card Financings
  @ViewChild('financingm12') financingm12!: ElementRef<HTMLInputElement>;
  @ViewChild('financingm24') financingm24!: ElementRef<HTMLInputElement>;
  @ViewChild('financingm48') financingm48!: ElementRef<HTMLInputElement>;
  @ViewChild('financingm60') financingm60!: ElementRef<HTMLInputElement>;

  constructor(
    private _router: Router,
    private _formBuilder: UntypedFormBuilder, 
    private _venderTuAutoService: VendeTuAutoService,
    private _financingService: FinancingService,
    private _activatedRoute: ActivatedRoute,
    private _detailService: DetailService,
    private _authService: AuthService,
    private _datePipe: DatePipe,
    private titleService: Title
  ) { 
    // Set Title View
    this.titleService.setTitle('Precalificar para financiamiento | Proceso'); 

    // Form Initialization
    this.createFormFinancingGroup();
    this.createFormClientGroup();
    this.createFormGeneralGroup();  
    this.createFormQuestionsGroup();
    this.createFilesFormGroup();
    /*
    // Checking in URL for search vin
    if (this._activatedRoute.snapshot.params.vin) {
      this.getVehicle(this._activatedRoute.snapshot.params.vin);    
    }  
    */   
    this._activatedRoute.params
    .subscribe({
      next: (params) => {
        this.scrollTop();

        this.vin = params['vin'];
        this.userId = params['userId'];

        if(this.vin != undefined){
          // Gather vehicle information
          this.getVehicle(this.vin);
        }
      }
    });
    
    // Set max date
    const currentYear = new Date().getFullYear();    
    this.maxDate = new Date(currentYear + 1, 11, 31);
    
  }  

  ngOnInit(): void {
    this.userAgent = window.navigator.userAgent;
    this.scrollTop();

    // Calling the initial functions of the form
    this.getBrands();
    this.getStates(); 

    // Years of vehicles allowed
    let year = new Date().getFullYear();
    for (let i = year; i > year-9; i--) {      /**Antes era let i = year+1 */
      this.years.push(i);      
    }
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }

  /**
   * Getters Inputs Check
  */

  get priceInvalid() {
    return this.financingFormGroup.get('price')!.invalid && (this.financingFormGroup.get('price')!.dirty || this.financingFormGroup.get('price')!.touched);
  }

  get hitchInvalid() {
    return this.financingFormGroup.get('hitch')!.invalid && (this.financingFormGroup.get('hitch')!.dirty || this.financingFormGroup.get('hitch')!.touched);
  }

  get yearInvalid() {
    return this.financingFormGroup.get('year')!.invalid && (this.financingFormGroup.get('year')!.dirty || this.financingFormGroup.get('year')!.touched);
  }

  get brandInvalid() {
    return this.financingFormGroup.get('brand')!.invalid && (this.financingFormGroup.get('brand')!.dirty || this.financingFormGroup.get('brand')!.touched);
  }

  get modelInvalid() {
    return this.financingFormGroup.get('model')!.invalid && (this.financingFormGroup.get('model')!.dirty || this.financingFormGroup.get('model')!.touched);
  }


  get nameInvalid() {
    return this.clientFormGroup.get('name')!.invalid && (this.clientFormGroup.get('name')!.dirty || this.clientFormGroup.get('name')!.touched);
  }

  get surnameInvalid() {
    return this.clientFormGroup.get('surname')!.invalid && (this.clientFormGroup.get('surname')!.dirty || this.clientFormGroup.get('surname')!.touched);
  }

  get mothernameInvalid() {
    return this.clientFormGroup.get('mothername')!.invalid && (this.clientFormGroup.get('mothername')!.dirty || this.clientFormGroup.get('mothername')!.touched);
  }

  get curpInvalid() {
    return this.clientFormGroup.get('curp')!.invalid && (this.clientFormGroup.get('curp')!.dirty || this.clientFormGroup.get('curp')!.touched);
  }

  get genderInvalid() {
    return this.clientFormGroup.get('gender')!.invalid && (this.clientFormGroup.get('gender')!.dirty || this.clientFormGroup.get('gender')!.touched);
  }

  get emailInvalid() {
    return this.clientFormGroup.get('email')!.invalid && (this.clientFormGroup.get('email')!.dirty || this.clientFormGroup.get('email')!.touched);
  }

  get rfcInvalid() {
    return this.clientFormGroup.get('rfc')!.invalid && (this.clientFormGroup.get('rfc')!.dirty || this.clientFormGroup.get('rfc')!.touched);
  }

  get phoneInvalid() {
    return this.clientFormGroup.get('phone')!.invalid && (this.clientFormGroup.get('phone')!.dirty || this.clientFormGroup.get('phone')!.touched);
  }

  get civilStatusInvalid() {
    return this.clientFormGroup.get('civil_status')!.invalid && (this.clientFormGroup.get('civil_status')!.dirty || this.clientFormGroup.get('civil_status')!.touched);
  }

  get studiesLevelInvalid() {
    return this.clientFormGroup.get('studies_level')!.invalid && (this.clientFormGroup.get('studies_level')!.dirty || this.clientFormGroup.get('studies_level')!.touched);
  }

  get economicDependentsInvalid() {
    return this.clientFormGroup.get('economic_dependents')!.invalid && (this.clientFormGroup.get('economic_dependents')!.dirty || this.clientFormGroup.get('economic_dependents')!.touched);
  }

  get hasVehicleInvalid() {
    return this.clientFormGroup.get('has_vehicle')!.invalid && (this.clientFormGroup.get('has_vehicle')!.dirty || this.clientFormGroup.get('has_vehicle')!.touched);
  }

  get streetNameInvalid() {
    return this.clientFormGroup.get('address')?.get('street_name')!.invalid && (this.clientFormGroup.get('address')?.get('street_name')!.dirty || this.clientFormGroup.get('address')?.get('street_name')!.touched);
  }

  get suburbInvalid() {
    return this.clientFormGroup.get('address')?.get('suburb')!.invalid && (this.clientFormGroup.get('address')?.get('suburb')!.dirty || this.clientFormGroup.get('address')?.get('suburb')!.touched);
  }

  get numberInvalid() {
    return this.clientFormGroup.get('address')?.get('number')!.invalid && (this.clientFormGroup.get('address')?.get('number')!.dirty || this.clientFormGroup.get('address')?.get('number')!.touched);
  }

  get postalCodeInvalid() {
    return this.clientFormGroup.get('address')?.get('postal_code')!.invalid && (this.clientFormGroup.get('address')?.get('postal_code')!.dirty || this.clientFormGroup.get('address')?.get('postal_code')!.touched);
  }

  get stateInvalid() {
    return this.clientFormGroup.get('address')?.get('state')!.invalid && (this.clientFormGroup.get('address')?.get('state')!.dirty || this.clientFormGroup.get('address')?.get('state')!.touched);
  }

  get municipalityInvalid() {
    return this.clientFormGroup.get('address')?.get('municipality')!.invalid && (this.clientFormGroup.get('address')?.get('municipality')!.dirty || this.clientFormGroup.get('address')?.get('municipality')!.touched);
  }

  get employmentSituationInvalid() {
    return this.generalFormGroup.get('employment_situation')?.invalid && (this.generalFormGroup.get('employment_situation')?.dirty || this.generalFormGroup.get('employment_situation')?.touched);
  }

  get companyInvalid() {
    return this.generalFormGroup.get('company')!.invalid && (this.generalFormGroup.get('company')!.dirty || this.generalFormGroup.get('company')!.touched);
  }

  get salaryInvalid() {
    return this.generalFormGroup.get('salary')?.invalid && (this.generalFormGroup.get('salary')?.dirty || this.generalFormGroup.get('salary')?.touched);
  }

  get roleInvalid() {
    return this.generalFormGroup.get('role')?.invalid && (this.generalFormGroup.get('role')?.dirty || this.generalFormGroup.get('role')?.touched);
  }

  get dateStartInvalid() {
    return this.generalFormGroup.get('date_start')?.invalid && (this.generalFormGroup.get('date_start')?.dirty || this.generalFormGroup.get('date_start')?.touched);
  }

  get numberPhoneCInvalid() {
    return this.generalFormGroup.get('number_company')?.invalid && (this.generalFormGroup.get('number_company')?.dirty || this.generalFormGroup.get('number_company')?.touched);
  }

  // Address Company
  get streetNameCInvalid() {
    return this.generalFormGroup.get('address_company')?.get('street_name')!.invalid && (this.generalFormGroup.get('address_company')?.get('street_name')!.dirty || this.generalFormGroup.get('address_company')?.get('street_name')!.touched);
  }

  get suburbCInvalid() {
    return this.generalFormGroup.get('address_company')?.get('suburb')!.invalid && (this.generalFormGroup.get('address_company')?.get('suburb')!.dirty || this.generalFormGroup.get('address_company')?.get('suburb')!.touched);
  }

  get numberCInvalid() {
    return this.generalFormGroup.get('address_company')?.get('number')!.invalid && (this.generalFormGroup.get('address_company')?.get('number')!.dirty || this.generalFormGroup.get('address_company')?.get('number')!.touched);
  }

  get postalCodeCInvalid() {
    return this.generalFormGroup.get('address_company')?.get('postal_code')!.invalid && (this.generalFormGroup.get('address_company')?.get('postal_code')!.dirty || this.generalFormGroup.get('address_company')?.get('postal_code')!.touched);
  }

  get stateCInvalid() {
    return this.generalFormGroup.get('address_company')?.get('state')!.invalid && (this.generalFormGroup.get('address_company')?.get('state')!.dirty || this.generalFormGroup.get('address_company')?.get('state')!.touched);
  }

  get municipalityCInvalid() {
    return this.generalFormGroup.get('address_company')?.get('municipality')!.invalid && (this.generalFormGroup.get('address_company')?.get('municipality')!.dirty || this.generalFormGroup.get('address_company')?.get('municipality')!.touched);
  }

  

  // Relationship R1
  // get nameR1Invalid() {
  //   return this.generalFormGroup.get('references.person_one')?.get('name')?.invalid && (this.generalFormGroup.get('references.person_one')?.get('name')?.dirty || this.generalFormGroup.get('references.person_one')?.get('name')?.touched);
  // }

  // get surnameR1Invalid() {
  //   return this.generalFormGroup.get('references.person_one')?.get('surname')?.invalid && (this.generalFormGroup.get('references.person_one')?.get('surname')?.dirty || this.generalFormGroup.get('references.person_one')?.get('surname')?.touched);
  // }

  // get phoneR1Invalid() {
  //   return this.generalFormGroup.get('references.person_one')?.get('phone')?.invalid && (this.generalFormGroup.get('references.person_one')?.get('phone')?.dirty || this.generalFormGroup.get('references.person_one')?.get('phone')?.touched);
  // }

  // get relationshipR1Invalid() {
  //   return this.generalFormGroup.get('references.person_one')?.get('relationship')?.invalid && (this.generalFormGroup.get('references.person_one')?.get('relationship')?.dirty || this.generalFormGroup.get('references.person_one')?.get('relationship')?.touched);
  // }

  // Address Company
  // get streetNameR1Invalid() {
  //   return this.generalFormGroup.get('references.person_one')?.get('street_name')?.invalid && (this.generalFormGroup.get('references.person_one')?.get('street_name')?.dirty || this.generalFormGroup.get('references.person_one')?.get('street_name')?.touched);    
  // }

  // get suburbR1Invalid() {
  //   return this.generalFormGroup.get('references.person_one')?.get('suburb')?.invalid && (this.generalFormGroup.get('references.person_one')?.get('suburb')?.dirty || this.generalFormGroup.get('references.person_one')?.get('suburb')?.touched);        
  // }

  // get numberR1Invalid() {
  //   return this.generalFormGroup.get('references.person_one')?.get('number')?.invalid && (this.generalFormGroup.get('references.person_one')?.get('number')?.dirty || this.generalFormGroup.get('references.person_one')?.get('number')?.touched);    
  // }

  // get postalCodeR1Invalid() {
  //   return this.generalFormGroup.get('references.person_one')?.get('postal_code')?.invalid && (this.generalFormGroup.get('references.person_one')?.get('postal_code')?.dirty || this.generalFormGroup.get('references.person_one')?.get('postal_code')?.touched);
  // }

  // get stateR1Invalid() {
  //   return this.generalFormGroup.get('references.person_one')?.get('state')?.invalid && (this.generalFormGroup.get('references.person_one')?.get('state')?.dirty || this.generalFormGroup.get('references.person_one')?.get('state')?.touched);
  // }

  // get municipalityR1Invalid() {
  //   return this.generalFormGroup.get('references.person_one')?.get('municipality')?.invalid && (this.generalFormGroup.get('references.person_one')?.get('municipality')?.dirty || this.generalFormGroup.get('references.person_one')?.get('municipality')?.touched);
  // }



  // Relationship R2
  // get nameR2Invalid() {
  //   return this.generalFormGroup.get('references.person_two')?.get('name')?.invalid && (this.generalFormGroup.get('references.person_two')?.get('name')?.dirty || this.generalFormGroup.get('references.person_two')?.get('name')?.touched);
  // }

  // get surnameR2Invalid() {
  //   return this.generalFormGroup.get('references.person_two')?.get('surname')?.invalid && (this.generalFormGroup.get('references.person_two')?.get('surname')?.dirty || this.generalFormGroup.get('references.person_two')?.get('surname')?.touched);
  // }

  // get phoneR2Invalid() {
  //   return this.generalFormGroup.get('references.person_two')?.get('phone')?.invalid && (this.generalFormGroup.get('references.person_two')?.get('phone')?.dirty || this.generalFormGroup.get('references.person_two')?.get('phone')?.touched);
  // }

  // get relationshipR2Invalid() {
  //   return this.generalFormGroup.get('references.person_two')?.get('relationship')?.invalid && (this.generalFormGroup.get('references.person_two')?.get('relationship')?.dirty || this.generalFormGroup.get('references.person_two')?.get('relationship')?.touched);
  // }
  


  // Relationship R3
  // get nameR3Invalid() {
  //   return this.generalFormGroup.get('references.person_three')?.get('name')?.invalid && (this.generalFormGroup.get('references.person_three')?.get('name')?.dirty || this.generalFormGroup.get('references.person_three')?.get('name')?.touched);
  // }

  // get surnameR3Invalid() {
  //   return this.generalFormGroup.get('references.person_three')?.get('surname')?.invalid && (this.generalFormGroup.get('references.person_three')?.get('surname')?.dirty || this.generalFormGroup.get('references.person_three')?.get('surname')?.touched);
  // }

  // get phoneR3Invalid() {
  //   return this.generalFormGroup.get('references.person_three')?.get('phone')?.invalid && (this.generalFormGroup.get('references.person_three')?.get('phone')?.dirty || this.generalFormGroup.get('references.person_three')?.get('phone')?.touched);
  // }

  // get relationshipR3Invalid() {
  //   return this.generalFormGroup.get('references.person_three')?.get('relationship')?.invalid && (this.generalFormGroup.get('references.person_three')?.get('relationship')?.dirty || this.generalFormGroup.get('references.person_three')?.get('relationship')?.touched);
  // }



  // Questions 
  // get creditCardInvalid() {
  //   return this.questionsFormGroup.get('credit_card')?.invalid && (this.questionsFormGroup.get('credit_card')?.dirty || this.questionsFormGroup.get('credit_card')?.touched);
  // }

  // get creditCardNumbersInvalid() {
  //   return this.questionsFormGroup.get('numbers_card')?.invalid && (this.questionsFormGroup.get('numbers_card')?.dirty || this.questionsFormGroup.get('numbers_card')?.touched);
  // }

  // get mortgageCreditInvalid() {
  //   return this.questionsFormGroup.get('mortgage_credit')?.invalid && (this.questionsFormGroup.get('mortgage_credit')?.dirty || this.questionsFormGroup.get('mortgage_credit')?.touched);
  // }

  // get automotiveCreditInvalid() {
  //   return this.questionsFormGroup.get('automotive_credit')?.invalid && (this.questionsFormGroup.get('automotive_credit')?.dirty || this.questionsFormGroup.get('automotive_credit')?.touched);
  // }

  // get thirdPersonInvalid() {
  //   return this.questionsFormGroup.get('third_person')?.invalid && (this.questionsFormGroup.get('third_person')?.dirty || this.questionsFormGroup.get('third_person')?.touched);
  // }
  
  // Pictures
  get ineFrontInvalid() {
    return this.filesFormGroup.get('ine_front')?.value === null;
  }

  get ineBackInvalid() {
    return this.filesFormGroup.get('ine_back')?.value === null;
  }
  
  get addressProofInvalid() {
    return this.filesFormGroup.get('address_proof')?.value === null;
  }

  /**
   * Form Initialization
   */
  private createFormFinancingGroup() {
    this.financingFormGroup = this._formBuilder.group({
      price: [0, [Validators.required, Validators.min(1)]],
      hitch: [0, [Validators.required, Validators.min(1)]],
      year: [new Date().getFullYear().toString(), [Validators.required]],
      brand: ['', [Validators.required]],
      model: ['', [Validators.required]],
      monthly_fees: ['', [Validators.required]],
    });
  }

  private createFormClientGroup() {
    this.clientFormGroup = this._formBuilder.group({
      name: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      lastname: ['', [Validators.pattern("[a-zA-Z ]+")]],
      surname: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      mothername: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],      
      curp: ['', [Validators.required, Validators.pattern("[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}" +
        "(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])" +
        "[HM]{1}" +
        "(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)" +
        "[B-DF-HJ-NP-TV-Z]{3}" +
        "[0-9A-Z]{1}[0-9]{1}$"), Validators.minLength(18), Validators.maxLength(18)]],
      gender: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      rfc: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern("[0-9]{10}"), Validators.minLength(10), Validators.maxLength(10)]],
      civil_status: ['', [Validators.required]],
      studies_level: ['', [Validators.required]],
      economic_dependents: ['', [Validators.required]],
      has_vehicle: ['', [Validators.required]],
      address: this._formBuilder.group({
        street_name: ['', [Validators.required]],
        suburb: ['', [Validators.required]],
        number: ['', [Validators.required, Validators.pattern("[0-9]{1,10}"), Validators.minLength(1), Validators.maxLength(10)]],
        postal_code: ['', [Validators.required, Validators.pattern("[0-9]{1,10}"), Validators.minLength(1), Validators.maxLength(10)]],
        state: ['', [Validators.required]],
        municipality: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      })
    });
  }
  
  private createFormGeneralGroup() {
    this.generalFormGroup = this._formBuilder.group({
      employment_situation: ['', [Validators.required]],
      company: ['N/A', [Validators.required, Validators.minLength(1)]],
      salary: ['', [Validators.required, Validators.pattern("[0-9]{1,10}"), Validators.minLength(1), Validators.maxLength(10)]],
      role: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      date_start: ['', [Validators.required]],
      date_end: [],
      number_company: ['', [Validators.required]],
      address_company : this._formBuilder.group({
        street_name: [''],
        suburb: [''],
        number: ['', [Validators.pattern("[0-9]{1,10}"), Validators.minLength(1), Validators.maxLength(10)]],
        postal_code: ['', [Validators.pattern("[0-9]{1,10}"), Validators.minLength(1), Validators.maxLength(10)]],
        state: [''],
        municipality: ['', [Validators.pattern("[a-zA-Z ]+")]],
      }),
      // references: this._formBuilder.group({
      //   person_one: this._formBuilder.group({
      //     name: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      //     surname: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      //     phone: ['', [Validators.required, Validators.pattern("[0-9]{10}"), Validators.minLength(10), Validators.maxLength(10)]],
      //     relationship: ['', [Validators.required]],
      //     street_name: ['', [Validators.required]],
      //     suburb: ['', [Validators.required]],
      //     number: ['', [Validators.required, Validators.pattern("[0-9]{1,10}"), Validators.minLength(1), Validators.maxLength(10)]],
      //     postal_code: ['', [Validators.required, Validators.pattern("[0-9]{1,10}"), Validators.minLength(1), Validators.maxLength(10)]],
      //     state: ['', [Validators.required]],
      //     municipality: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      //   }),
      //   person_two: this._formBuilder.group({
      //     name: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      //     surname: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      //     phone: ['', [Validators.required, Validators.pattern("[0-9]{10}"), Validators.minLength(10), Validators.maxLength(10)]],
      //     relationship: ['', [Validators.required]]
      //   }),
      //   person_three: this._formBuilder.group({
      //     name: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      //     surname: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      //     phone: ['', [Validators.required, Validators.pattern("[0-9]{10}"), Validators.minLength(10), Validators.maxLength(10)]],
      //     relationship: ['', [Validators.required]]
      //   }),
      // })
    });
  }

  private createFormQuestionsGroup() {
    this.questionsFormGroup = this._formBuilder.group({
      credit_card: ['', [Validators.required]],
      numbers_card: ['0000', [Validators.pattern("[0-9]{4}")]],
      mortgage_credit: ['', [Validators.required]],
      automotive_credit: ['', [Validators.required]],
      third_person: ['', [Validators.required]]
    });
  }

  private createFilesFormGroup() {
    this.filesFormGroup = this._formBuilder.group({      
      ine_front: [null, [Validators.required]],
      ine_back: [null, [Validators.required]],
      // address_proof: [null, [Validators.required]],
      address_proof: [null],
      checkbox: [false, Validators.required]
    });
  }

  /**
   * Get Vehicle by vin in url
   */
  private getVehicle(vin: string) {
    this._detailService.getVehicleByVin(vin)
    .subscribe({
      next: ({ code, status, vehicle }: VehicleData) => {
        this.getModels(vehicle.carmodel.brand.id);
        
        if (code === 200 && status === 'success') {
          this.financingFormGroup.patchValue({
            price: vehicle.priceOffer ? vehicle.priceOffer : vehicle.price,
            year:  vehicle.yearModel.toString(),
            brand: vehicle.carmodel.brand.name,
            model: vehicle.carmodel.name
          });

          this.hitchValue = this.financingFormGroup.get('price')?.value * .20;
          this.financingFormGroup.controls['monthly_fees'].setValue(this.selected);
        } else {
          this.financingFormGroup.controls['monthly_fees'].setValue(this.selected);
        }
      }
    });
  }

  /**
   * Get Vehicle by localStorage
   */
   public getVehicleByLocalStorage() {
    let vehicle:Vehicle;
    let vehicleLS = localStorage.getItem('vehicle')
    if( vehicleLS ){      
      vehicle = JSON.parse(vehicleLS)
      this.getModels(vehicle.carmodel.brand.id);      
      this.priceValue = vehicle.price;
      this.financingFormGroup.patchValue({
        price: vehicle.price,
        year: vehicle.yearModel.toString(),
        brand: vehicle.carmodel.brand.id.toString(),
        model: vehicle.carmodel.id.toString(),
      });            
      this.hitchValue = this.financingFormGroup.get('price')?.value * .20;
      this.financingFormGroup.controls['monthly_fees'].setValue(this.selected);
    }else {
      this.financingFormGroup.controls['monthly_fees'].setValue(this.selected);
    }
  }

  /**
   * Get Brands
   */
  private getBrands() {    
    let brandsLS = localStorage.getItem('brands')
    if( brandsLS ){      
      this.brands = JSON.parse(brandsLS)
    }else{
      this._venderTuAutoService.brands().subscribe(
        ({ code, brands }: Brands) => {
          this.brands = (code === 200) ? brands : [];
          // guardar states en localStorage
          localStorage.setItem("brands", JSON.stringify(this.brands));
        }
      );
    }    
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
   * Get States
   */
  public getStates() {
    let statesLS = localStorage.getItem('states')
    if( statesLS ){      
      this.states = JSON.parse(statesLS)
    }else{
      this._financingService.getStates().subscribe(        
        ({ code, status, states }: State) => {
          if(code === 200 && status === 'success'){
            this.states = states;
            // guardar states en localStorage
            localStorage.setItem("states", JSON.stringify(this.states));
          }        
        }
      );
    }    
  }

  /**
   * Launch request
   */
  public onSubmit() {
    // Change spinner
    this.spinner = true;

    // Create form financing correct
    this.financing = this._formBuilder.group({
      // Financing Information
      'status': 'active',
      'price': this.financingFormGroup.get('price')?.value,
      'hitch': this.financingFormGroup.get('hitch')?.value,
      'year': this.financingFormGroup.get('year')?.value,
      'brand_name': this.financingFormGroup.get('brand')?.value,
      'carmodel_name': this.financingFormGroup.get('model')?.value,
      'monthly_fees': this.financingFormGroup.get('monthly_fees')?.value,
      
      // Client Information
      'lastname': this.clientFormGroup.get('name')?.value+' '+this.clientFormGroup.get('lastname')?.value,
      'mothername': this.clientFormGroup.get('surname')?.value+' '+this.clientFormGroup.get('mothername')?.value,

      'rfc': this.clientFormGroup.get('rfc')?.value,
      'civil_status': this.clientFormGroup.get('civil_status')?.value,
      'studies_level': this.clientFormGroup.get('studies_level')?.value,
      'economic_dependents': this.clientFormGroup.get('economic_dependents')?.value,
      'has_vehicle': this.clientFormGroup.get('has_vehicle')?.value,
      
      // Addres Client
      'street_name': this.clientFormGroup.get('address')?.get('street_name')?.value,
      'suburb': this.clientFormGroup.get('address')?.get('suburb')?.value,
      'number': this.clientFormGroup.get('address')?.get('number')?.value,
      'postal_code': this.clientFormGroup.get('address')?.get('postal_code')?.value,
      'state_name': this.clientFormGroup.get('address')?.get('state')?.value,
      'municipality': this.clientFormGroup.get('address')?.get('municipality')?.value,
      
      // Company
      'employment_situation': this.generalFormGroup.get('employment_situation')?.value,
      'company': this.generalFormGroup.get('company')?.value,
      'salary': this.generalFormGroup.get('salary')?.value,
      'role': this.generalFormGroup.get('role')?.value,
      'date_start': this._datePipe.transform(this.generalFormGroup.get('date_start')!.value, "yyyy-MM-dd"),
      'number_phone_company': this.generalFormGroup.get('number_company')?.value,

      // Address Reference
      // 'street_name_reference': this.generalFormGroup.get('references.person_one')?.get('street_name')?.value,
      // 'suburb_reference': this.generalFormGroup.get('references.person_one')?.get('suburb')?.value,
      // 'number_reference': this.generalFormGroup.get('references.person_one')?.get('number')?.value,
      // 'postal_code_reference': this.generalFormGroup.get('references.person_one')?.get('postal_code')?.value,
      // 'state_reference': this.generalFormGroup.get('references.person_one')?.get('state')?.value,
      // 'municipality_reference': this.generalFormGroup.get('references.person_one')?.get('municipality')?.value,

      // Questions 
      // 'credit_card' : this.questionsFormGroup.get('credit_card')?.value,
      // 'numbers_card' : this.questionsFormGroup.get('numbers_card')?.value,
      // 'mortgage_credit' : this.questionsFormGroup.get('mortgage_credit')?.value,
      // 'automotive_credit' : this.questionsFormGroup.get('automotive_credit')?.value,
      // 'third_person' : this.questionsFormGroup.get('third_person')?.value,

      // Pictures
      'ine_front': this.filesFormGroup.get('ine_front')?.value,
      'ine_back': this.filesFormGroup.get('ine_back')?.value,
      'address_proof': this.filesFormGroup.get('address_proof')?.value,

      // User Agent
      'useragent': this.userAgent,

      'client_id': 0
    });

    // Add new control date_end
    if (this.generalFormGroup.get('date_end')!.value !== null) {
      this.financing.addControl('date_end', new UntypedFormControl(this._datePipe.transform(this.generalFormGroup.get('date_end')!.value, "yyyy-MM-dd")));
    }

    // Add controls address company
    if (this.financing.get('employment_situation')?.value === 'Asalariado') {
      this.financing.addControl('street_name_company', new UntypedFormControl(this.generalFormGroup.get('address_company')?.get('street_name')?.value));
      this.financing.addControl('suburb_company', new UntypedFormControl(this.generalFormGroup.get('address_company')?.get('suburb')?.value));
      this.financing.addControl('number_home_company', new UntypedFormControl(this.generalFormGroup.get('address_company')?.get('number')?.value));
      this.financing.addControl('postal_code_company', new UntypedFormControl(this.generalFormGroup.get('address_company')?.get('postal_code')?.value));
      this.financing.addControl('state_company', new UntypedFormControl(this.generalFormGroup.get('address_company')?.get('state')?.value));
      this.financing.addControl('municipality_company', new UntypedFormControl(this.generalFormGroup.get('address_company')?.get('municipality')?.value));
    }

    // Launch request
    this._venderTuAutoService.getUserByEmail(this.clientFormGroup.get('email')?.value)
    .subscribe({
      next: ({ code, status, user }: UserEmailData) => {
        if (user) {
          // Set value in client_id
          this.financing.controls['client_id'].setValue(user.clients[0].id);
               
          // Launche create financing form
          this._financingService.createFinancing(this.financing.value)
          .subscribe({
            next: ({ code, status, financing: response }: Financing) => {
              if (code === 200 && status === 'success') {

                // Desestructuring of references
                // const references = Array();
                // let { person_one, person_two, person_three } = this.generalFormGroup.get('references')?.value
                
                // // Assign financing_id
                // person_one = {
                //   ...person_one,
                //   financing_id: response.id
                // };

                // person_two = {
                //   ...person_two,
                //   financing_id: response.id
                // };

                // person_three = {
                //   ...person_three,
                //   financing_id: response.id
                // };

                // references.push(person_one, person_two, person_three);  
                
                // Upload files
                this._financingService.uploadFilesFinancing(response.id, this.filesFormGroup.value)
                .subscribe({
                  next: ({ code, status }: UploadFilesFinancing) => {
                    // if (code === '200' && status === 'success') {
                      // Launche references
                      // references.forEach(ref => {
                        // this._financingService.createFinancingReferences(ref)
                        // .subscribe({
                        //   next: ({ code, status }: Reference) => {
                            if (code === '200' && status === 'success') {
                              // Change spinner
                              this.spinner = true;
              
                              // Animation request
                              Swal.fire({
                                icon: 'success',
                                title: '¡FELICIDADES!',
                                text: 'Registro exitoso, estas más cerca de obtener tu financiamiento y muy pronto nos pondremos en contacto contigo.',
                                showConfirmButton: true,
                                confirmButtonColor: '#EEB838',
                                timer: 4000
                              });

                              // Redirect
                              this._router.navigate(['/saved-process']);
                              this.spinner = false;
                            } else {
                              // Change spinner
                              this.spinner = false;

                              // Animation request  
                              Swal.fire({
                                icon: 'error',
                                title: 'Oupps..',
                                text: 'Al parecer las referencias ingresadas no pudieron registrarse, verifique y vuelva a intentarlo.',
                                showConfirmButton: true,
                                confirmButtonColor: '#EEB838',
                                timer: 3500
                              });

                              // Redirect
                              this._router.navigate(['/error-process']);
                            }
                          // }
                        // });
                      // });
                    // } else {
                    //   // Change spinner
                    //   this.spinner = false;

                    //   // Animation request
                    //   Swal.fire({
                    //     icon: 'error',
                    //     title: 'Oupps..',
                    //     text: 'Al parecer los documentos requeridos no pudieron ser cargados exitosamente.',
                    //     showConfirmButton: true,
                    //     confirmButtonColor: '#EEB838',
                    //     timer: 3500
                    //   });

                    //   // Redirect
                    //   this._router.navigate(['/error-process']);
                    // }
                  }
                });
              } else {
                // Change spinner
                this.spinner = false;

                // Animation request  
                Swal.fire({
                  icon: 'error',
                  title: 'Oupps..',
                  text: 'Al parecer ocurrio un error al registrar la precalificación para financiamiento, verifique y vuelva a intentarlo.',
                  showConfirmButton: true,
                  confirmButtonColor: '#EEB838',
                  timer: 3500
                });

                // Redirect
                this._router.navigate(['/error-process']);
              }
            }
          });
        } else {
          let result = '';
          let n = 9;
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@';
          for (let i = 0; i < n; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          
          // Create form with information user
          const user = this._formBuilder.group({
            name: [this.clientFormGroup.get('name')?.value],
            surname: [this.clientFormGroup.get('surname')?.value],
            phoneOne: [this.clientFormGroup.get('phone')?.value],
            phoneTwo: [this.clientFormGroup.get('phone')?.value],
            curp: [this.clientFormGroup.get('curp')?.value],
            gender: [this.clientFormGroup.get('gender')?.value],
            email: [this.clientFormGroup.get('email')?.value],
            // password: ['testing@@']  
            password: [result]  
          });          

          // Register new user
          this._authService.register(user.value)
          .subscribe({
            next: ({ code, status, user }: Register) => {
              if (code === '200' && status === 'success') {
                
                // Information user destructuring
                const auth = this._formBuilder.group({
                  email: [user.email],
                  // password: ['testing@@'],
                  password: [result],
                  gettoken: [true]
                });

                // Login of the user with email and password for get token
                this._authService.login(auth.value)
                .subscribe({
                  next: ({ code, status, token }: Login) => {
                    if (code === 200 && status === 'success' && token.length > 0) {
                      // Save token user
                      // localStorage.setItem('user_token', token); 

                      // Generate Form Group Client
                      const client = this._formBuilder.group({
                        phone1: [this.clientFormGroup.controls.phone.value],
                        phone2: [this.clientFormGroup.controls.phone.value],
                        curp: [this.clientFormGroup.get('curp')?.value],
                        points: [0],
                        user_id: [user.id],
                        source_id: [1]
                      });

                      // Lauch request Client
                      this._authService.registerClient(client.value)
                      .subscribe({
                        next: ({ code, status, client }: Client) => {
                          if (code === '200' && status === 'success') {
                            // Change spinner
                            this.spinner = true;

                            // Save information user
                            // localStorage.setItem('user', JSON.stringify({
                            //   'id': user.id,
                            //   'name': user.name,
                            //   'surname': user.surname,
                            //   'email': user.email
                            // }));
                            
                            // Set value in client_id
                            this.financing.controls['client_id'].setValue(client.id);

                            // Set sellerId if exists on params array
                            if(this.userId != undefined){
                              this.financing.addControl('seller_id', new UntypedFormControl(this.userId));
                            }
                            
                            // Launche create financing form
                            this._financingService.createFinancing(this.financing.value)
                            .subscribe({
                              next: ({ code, status, financing: response }: Financing) => {
                                if (code === 200 && status === 'success') {
                                  // Desestructuring of references
                                  // const references = Array();
                                  // let { person_one, person_two, person_three } = this.generalFormGroup.get('references')?.value
                                  
                                  // console.log("Entra create financing");
                                  // // Assign financing_id
                                  // person_one = {
                                  //   ...person_one,
                                  //   financing_id: response.id
                                  // };

                                  // person_two = {
                                  //   ...person_two,
                                  //   financing_id: response.id
                                  // };

                                  // person_three = {
                                  //   ...person_three,
                                  //   financing_id: response.id
                                  // };

                                  // references.push(person_one, person_two, person_three);    
                                  
                                  // Upload files
                                  this._financingService.uploadFilesFinancing(response.id, this.filesFormGroup.value)
                                  .subscribe({
                                    next: ({ code, status }: UploadFilesFinancing) => {
                                      // if (code === '200' && status === 'success') {
                                      //   // Launche references
                                      //   references.forEach(ref => {
                                      //     this._financingService.createFinancingReferences(ref)
                                      //     .subscribe({
                                      //       next: ({ code, status }: Reference) => {
                                              if (code === '200' && status === 'success') {
                                                // Change spinner
                                                // this.spinner = false;

                                                // Animation request
                                                Swal.fire({
                                                  icon: 'success',
                                                  title: '¡FELICIDADES!',
                                                  text: 'Registro exitoso, estas más cerca de obtener tu financiamiento y muy pronto nos pondremos en contacto contigo.',
                                                  showConfirmButton: true,
                                                  confirmButtonColor: '#EEB838',
                                                  timer: 4000
                                                });

                                                // Redirect
                                                this._router.navigate(['/saved-process']);
                                                this.spinner = false;
                                              } else {
                                                // Change spinner
                                                this.spinner = false;

                                                // Animation request  
                                                Swal.fire({
                                                  icon: 'error',
                                                  title: 'Oupps..',
                                                  text: 'Al parecer las referencias ingresadas no pudieron registrarse, verifique y vuelva a intentarlo.',
                                                  showConfirmButton: true,
                                                  confirmButtonColor: '#EEB838',
                                                  timer: 3500         
                                                });
                                                        
                                                // Redirect
                                                this._router.navigate(['/error-process']);
                                              }
                                      //       }
                                      //     });
                                      //   });
                                      // } else {
                                      //   // Change spinner
                                      //   this.spinner = false;

                                      //   // Animation request
                                      //   Swal.fire({
                                      //     icon: 'error',
                                      //     title: 'Oupps..',
                                      //     text: 'Al parecer los documentos requeridos no pudieron ser cargados exitosamente.',
                                      //     showConfirmButton: true,
                                      //     timer: 3500
                                      //   });

                                      //   // Redirect
                                      //   this._router.navigate(['/error-process']);
                                      // }
                                    }
                                  });
                                } else {
                                  // Change spinner
                                  this.spinner = false;

                                  // Animation request
                                  Swal.fire({
                                    icon: 'error',
                                    title: 'Oupps..',
                                    text: 'Al parecer ocurrio un error al registrar la precalificación para financiamiento, verifique y vuelva a intentarlo.',
                                    showConfirmButton: true,
                                    confirmButtonColor: '#EEB838',
                                    timer: 6000
                                  });

                                  // Redirect
                                  this._router.navigate(['/error-process']);
                                }
                              }
                            });
                          } else {
                            // Animation request
                            Swal.fire({
                              icon: 'error',
                              title: 'Oupps..',
                              text: 'Al parecer ocurrio un error al registrar su financiamiento, verifique e intente nuevamente.',
                              showConfirmButton: true,
                              confirmButtonColor: '#EEB838',
                              timer: 3500
                            });

                            // Change spinner
                            this.spinner = false;
                          }
                        }
                      });
                    }
                  }
                });
              }
            }
          });
        }
      }
    });
  }

  /**
   * Assign image form
   */
  public onFileChange(file: any, type: string) {
    if(file.target.files.length > 0) {
      if (type === 'front') {
        console.log(file.target.files[0]);
        
        this.filesFormGroup.get('ine_front')?.setValue(file.target.files[0], { emitModelToViewChange: false });
      } 
      if (type === 'back') {
        console.log(file.target.files[0]);
        
        this.filesFormGroup.get('ine_back')?.setValue(file.target.files[0]);
      }
      if (type === 'address') {
        console.log(file.target.files[0]);
        
        this.filesFormGroup.get('address_proof')?.setValue(file.target.files[0]);
      }
    }
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

  /**
   * Calculate Hitch
   */
  public SetMinHitch() {
    let minHitch = 0;
    const percentage = this.financingFormGroup.get('monthly_fees')?.value;

    switch (percentage) {
      case '60':
        minHitch = this.financingFormGroup.get('price')?.value * 0.20;
      break;

      case '48':
        minHitch = this.financingFormGroup.get('price')?.value * 0.25;
      break;

      case '24':
        minHitch = this.financingFormGroup.get('price')?.value * 0.35;
      break;

      case '12':
        minHitch = this.financingFormGroup.get('price')?.value * 0.35;
      break;
    }

    this.hitchMin = minHitch;
    // this.hitchValue = minHitch;
    this.hitchValue = this.financingFormGroup.get('price')?.value * .20;
  }

  /**
   * Calculate Hitch
   */
  public CalculateMinHitch(percentage: number) {
    const minHitch = this.financingFormGroup.get('price')?.value * percentage;
    this.hitchMin = minHitch;
    // this.hitchValue = Number(this.financingFormGroup.get('price')?.value * percentage);
    this.financingFormGroup.controls['hitch'].setValue(Number(this.financingFormGroup.get('price')?.value * percentage).toFixed());
  }

  /**
   * Cheking year selected for calculate msi
   */
  public YearChecking(year_pos: number) {        
    // 0, 1, 2 = 10% and 60 msi (2022...2020)
    if (year_pos >= 0 && year_pos <= 2) {
      this.financingm60.nativeElement.parentElement?.classList.remove('financing-months-disabled');
      this.financingm60.nativeElement.removeAttribute('disabled');

      this.financingm48.nativeElement.parentElement?.classList.remove('financing-months-disabled');
      this.financingm48.nativeElement.removeAttribute('disabled');

      this.financingm24.nativeElement.parentElement?.classList.remove('financing-months-disabled');
      this.financingm24.nativeElement.removeAttribute('disabled');

      this.financingm12.nativeElement.parentElement?.classList.remove('financing-months-disabled');      
      this.financingm12.nativeElement.removeAttribute('disabled');      
    }

    // 3...6 = 25% and 48 msi (2019...2016)
    if (year_pos >= 3 && year_pos <= 6) {
      this.financingm60.nativeElement.parentElement?.classList.add('financing-months-disabled');
      this.financingm60.nativeElement.setAttribute('disabled', 'true');
      
      this.financingm48.nativeElement.parentElement?.classList.remove('financing-months-disabled');
      this.financingm48.nativeElement.removeAttribute('disabled');

      this.financingm24.nativeElement.parentElement?.classList.remove('financing-months-disabled');
      this.financingm24.nativeElement.removeAttribute('disabled');

      this.financingm12.nativeElement.parentElement?.classList.remove('financing-months-disabled');      
      this.financingm12.nativeElement.removeAttribute('disabled');

      // Set default value in montgly_fees
      this.financingFormGroup.patchValue({
        monthly_fees: "48"
      });
    }
    
    // 7 & 8 = 35% and 24 msi (2015 & 2014)
    if (year_pos >= 7 && year_pos <= 8) {
      this.financingm60.nativeElement.parentElement?.classList.add('financing-months-disabled');
      this.financingm60.nativeElement.setAttribute('disabled', 'true');

      this.financingm48.nativeElement.parentElement?.classList.add('financing-months-disabled');
      this.financingm48.nativeElement.setAttribute('disabled', 'true');

      this.financingm24.nativeElement.parentElement?.classList.remove('financing-months-disabled');
      this.financingm24.nativeElement.removeAttribute('disabled');

      this.financingm12.nativeElement.parentElement?.classList.remove('financing-months-disabled');      
      this.financingm12.nativeElement.removeAttribute('disabled');

      // Set default value in montgly_fees
      this.financingFormGroup.patchValue({
        monthly_fees: "24"
      });
    }

    // 9 = 35% and 12 msi (2013)
    if (year_pos >= 9) {
      this.financingm60.nativeElement.parentElement?.classList.add('financing-months-disabled');
      this.financingm60.nativeElement.setAttribute('disabled', 'true');

      this.financingm48.nativeElement.parentElement?.classList.add('financing-months-disabled');
      this.financingm48.nativeElement.setAttribute('disabled', 'true');

      this.financingm24.nativeElement.parentElement?.classList.add('financing-months-disabled');
      this.financingm24.nativeElement.setAttribute('disabled', 'true');

      this.financingm12.nativeElement.parentElement?.classList.remove('financing-months-disabled');      
      this.financingm12.nativeElement.removeAttribute('disabled');

      // Set default value in montgly_fees
      this.financingFormGroup.patchValue({
        monthly_fees: "12"
      });
    }    
  }

  /**
   * Change value in company for Employment Situation in Independiente
   */
  public changeCompany() {       
    this.generalFormGroup.patchValue({ 'company': '' });
    (this.generalFormGroup.get('employment_situation')?.value === 'Independiente') ? this.generalFormGroup.patchValue({ 'company': 'N/A' }) : '';
  }

  /**
   * Change value in Credit Card
   */
  public changeCreditCard() {       
    this.questionsFormGroup.patchValue({ 'numbers_card': '' });
    (this.questionsFormGroup.get('credit_card')?.value === 'no') ? this.questionsFormGroup.patchValue({ 'numbers_card': '0000' }) : '';
  }

}