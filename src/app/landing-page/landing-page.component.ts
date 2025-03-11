import { Component, ViewChild } from '@angular/core';
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { LandingService } from './services/landing.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  @ViewChild('myForm') mytemplateForm : NgForm;
  public form!: UntypedFormGroup;
  public spinner: boolean = false;

  constructor(
    private _router: Router,
    private _formBuilder: UntypedFormBuilder, 
    private _landingService:LandingService
  ){
    this.dontShowNavAndFooter();
    this.initForm();
  }


  public initForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+") ]],
      lastName: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      phone: ['', [Validators.required, Validators.pattern("[0-9]{10}"), Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      to_purchase: ['', [Validators.required]],
      type_purchase: ['', [Validators.required]],
      initial_investment: ['', [Validators.required]],
      profession: ['', [Validators.required]],

    });
  }

  get nameInvalid() {
    return this.form.get('name')!.invalid && (this.form.get('name')!.dirty || this.form.get('name')!.touched);
  }

  get surnameInvalid() {
    return this.form.get('lastName')!.invalid && (this.form.get('lastName')!.dirty || this.form.get('lastName')!.touched);
  }

  get emailInvalid() {
    return this.form.get('email')!.invalid && (this.form.get('email')!.dirty || this.form.get('email')!.touched);
  }

  get phoneInvalid() {
    return this.form.get('phone')!.invalid && (this.form.get('phone')!.dirty || this.form.get('phone')!.touched);
  }

  get initialInvestmentInvalid() {
    return this.form.get('initial_investment')!.invalid && (this.form.get('initial_investment')!.dirty || this.form.get('initial_investment')!.touched);
  }

  private dontShowNavAndFooter(){
    localStorage.setItem('nav', 'No mostrar');    
  }

  public maxLengthCheck(object: any) {   
    if (object.value.length > object.maxLength) {
      object.value = object.value.slice(0, object.maxLength)
    }
  }

  public convert(str:string) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  public onSubmit():void{
    this.spinner = true;
    
    this.form.get('appointment')?.setValue(this.convert(this.form.get('date')?.value));
    
    this.spinner = false;

    this._landingService.createLead(this.form.value)
        .subscribe({

          next: ({ code, status })  => {
            if (code === '200' && status === 'success') {

              Swal.fire({
                icon: 'success',
                title: 'Felicidades!!',
                text: 'Tu registro se genero de manera correcta',
                showConfirmButton: false,
                confirmButtonColor: '#EEB838',
                timer: 6500
              });
              this.form.reset();
              this.mytemplateForm.resetForm();              
              
              this.spinner = false;                            

            } else {
              // Change spinner
              this.spinner = false;
  
              // Animation request
              Swal.fire({
                icon: 'error',
                title: 'Oupps..',
                text: 'Ocurrio un error al procesar tu solicitud.',
                showConfirmButton: false,
                confirmButtonColor: '#EEB838',
                timer: 6500
              });
                                          
            }
          }

        });    
    
  }
}
