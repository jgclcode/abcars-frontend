import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { Router } from '@angular/router';

import { SetJobData } from '../../interfaces/careers/set_job_data.interface';
import { CareerService } from '../../services/career.service';
import { Title } from '@angular/platform-browser';

// Animations
import Swal from "sweetalert2";

// Pipes
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-careers',
  templateUrl: './careers.component.html',
  providers: [{ 
    provide: MAT_DATE_LOCALE, useValue: 'es-ES', 
  }, DatePipe]
})

export class CareersComponent implements OnInit {

  // References of Help
  public spinner: boolean = false;
  public minDate: Date = new Date('1951-01-01');
  public maxDate: Date = new Date();

  // References 
  public careerForm!: UntypedFormGroup;
  public file!:any;

  constructor(
    private _router: Router,
    private _formBuilder: UntypedFormBuilder,
    private _careerService: CareerService,
    private _datePipe: DatePipe,
    private titleService: Title
  ) { 
    // Set Title View
    this.titleService.setTitle('Empleos'); 

    // Initialization of Form
    this.createFormInit(); 
  }

  ngOnInit(): void { 
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
    return this.careerForm.get('name')!.invalid && (this.careerForm.get('name')!.dirty || this.careerForm.get('name')!.touched);
  }

  get surnameInvalid() {
    return this.careerForm.get('surname')!.invalid && (this.careerForm.get('surname')!.dirty || this.careerForm.get('surname')!.touched);
  }

  get emailInvalid() {
    return this.careerForm.get('email')!.invalid && (this.careerForm.get('email')!.dirty || this.careerForm.get('email')!.touched);
  }

  get phoneInvalid() {
    return this.careerForm.get('phone')!.invalid && (this.careerForm.get('phone')!.dirty || this.careerForm.get('phone')!.touched);
  }

  get phoneLength() {
    let phone = this.careerForm.get('phone')!.value;
    return this.careerForm.get('phone')!.touched && (phone.length < 10 || phone.length > 10); 
  }

  get dateInvalid() {
    return this.careerForm.get('dateborn')!.invalid && (this.careerForm.get('dateborn')!.dirty || this.careerForm.get('dateborn')!.touched);
  }

  get fileInvalid() {
    return this.careerForm.get('file')!.invalid && (this.careerForm.get('file')!.dirty || this.careerForm.get('file')!.touched);
  }

  get captchaInvalid() {
    return this.careerForm.get('captcha')!.invalid && (this.careerForm.get('captcha')!.dirty || this.careerForm.get('captcha')!.touched);
  }

  /**
   * Form Initialization
   */
  private createFormInit() {
    this.careerForm = this._formBuilder.group({
      name: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      surname: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      email: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      phone: ['', [Validators.required, Validators.pattern("[0-9]+"), Validators.minLength(10), Validators.maxLength(10)]],
      dateborn: ['', Validators.required],
      file: ['', Validators.required],
      captcha: ['', Validators.required],
      checkbox: [false, Validators.required]
    });
  }

  /**
   * Launch Form
   */
  public onSubmit() {
    // Change spinner
    this.spinner = true;

    // Change spinner
    this.spinner = true;
    let name = this.careerForm.get('name')?.value;
    let surname = this.careerForm.get('surname')?.value;
    let email = this.careerForm.get('email')?.value;
    let phone = this.careerForm.get('phone')?.value;
    let dateborn = this._datePipe.transform(this.careerForm.get('dateborn')?.value, "yyyy-MM-dd");
    let file = this.file.target.files[0]; 

    this._careerService.setJob(
      name,
      surname,
      email,
      +phone,
      dateborn,
      file
    ).subscribe({
      next: ( setJobData: SetJobData ) => {
        // Change spinner
        this.spinner = false;

        // Animation request
        Swal.fire({
          icon: 'success',
          title: 'Solicitud enviada',
          text: 'Gracias por enviar tu solicitud de empleo, nos pondremos en contacto lo antes posible con usted.',
          showConfirmButton: true,
          confirmButtonColor: '#EEB838',
          timer: 4000
        });
        
        // Redirect
        this._router.navigate(['/saved-process']);
      }
    });
  }

  public assignFile(fileEvent: any) {
    this.file = fileEvent;
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

}