import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

// Pipes
import { DatePipe } from '@angular/common';

// Services
import { VendeTuAutoService } from '../../../vender-autos/services/vende-tu-auto.service';
import { ServicioService } from '../../services/servicio.service';

// Interfaces
import { Branch, Brands } from '../../../vender-autos/interfaces/vende-tu-auto.interface';
import { DataModels, Model } from '../../../comprar-autos/interfaces/compra-tu-auto/data_models.interface';

import { UserData, User } from './../../../vender-autos/interfaces/user-data.interface';
import { ClientData, Client } from './../../../vender-autos/interfaces/client-data.interface';
import { UserEmailData } from './../../../vender-autos/interfaces/user-email-data.interface';
import { QuoteData } from './../../interfaces/quote-data.interface';
import { ServicesData, Service } from './../../interfaces/services-data.interface';
import { QuoteService } from './../../interfaces/quote-service.interface';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styles: [`
    mat-form-field {
      width: 100%;
    }

    ::ng-deep .mat-checkbox-checked.mat-accent .mat-checkbox-background, .mat-checkbox-indeterminate.mat-accent .mat-checkbox-background {
      background-color: #383838 !important;
    }
  `],
  providers: [
    DatePipe
  ]
})

export class ServicioComponent implements OnInit {

  // References of Help
  public spinner: boolean = false;  

  // References Form
  public form!: UntypedFormGroup;

  // References Arrays
  public brands: Branch[] = [];
  public models: Model[] = [];

  // User 
  public user!:User;
  public client!:Client;

  // services
  public services:Service[] = [];

  public minDate: Date = new Date();
  public maxDate: Date = new Date(new Date().setDate( new Date().getDate() + 365));
  public myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }

  constructor(
    private _router: Router,
    private _formBuilder: UntypedFormBuilder,
    private _venderTuAutoService: VendeTuAutoService,
    private _servicioService: ServicioService,
    private datePipe: DatePipe,
    private titleService: Title
  ) { 
    // Set Title View
    this.titleService.setTitle('Citas de Servicio'); 

    // Initialization of Form
    this.createForm(); 
  }

  ngOnInit(): void {  
    // Calling the initial functions of the form
    this.getBrands(); 
    this.getServices();
    this.scrollTop();
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

  get brandInvalid() {
    return this.form.get('brand')!.invalid && (this.form.get('brand')!.dirty || this.form.get('brand')!.touched);
  }

  get modelInvalid() {
    return this.form.get('model')!.invalid && (this.form.get('model')!.dirty || this.form.get('model')!.touched);
  }

  get vinInvalid() {
    return this.form.get('vin')!.invalid && (this.form.get('vin')!.dirty || this.form.get('vin')!.touched);
  }

  get dateInvalid() {
    return this.form.get('date')!.invalid && (this.form.get('date')!.dirty || this.form.get('date')!.touched);
  }

  get serviceInvalid() {
    return this.form.get('service')!.invalid && (this.form.get('service')!.dirty || this.form.get('service')!.touched);
  }
  
  /**
   * Form Initialization
   */
  private createForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      surname: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      email: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      phone: ['', [Validators.required, Validators.pattern("[0-9]+"), Validators.minLength(10), Validators.maxLength(10)]],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      vin: ['', [Validators.required, Validators.pattern("[A-Z0-9]+"), Validators.minLength(17), Validators.maxLength(17)]],
      service: ['', Validators.required],
      date: ['', Validators.required],
      checkbox: [false, Validators.required]
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
    let name = this.form.get('name')?.value;
    let surname = this.form.get('surname')?.value;
    let email = this.form.get('email')?.value;
    let phone = this.form.get('phone')?.value;

    let vin = this.form.get('vin')?.value;
    let quoteDate = this.form.get('date')?.value;
    let brand_id = this.form.get('brand')?.value;
    let carmodel_id = this.form.get('model')?.value;        
    // Change spinner
    this.spinner = true;

    // Change format date with Pipe
    let newbirthday = this.datePipe.transform(this.form.get('date')!.value, "yyyy-MM-dd");

    // Set new value in control date
    this.form.patchValue({
      date: newbirthday
    });

    // Launch request
    
    this._venderTuAutoService.setUser( name, surname, email )
    .subscribe({
      next: ( userData:UserData ) => {
        this.user = userData.user;
        if( userData.status == 'success' ){
          this.setClient( phone, this.user.id, vin, newbirthday, brand_id, carmodel_id );
        }else if( userData.status == 'error'){
          this._venderTuAutoService.getUserByEmail( email )
          .subscribe({
            next: ( userEmailData: UserEmailData ) => {
              if( userEmailData.user != null ){
                if( userEmailData.user.clients.length == 0 ){
                  this.setClient( phone, this.user.id, vin, newbirthday, brand_id, carmodel_id );
                }else{
                  this.setQuote( vin, newbirthday, userEmailData.user.clients[0].id, brand_id, carmodel_id );
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

  public setClient(
    phone:string,
    user_id:number,
    vin:string,
    quoteDate:string | null,
    brand_id:number,
    carmodel_id: number
  ){
    this._venderTuAutoService.setClient( phone, user_id )
    .subscribe({
      next: ( clientData: ClientData ) => {
        this.client = clientData.client;
        // Generar Cita
        this.setQuote( vin, quoteDate, this.client.id, brand_id, carmodel_id );
      }
    });
  }

  public setQuote(
    vin:string,
    quoteDate:string | null,
    client_id:number,
    brand_id:number,
    carmodel_id: number
  ) {
    this._servicioService.setQuote( vin, quoteDate, client_id, brand_id, carmodel_id )
    .subscribe({
      next: ( quoteData: QuoteData ) => {
        let service = this.form.get('service')?.value;

        // Relacion
        this._servicioService.setQuoteService( quoteData.quote.id, service )
        .subscribe({
          next: (quoteService: QuoteService) => {
            // Redirect.
            this._router.navigateByUrl('/saved-process');
          }
        });
      }
    });
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
   * Checking length input   
   * @param object any input
   */
  public maxLengthCheck(object: any) {   
    if (object.value.length > object.maxLength) {
      object.value = object.value.slice(0, object.maxLength)
    }
  }

  public getServices(){
    this._servicioService.getServices()
    .subscribe({
      next: (servicesData: ServicesData) => {
        this.services = servicesData.service.data;
      }
    });
  }
}
