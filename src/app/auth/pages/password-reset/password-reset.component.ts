import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Services
import { AuthService } from '../../services/auth.service';
import { ResetPassword } from '../../interfaces/reset-password.interface';

// Alertas
import Swal from 'sweetalert2';
import { noSonIguales } from '../../directives/no-son-iguales.directive';
@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styles: [`
    mat-form-field { 
      width: 100%;
    }

    button {
      width: 80%;
    }
  `]
})
export class PasswordResetComponent implements OnInit {
  public hidePassword: boolean = true;
  public hideRepeatPassword: boolean = true;
  public spinner: boolean = false;  
  public form!: UntypedFormGroup;

  private token:string = '';

  constructor(
    private _formBuilder: UntypedFormBuilder, 
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _router: Router
  ) {
    this.createForm();
  }
  
  ngOnInit(): void {
    this._activatedRoute.params
    .subscribe({
      next: (params) => {
      this.token = params['token'];  
      }
    });
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }

  get passwordInvalid() {
    return this.form.get('password')!.invalid && this.form.get('password')!.dirty;
  }

  get passwordLength() {
    let password = this.form.get('password')!.value;
    return this.form.get('password')!.touched && (password.length < 8 || password.length > 32); 
  }

  get passwordRepeatInvalid() {
    return this.form.get('passwordRepeat')!.invalid && this.form.get('passwordRepeat')!.dirty;
  }

  get passwordRepeatLength() {
    let password = this.form.get('passwordRepeat')!.value;
    return this.form.get('passwordRepeat')!.touched && (password.length < 8 || password.length > 32); 
  }

  get passwordDiferentes() {
    const password = this.form.get("password")?.value
    const confirmarPassword = this.form.get("passwordRepeat")?.value;
    return this.form.get('passwordRepeat')!.touched && this.form.get('password')!.touched && (password !== confirmarPassword); 
  }

  public createForm() {
    this.form = this._formBuilder.group({
      password: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9@%#]+"), Validators.minLength(8), Validators.maxLength(32)]],
      passwordRepeat: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9@%#]+"), Validators.minLength(8), Validators.maxLength(32)]]
    }, { validators: noSonIguales });
  }

  public onSubmit() {
    this._authService.resetPassword( this.token, this.form.get('password')?.value )
    .subscribe({
      next: (resp: ResetPassword) => {
        if (resp.status == "success") {
          Swal.fire({
            icon: 'success',
            title: 'Proceso exitoso',
            text: resp.message,
            confirmButtonColor: '#EEB838',
          }).then( () => {
            this._router.navigate(['/', 'auth', 'iniciar-sesion']);
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: resp.message,
            confirmButtonColor: '#EEB838',
          });
        }
      }
    });
  }

}
