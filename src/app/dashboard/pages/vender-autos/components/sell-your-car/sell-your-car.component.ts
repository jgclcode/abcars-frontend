import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { VendeTuAutoService } from '../../services/vende-tu-auto.service';

// Animaciones
import Swal from 'sweetalert2';

// Interfaces
import { User, UserData } from '../../interfaces/user-data.interface';
import { Branch, Brands } from '../../interfaces/vende-tu-auto.interface';
import { UserEmailData } from '../../interfaces/user-email-data.interface';
import { Client, ClientData } from '../../interfaces/client-data.interface';
import { SellYourCarData } from '../../interfaces/sell-your-car-data.interface';
import { DataModels, Model } from '../../../comprar-autos/interfaces/compra-tu-auto/data_models.interface';

@Component({
  selector: 'app-sell-your-car',
  templateUrl: './sell-your-car.component.html',
  styles: [`
    mat-form-field { 
      width: 100%;
    }

    ::ng-deep .mat-step-header .mat-step-icon-selected {
      background-color: #707070 !important; 
    }

    ::ng-deep .mat-step-header .mat-step-icon-state-edit {
      background-color: #FFCB54 !important; 
    }

    .card {
      border-radius: 20px !important;
      border: 0px;
    }
  `],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }]
})

export class SellYourCarComponent implements OnInit {

  // References of Help
  public spinner: boolean = false;  
  public process: boolean = true;  
  public minDate: Date = new Date();
  public maxDate: Date = new Date(new Date().setDate( new Date().getDate() + 365));

  // References Form
  public form!: UntypedFormGroup;
  
  public years: number[] = [];
  // Reference localStorage
  public _localS: any;
  // References Arrays
  public brands: Branch[] = [];
  public models: Model[] = [];

