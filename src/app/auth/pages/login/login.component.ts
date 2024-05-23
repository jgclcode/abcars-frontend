import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

// Animations
import Swal from 'sweetalert2';

// Services
import { AuthService } from '../../services/auth.service';

// Interfaces
import { Login, User } from '../../interfaces/login.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [`
    mat-form-field { 
      width: 100%;
    }

    button {
      width: 80%;
    }
  `]
})

export class LoginComponent implements OnInit {

  // References of Help
  public hide: boolean = true;
  public spinner: boolean = false;  

  // Form References
  public form!: UntypedFormGroup;

  constructor(
    private _authService: AuthService,
    private _formBuilder: UntypedFormBuilder, 
    private _router: Router,
    private titleService: Title
  ) { 
    // Set Title View
    this.titleService.setTitle('ABCars | Iniciar Sesión');

    // Create form
    this.createForm();
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
  get emailInvalid() {
    return this.form.get('email')!.invalid && (this.form.get('email')!.dirty || this.form.get('email')!.touched);
  }
  
  get passwordInvalid() {
    return this.form.get('password')!.invalid && this.form.get('password')!.dirty;
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
    this._authService.newLogin(this.form.value)
    .subscribe({
      next: ({ code, status, message, token, user }: Login) => {
        if (code === 200 && status === 'success') {
          if (token.length > 0) {
            // Save token user
            localStorage.setItem('user_token', token);

            localStorage.setItem('user', JSON.stringify({
              'id': user.id,
              'name': user.name,
              'surname': user.surname,
              'email': user.email,
              'role': user.roles[0] != undefined && user.roles[0].name ? user.roles[0].name : undefined 
            }));  

            if( user.roles[0] != undefined && user.roles[0].name ) {
              switch( user.roles[0].name ) {
                case 'client':
                  this._router.navigateByUrl('/auth/mi-cuenta');
                break;

                case 'marketing':
                  this._router.navigateByUrl('/admin/marketing');     
                break;

                case 'developer':
                  this._router.navigateByUrl('/admin/developer');     
                break;

                case 'appraiser':
                  this._router.navigateByUrl('/admin/appraiser');     
                break;

                case 'valuator':
                  this._router.navigateByUrl('/admin/valuator');     
                break;

                case 'sales':
                  this._router.navigateByUrl('/admin/sales');     
                break;

                case 'aftersales':
                  this._router.navigateByUrl('/admin/aftersales');     
                break;

                case 'gestor':
                  this._router.navigateByUrl('/admin/gestor');     
                  this.spinner = false;
                break;
                
                case 'appraiser_technician':
                  this._router.navigateByUrl('/admin/tecval');     
                break;

                case 'spare_parts':
                  this._router.navigateByUrl('/admin/parts');     
                break;

                case 'spare_parts_manager':
                  this._router.navigateByUrl('/admin/pmanager');     
                break;

                case 'contact':
                  this._router.navigateByUrl('/admin/contact');     
                break;

                case 'accountant':
                  this._router.navigateByUrl('/admin/contadora');     
                break;

                case 'seller':
                  this._router.navigateByUrl('/admin/seller');     
                break;

                case 'pictures':
                  this._router.navigateByUrl('/admin/pictures');   
                break;

                default:
                  this._router.navigateByUrl('/admin/not-authorized');     
                break;
              }
                    
            } else {
              this._router.navigateByUrl('/admin/not-authorized');
            }

          } else {
            // Change spinner
            this.spinner = false; 
            
            Swal.fire({
              icon: 'error',
              title: 'Oupps..',
              text: 'Al parecer ocurrio un error al autenticar su cuenta, verifique y vuelva a intentarlo.',
              showConfirmButton: true,
              confirmButtonColor: '#EEB838',
              timer: 3500         
            });
          }
        } else {
          // Change spinner
          this.spinner = false; 
            
          Swal.fire({
            icon: 'error',
            title: 'Oupps..',
            text: 'Al parecer ocurrio un error: ' + message,
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500         
          });
        }  
      }, 
      error: (error) => {
        // Animation request
        Swal.fire({
          icon: 'error',
          title: 'Oupps..',
          text: 'Al parecer ocurrio un error al autenticar su cuenta, verifique y vuelva a intentarlo.',
          showConfirmButton: true,
          confirmButtonColor: '#EEB838',
          timer: 3500
        });

        // Change spinner
        this.spinner = false;
      }
    });
  }

}
