import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

// Services
import { VendeTuAutoService } from "../../../vender-autos/services/vende-tu-auto.service";

// Interfaces
import { Branch, Brands } from "../../../vender-autos/interfaces/vende-tu-auto.interface";
import { DataModels, Model } from "../../../comprar-autos/interfaces/compra-tu-auto/data_models.interface";

@Component({
  selector: 'app-automotive-maintenance',
  templateUrl: './automotive-maintenance.component.html',
  styleUrls: ['./automotive-maintenance.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }]
})
export class AutomotiveMaintenanceComponent implements OnInit {

  // References of Help
  public spinner: boolean = false;  
  public minDate: Date = new Date();
  public maxDate: Date = new Date(new Date().setDate( new Date().getDate() + 365));

  // References Form
  public form!: UntypedFormGroup;
  public years: number[] = [];
  public missing: boolean = false;

  // References Arrays
  public brands: Branch[] = [];
  public models: Model[] = [];

  /**
   * Filter days
  */
  public myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _venderTuAutoService: VendeTuAutoService
  ) { 
    // Initialization of Form
    this.createFormInit();
  }

  ngOnInit(): void {
    this.scrollTop();
    // Calling the initial functions of the form
    this.getBrands();

    // Years of vehicles allowed
    let year = new Date().getFullYear();
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

  get codeVinInvalid() {
    return this.form.get('vin_code')!.invalid && (this.form.get('vin_code')!.dirty || this.form.get('vin_code')!.touched);
  }

  /**
   * Form Initialization
   */
  private createFormInit() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      surname: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      email: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      phone: ['', [Validators.required, Validators.pattern("[0-9]+"), Validators.minLength(10), Validators.maxLength(10)]],
      brand: ['', Validators.required],
      // model: ['', Validators.required],
      model: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9 ]+")]],
      year: ['', Validators.required],
      date: ['', Validators.required],
      hour: ['', Validators.required],
      // version: ['Ninguna'],
      vin_code: ['', [Validators.pattern("[a-zA-Z0-9]+"), Validators.minLength(17), Validators.maxLength(17)]],
      /* status: ['stand_by'], */
      // mileage: ['0', [Validators.required, Validators.pattern("[0-9]{1,10}"), Validators.minLength(1), Validators.maxLength(10)]],
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
   * Checking length input   
   * @param object any input
   */
  public maxLengthCheck(object: any) {   
    if (object.value.length > object.maxLength) {
      object.value = object.value.slice(0, object.maxLength)
    }
  }

  public maxLengthVin(object:any) {
    if (object.value.lenght > object.maxlength) {
      object.value = object.value.slice(0, object.maxlength);
    }
    if (object.value.lenght < object.maxlength) {
      this.missing = true;
    }
  }

  public convertMayus(event: any): string {
    return event.target.value = event.target.value.toUpperCase();
  }
}
