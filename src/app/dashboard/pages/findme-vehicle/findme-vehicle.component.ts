import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Providers
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

// Services
import { VendeTuAutoService } from '../vender-autos/services/vende-tu-auto.service';
import { FindmeVehicleService } from "../../services/findme-vehicle.service";

// Interfaces
import { DataModels, Model } from '../comprar-autos/interfaces/compra-tu-auto/data_models.interface';
import { Branch, Brands } from '../vender-autos/interfaces/vende-tu-auto.interface';
import { UserData } from '../vender-autos/interfaces/user-data.interface';
import { ClientData } from '../vender-autos/interfaces/client-data.interface';
import { UserEmailData } from '../vender-autos/interfaces/user-email-data.interface';
interface Request {
  code: string;
  message: string;
  status: string;
}

@Component({
  selector: 'app-findme-vehicle',
  templateUrl: './findme-vehicle.component.html',
  styles: [`
    ::ng-deep .mat-step-header .mat-step-icon-selected {
      background-color: #707070 !important; 
    }

    ::ng-deep .mat-step-header .mat-step-icon-state-edit {
      background-color: #FFCB54 !important; 
    }

    .horizontal_line {
      width: 100%;       
      border-bottom: 1px solid #000; 
      line-height: 0.6em;
      margin: 0 0 20px; 
    } 

    .horizontal_line span { 
        background: #fff; 
        padding-right: 10px;
    }

    .heading-4 {
      font-size:16px;
      font-weight: 540;      
    }

    .image_box {            
      width: 100%;
      padding: 1rem;      
      position:relative; 
      height: 500px;    
      backface-visibility: hidden;      
    }

    .image_car {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 85%;
      z-index:1;   
                  
      animation: moveInBottom 2s ease-out .75;
      animation-fill-mode: backwards;
    }

    .footer_image_car{      
      position: absolute;
      top: 79%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      animation: moveInBottom 2s ease-out .75;
      animation-fill-mode: backwards;     
    }

    @keyframes moveInBottom {      
      0% {
        opacity: 0;
        transform: translate(-50%, -45%);
      }
      100% {
        opacity: 1;
        transform: translate(-50%, -50%);
      } 
    }

    @media only screen and (max-width: 1200px) and (min-width: 1051px)  {
      .image_box { height:450px; }
      .footer_image_car{ top: 75%; }
    }

    @media only screen and (max-width: 1050px) and (min-width: 901px)  {
      .image_box { height:400px; }
      .footer_image_car{ top: 73%; }
    }

    @media only screen and (max-width: 900px) and (min-width: 751px)  {
      .image_box { height:350px; }
      .footer_image_car{ top: 71%; }
    }

    @media only screen and (max-width: 750px) and (min-width: 601px)  {
      .image_box { height:300px; }
      .footer_image_car{ top: 69%; }
    }

    @media only screen and (max-width: 600px) and (min-width: 451px)  {
      .image_box { height:250px; }
      .footer_image_car{ top: 71%; width: 95%; }
    }

    @media only screen and (max-width: 450px) and (min-width: 301px)  {
      .image_box { height:200px; }
      .footer_image_car{ top: 71%; width: 95%; }
    }

    @media only screen and (max-width: 300px) and (min-width: 151px)  {
      .image_box { height:150px; }
      .footer_image_car{ top: 68%; width: 95%; }
    }

    
  `],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }]
})

export class FindmeVehicleComponent implements OnInit {

  // References of Help
  public spinner: boolean = false;  

  public form!: UntypedFormGroup;
  // References Form  
  private requestForm!: UntypedFormGroup;

  // References Arrays
  public brands: Branch[] = [];
  public models: Model[] = [];
  public years: number[] = [];

  constructor(
    private _router: Router,
    private _formBuilder: UntypedFormBuilder,
    private _venderTuAutoService: VendeTuAutoService,
    private _findmeVehicleService: FindmeVehicleService,
    private titleService: Title,
    private metaService: Meta
  ) { 
    // Set Title View
    this.titleService.setTitle('Búscame un auto');
    this.metaService.updateTag({ name: 'description', content: '¿No encuentras el auto que quieres? Nosotros lo buscamos por ti' });

    // Initialization of Form
    this.formInit();
  }

