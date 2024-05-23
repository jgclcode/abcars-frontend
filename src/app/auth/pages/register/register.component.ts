import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

// Animations
import Swal from 'sweetalert2';

// Services
import { AuthService } from '../../services/auth.service';

// Interfaces
import { Client, Register } from '../../interfaces/register.interface';
import { Login } from '../../interfaces/login.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [`
    mat-form-field { 
      width: 100%;
    }

    button {
      width: 80%;
    }
  `]
})

export class RegisterComponent implements OnInit {

  // References of Help
  public hide: boolean = true;
  public spinner: boolean = false;

  // Form References
  public form!: UntypedFormGroup;
  private formClient!: UntypedFormGroup;
  public auth!: UntypedFormGroup;

  constructor(
    private _router: Router,
    private _formBuilder: UntypedFormBuilder, 
    private _authService: AuthService,
    private titleService: Title
  ) { 
    // Set Title View
    this.titleService.setTitle('ABCars | Registrarme');

    // Create form
    this.createForm();
  }

  ngOnInit(): void {
    this.scrollTop();
  }

  scrollTop() {
    var scrollElem= document.querySelector('#moveTop');
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

  get phoneOneInvalid() {
    return this.form.get('phoneOne')!.invalid && (this.form.get('phoneOne')!.dirty || this.form.get('phoneOne')!.touched);
  }

  get phoneTwoInvalid() {
    return this.form.get('phoneTwo')!.invalid && (this.form.get('phoneTwo')!.dirty || this.form.get('phoneTwo')!.touched);
  }

  get genderInvalid() {
    return this.form.get('gender')!.invalid && (this.form.get('gender')!.dirty || this.form.get('gender')!.touched);
  }

  get curpInvalid() {
    return this.form.get('curp')!.invalid && (this.form.get('curp')!.dirty || this.form.get('curp')!.touched);
  }

  get emailInvalid() {
    return this.form.get('email')!.invalid && (this.form.get('email')!.dirty || this.form.get('email')!.touched);
  }

  get passwordInvalid() {
    return this.form.get('password')!.invalid && (this.form.get('password')!.dirty || this.form.get('password')!.touched);
  }

  get passwordLength() {
    let password = this.form.get('password')!.value;
    return this.form.get('password')!.touched && (password.length < 8 || password.length > 32); 
  }

  /**
   * Login Form Initialization
   */
  public createForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+") ]],
      surname: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      phoneOne: ['', [Validators.required, Validators.pattern("[0-9]{10}"), Validators.minLength(10), Validators.maxLength(10)]],
      phoneTwo: ['', [Validators.required, Validators.pattern("[0-9]{10}"), Validators.minLength(10), Validators.maxLength(10)]],
      curp: ['', [Validators.required, Validators.pattern("[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}" +
        "(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])" +
        "[HM]{1}" +
        "(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)" +
        "[B-DF-HJ-NP-TV-Z]{3}" +
        "[0-9A-Z]{1}[0-9]{1}$"), Validators.minLength(18), Validators.maxLength(18)]],
      gender: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      password: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9@%#]+"), Validators.minLength(8), Validators.maxLength(32)]]  
    });
  }

  /**
   * Form Client Information
  */
  public onSubmit() { 
    // Change spinner
    this.spinner = true;

    // Launch request
    this._authService.register(this.form.value)
    .subscribe({
      next: ({ code, status, user, message }: Register) => {        
        if (code === '200' && status === 'success') {
          if (user) {
            // Information user destructuring
            this.auth = this._formBuilder.group({
              email: [user.email],
              password: [this.form.controls['password'].value],
              gettoken: [true]
            });

            // Login of the user with email and password for get token
            this._authService.login(this.auth.value)
            .subscribe({
              next: ({ code, token }: Login) => {
                if (code === 200 && token.length > 0) {
                  // Save token user
                  localStorage.setItem('user_token', token);

                  // Generate Form Group Client
                  this.formClient = this._formBuilder.group({
                    phone1: [this.form.controls.phoneOne.value],
                    phone2: [this.form.controls.phoneTwo.value],
                    curp: [this.form.controls.curp.value],
                    points: [0],
                    user_id: [user.id],
                    source_id: [1]
                  });

                  // Lauch request Client
                  this._authService.registerClient(this.formClient.value)
                  .subscribe({
                    next: ({ code, status }: Client) => {
                      if (code === '200' && status === 'success') {
                        // Change spinner
                        this.spinner = false;

                        // Save information user
                        localStorage.setItem('user', JSON.stringify({
                          'id': user.id,
                          'name': user.name,
                          'surname': user.surname,
                          'email': user.email,
                          'role': user.roles[0] != undefined && user.roles[0].name ? user.roles[0].name : undefined 
                        }));   
                        
                        // Animation request  
                        Swal.fire({
                          icon: 'success',
                          title: 'Bienvenido ' + user.name,
                          text: 'Registro exitoso, este es tu perfil en ABCars.mx',
                          showConfirmButton: true,
                          confirmButtonColor: '#EEB838',
                          timer: 3500
                        });
                        
                        // Redirect.
                        this._router.navigateByUrl('/auth/mi-cuenta');
                      } else {
                        // Animation request
                        Swal.fire({
                          icon: 'error',
                          title: 'Oupps..',
                          text: 'Al parecer ocurrio un error al registrar su cuenta.',
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
          } else {
            // Change spinner
            this.spinner = false;
            
            // Animation request
            Swal.fire({
              icon: 'error',
              title: 'Oupps..',
              text: 'Al parecer la información ingresada ya ha sido utilizada por otro cliente, verifique e intente nuevamente.',
              showConfirmButton: true,
              confirmButtonColor: '#EEB838',
              timer: 3500
            });
          }
        }
      },
      error: (error) => {
        // Animation request  
        Swal.fire({
          icon: 'error',
          title: 'Oupps..',
          text: 'Al parecer ocurrio un error al registrar su cuenta, verifique y vuelva a intentarlo.',
          showConfirmButton: true,
          confirmButtonColor: '#EEB838',
          timer: 3500
        });

        // Change spinner
        this.spinner = false;
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