  // User 
  public user!: User;
  public client!: Client;
  public valuatorID!: number;
  /**
   * Filter days
  */
  public myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== -1 && day !== 7;
  };

  constructor(
    private _router: Router,
    private _formBuilder: UntypedFormBuilder,
    private _venderTuAutoService: VendeTuAutoService    
  ) {
    // Initialization of Form
    this.createFormInit(); 
    //this.formInit();   
    this._localS = JSON.parse(localStorage.getItem('user')!); 
    this.valuatorID = this._localS ? this._localS.id : null;
    // Checking process is execute
    this.process = window.location.pathname.includes('valuator/vende-tu-auto') || window.location.pathname.includes('tecval/sell_your_cars') ? false : true;
  }

  ngOnInit(): void {
    this.scrollTop();
    // Calling the initial functions of the form
    this.getBrands(); 

    // Years of vehicles allowed
    let year = new Date().getFullYear()+1;
    for (let i = year; i > year-23; i--) {      
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
  get nameInvalid() {
    return this.form.get('name')!.invalid && (this.form.get('name')!.dirty || this.form.get('name')!.touched);
  }

  get surnameInvalid() {
    return this.form.get('surname')!.invalid && (this.form.get('surname')!.dirty || this.form.get('surname')!.touched);
  }

  get emailInvalid() {
    return this.form.get('email')!.invalid && (this.form.get('email')!.dirty || this.form.get('email')!.touched);
  }

  get phoneInvalid() {
    return this.form.get('phone')!.invalid && (this.form.get('phone')!.dirty || this.form.get('phone')!.touched);
  }

  get phoneLength() {
    let phone = this.form.get('phone')!.value;
    return this.form.get('phone')!.touched && (phone.length < 10 || phone.length > 10); 
  }

  // Vehicle Getters
  get brandInvalid() {
    return this.form.get('brand')!.invalid && (this.form.get('brand')!.dirty || this.form.get('brand')!.touched);
  }

  get modelInvalid() {
    return this.form.get('model')!.invalid && (this.form.get('model')!.dirty || this.form.get('model')!.touched);
  }

  get yearInvalid() {
    return this.form.get('year')!.invalid && (this.form.get('year')!.dirty || this.form.get('year')!.touched);
  }

  get dateInvalid() {
    return this.form.get('date')!.invalid && (this.form.get('date')!.dirty || this.form.get('date')!.touched);
  }

  get hourInvalid() {
    return this.form.get('hour')!.invalid && (this.form.get('hour')!.dirty || this.form.get('hour')!.touched);
  }

  get vinInvalid() {
    return this.form.get('vin')!.invalid && (this.form.get('vin')!.dirty || this.form.get('vin')!.touched);
  }

  get mileageInvalid() {
    return this.form.get('mileage')!.invalid && (this.form.get('mileage')!.dirty || this.form.get('mileage')!.touched);
  }
  
  get subsidiaryInvalid() {
    return this.form.get('subsidiary')!.invalid && (this.form.get('subsidiary')!.dirty || this.form.get('subsidiary')!.touched);
  }

  /**
   * Form Initialization
   */
  private createFormInit() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.pattern("[a-zA-ZñÑ ]+")]],
      surname: ['', [Validators.required, Validators.pattern("[a-zA-ZñÑ ]+")]],
      email: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      phone: ['', [Validators.required, Validators.pattern("[0-9]+"), Validators.minLength(10), Validators.maxLength(10)]],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', Validators.required],
      date: ['', Validators.required],
      hour: ['', Validators.required],
      version: ['Ninguna'],
      vin: ['00000000000000000', [Validators.required, Validators.pattern("[a-zA-Z0-9]+"), Validators.minLength(17), Validators.maxLength(17)]],
      /* status: ['stand_by'], */
      mileage: ['0', [Validators.required, Validators.pattern("[0-9]{1,10}"), Validators.minLength(1), Validators.maxLength(10)]],
      subsidiary: [''],
      checkbox: [false, [Validators.required]],
    });
  }

  /**
   * Get Brands
   */
  private getBrands() {
    this._venderTuAutoService.brands().subscribe({next: ({ code, brands }: Brands) => this.brands = (code === 200) ? brands : []});
  }

  /**
   * Get Models by Brand Selected
   */
  public getModels(brand_id: number) {
    this._venderTuAutoService.getModels(brand_id).subscribe({next: ({ code, models }: DataModels) => this.models = (code === 200) ? models : []});
  }

  /**
   * Form Information
   */
  public onSubmit() {      
    // Change spinner
    this.spinner = true;

    // Launch request
    let name = this.form.get('name')?.value;
    let surname = this.form.get('surname')?.value;
    let email = this.form.get('email')?.value;
    let phone = this.form.get('phone')?.value;

    let version = this.form.get('version')?.value;
    let km = this.form.get('mileage')?.value;
    let year = this.form.get('year')?.value;
    let date = this.form.get('date')?.value;
    let hour = this.form.get('hour')?.value;
    let vin = this.form.get('vin')?.value.toUpperCase();
    let brand = this.form.get('brand')?.value;
    let model = this.form.get('model')?.value;
    let subsidiary = this.form.get('subsidiary')?.value;

    // Checking user by email
    this._venderTuAutoService.getUserByEmail(email)
    .subscribe({
      next: ({ user }: UserEmailData) => {
        if (user !== null) {
          this.setSell_your_car(version, km, year, vin, date, hour, brand, model, subsidiary, user.clients[0].id);
        } else {
          // Generar usuario
          this._venderTuAutoService.setUser( name, surname, email )
          .subscribe({
            next: ( userData: UserData ) => {
              this.user = userData.user;
              if (userData.status == 'success') {
                // Generar cliente
                this.setClient(phone, this.user.id, version, km, year, vin, date, hour, brand, model, subsidiary);
              } else if ( userData.status == 'error') {
                this._venderTuAutoService.getUserByEmail( email )
                .subscribe({
                  next: (userEmailData: UserEmailData) => {
                    if (userEmailData.user != null) {
                      if(userEmailData.user.clients.length == 0) {
                        this.setClient( phone, this.user.id, version, km, year, vin, date, hour, brand, model, subsidiary );
                      } else {
                        this.setSell_your_car( version, km, year, vin, date, hour, brand, model, subsidiary, userEmailData.user.clients[0].id );
                      }
                    }else{
                      this._router.navigateByUrl('/error-process'); 
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

  public setClient(
    phone:string,
    user_id:number,
    version:string,
    km: number, 
    year: number,
    vin: string,
    date: string,
    hour: string,
    brand_id:number,
    carmodel_id:number,
    subsidiary: string
  ){
    this._venderTuAutoService.setClient( phone, user_id )
    .subscribe({
      next: ( clientData: ClientData ) => {
        this.client = clientData.client;
        // Generar Vender tu carro
        this.setSell_your_car( version, km, year, vin, date, hour, brand_id, carmodel_id, subsidiary, this.client.id );
      }
    });
  }

  public setSell_your_car(
    version:string,
    km: number,
    year: number,
    vin: string,
    date: string,
    hour: string,
    brand_id:number,
    carmodel_id:number,
    subsidiary: string,
    client_id:number,
  ){
    this._venderTuAutoService.setSell_your_car( version, km, year, vin, date, hour, brand_id, carmodel_id, subsidiary, client_id, this.valuatorID )
    .subscribe({
      next: ( sellYourCarData: SellYourCarData ) => {
        // Redirect.
        if (sellYourCarData.message == "Ya existe una petición generada con anterioridad con este vin") {
          Swal.fire({
            icon: 'error',
            title: 'Ooopppps!',
            text: `Actualmente ya existe un registro con el siguiente VIN: ${ this.form.get('vin')?.value }, por favor intente con uno distinto.`,
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });

          this.spinner = false;
        } else {
          if (this.process) {
            if (sellYourCarData.code === '200' && sellYourCarData.status === 'success') {
              Swal.fire({
                icon: 'success',
                title: 'Cita generada correctamente',
                text: `Nos pondremos en contacto contigo lo antes posible para seguir con tu proceso de Vender mi Auto.`,
                showConfirmButton: true,
                confirmButtonColor: '#EEB838',
                timer: 3500
              });

              setTimeout(() => {
                this._router.navigateByUrl('/saved-process'); 
              }, 2000);
            }
          } else {
            this._router.navigateByUrl('/admin/appraiser/appraiser-datatable');
            window.location.reload();
          }
        }
      },
      error: (error) => {
        console.log(error);
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

  /**
   * Helper function to convert text String to Uppercase
   * @param event keyup
   * @returns string
   */
  public convertMayus(event: any): string {
    return event.target.value = event.target.value.toUpperCase();
  }

}