  ngOnInit(): void {
    this.scrollTop();
    // Calling the initial functions of the form
    this.getBrands(); 

    // Years of vehicles allowed
    let year = new Date().getFullYear();
    for (let i = year; i > year-10; i--) {      
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

  get versionInvalid() {
    return this.form.get('version')!.invalid && (this.form.get('version')!.dirty || this.form.get('version')!.touched);
  }

  get transmissionInvalid() {
    return this.form.get('transmission')!.invalid && (this.form.get('transmission')!.dirty || this.form.get('transmission')!.touched);
  }

  get mileageInvalid() {
    return this.form.get('mileage')!.invalid && (this.form.get('mileage')!.dirty || this.form.get('mileage')!.touched);
  }

  // Purchase Getters
/*   get releaseInvalid() {
    return this.form.get('release')!.invalid && (this.form.get('release')!.dirty || this.form.get('release')!.touched);
  }

  get typePurchaseInvalid() {
    return this.form.get('type_purchase')!.invalid && (this.form.get('type_purchase')!.dirty || this.form.get('type_purchase')!.touched);
  }

  get amountPayInvalid() {
    return this.form.get('amount_pay')!.invalid && (this.form.get('amount_pay')!.dirty || this.form.get('amount_pay')!.touched);
  }
 */
  get commentInvalid() {
    return this.form.get('comment')!.invalid && (this.form.get('comment')!.dirty || this.form.get('comment')!.touched);
  }

  /**
   * Form Initialization
   */

  private formInit() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      surname: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      email: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      phone: ['', [Validators.required, Validators.pattern("[0-9]+"), Validators.minLength(10), Validators.maxLength(10)]],

      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', Validators.required],
      version: ['', Validators.required],
      transmission: ['', Validators.required],
      mileage: ['', [Validators.required, Validators.pattern("[0-9]{1,10}"), Validators.minLength(1), Validators.maxLength(10)]],

      /* release: ['', Validators.required], */
      /* type_purchase: ['', Validators.required], */
      /* amount_pay: ['', [Validators.required, Validators.required, Validators.pattern("[0-9]{1,10}"), Validators.minLength(1), Validators.maxLength(10)]], */
      comment: ['', Validators.required],
      checkbox : [false, Validators.required],   
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

    // Get information in forms
    let name = this.form.get('name')?.value;
    let surname = this.form.get('surname')?.value;
    let email = this.form.get('email')?.value;
    let phone = this.form.get('phone')?.value;

    // Create form group
    this.requestForm = this._formBuilder.group({                  
      status: 'active',
      year: this.form.get('year')?.value,                  
      comment: this.form.get('comment')?.value,
      transmission: this.form.get('transmission')?.value,                  
      //release: this.form.get('release')?.value,
      //type_purchase: this.form.get('type_purchase')?.value,                  
      mileage: this.form.get('mileage')?.value,
      //amount_pay: this.form.get('amount_pay')?.value,                  
      version: this.form.get('version')?.value,
      carmodel_id: this.form.get('model')?.value,
      brand_id: this.form.get('brand')?.value,
      client_id: 0
    });

    // Checking user by email
    this._venderTuAutoService.getUserByEmail(email)
    .subscribe({
      next: ({ user }: UserEmailData) => {
        if (user !== null) {
          // Change flag
          this.spinner = false;

          // Set client_id in form
          this.requestForm.controls['client_id'].setValue(user.clients[0].id);

          // Launch request for register to find-me-a-vehicle
          this.request(this.requestForm);

          // Redirect
          this._router.navigateByUrl('saved-process');
        } else {
          // Launch request
          this._venderTuAutoService.setUser(name, surname, email)
          .subscribe({
            next: ({ status, code, message, user }: UserData) => {
              if (status === 'success' && code === '200') {
                this._venderTuAutoService.setClient(phone, user.id)
                .subscribe({
                  next: ({ status, code, message, client }: ClientData) => {
                    if (status === 'success' && code === '200') {
                      // Change flag
                      this.spinner = false;

                      // Set client_id in form
                      this.requestForm.controls['client_id'].setValue(client.id);

                      // Launch request for register to find-me-a-vehicle
                      this.request(this.requestForm);

                      // Redirect
                      this._router.navigateByUrl('saved-process');
                    } else {
                      // Change flag
                      this.spinner = false;

                      // Redirect
                      this._router.navigateByUrl('error-process');
                    }
                  }
                });
              } else {
                // Change flag
                this.spinner = false;

                // Redirect
                this._router.navigateByUrl('error-process');
              }
            }
          });
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
  
  /**
   * Generate request
   * @param form Information request
   */
  public request(form: UntypedFormGroup) {
    this._findmeVehicleService.request(form.value)
    .subscribe({
      next: ({ code, status, message }: Request) => {
        if (status === 'success' && code === '200') {
          // Change flag
          this.spinner = false;

          // Redirect
          this._router.navigateByUrl('saved-process');
        } else {
          // Change flag
          this.spinner = false;

          // Redirect
          this._router.navigateByUrl('error-process');
        }
      }
    });
  }

}
