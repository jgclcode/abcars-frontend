import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';


import { environment } from 'src/environments/environment';

// Animations
import Swal from 'sweetalert2';

// Services
import { AccountService } from '../../services/account.service';
import { AuthService } from 'src/app/auth/services/auth.service';

// Interfaces
import { UserSettings, UserUpdate } from '../../interfaces/settings.interface';
import { Client } from 'src/app/auth/interfaces/register.interface';
import { ImageData } from './../../interfaces/load-image.interface';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {

  // References of Help
  public hide: boolean = true;
  public spinner: boolean = false;  

  // References Form
  public form!: UntypedFormGroup;
  private formClient!: UntypedFormGroup;
  public url_dashboard: string = '/auth/mi-cuenta';
  public user_id!: number;

  // path de imagn
  public image_path: string = ""; 
  private url: string = environment.baseUrl;

  constructor (
    private _router: Router,
    private _formBuilder: UntypedFormBuilder,
    private _accountService: AccountService,
    private _authService: AuthService,
    private _appComponent: AppComponent,
    private titleService: Title
  ) { 
    // Set Title View
    this.titleService.setTitle('ABCars | Perfil');

    // Get information user
    this.getUser();

    // Create form
    this.createForm();

    // Set url for dashboard
    this.url_dashboard = this._appComponent.get_url_dashboard();
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
  public get nameInvalid() {
    return this.form.get('name')!.invalid && (this.form.get('name')!.dirty || this.form.get('name')!.touched);
  }

  public get surnameInvalid() {
    return this.form.get('surname')!.invalid && (this.form.get('surname')!.dirty || this.form.get('surname')!.touched);
  }

  public get phoneOneInvalid() {
    return this.form.get('phoneOne')!.invalid && (this.form.get('phoneOne')!.dirty || this.form.get('phoneOne')!.touched);
  }

  public get phoneTwoInvalid() {
    return this.form.get('phoneTwo')!.invalid && (this.form.get('phoneTwo')!.dirty || this.form.get('phoneTwo')!.touched);
  }

  public get genderInvalid() {
    return this.form.get('gender')!.invalid && (this.form.get('gender')!.dirty || this.form.get('gender')!.touched);
  }

  public get emailInvalid() {
    return this.form.get('email')!.invalid && (this.form.get('email')!.dirty || this.form.get('email')!.touched);
  }

  public get curp() {
    return this.form.get('curp')!.invalid && (this.form.get('curp')!.dirty || this.form.get('curp')!.touched);
  }

  public get passwordInvalid() {
    return this.form.get('password')!.invalid && (this.form.get('password')!.dirty || this.form.get('password')!.touched);
  }

  public get passwordLength() {
    let password = this.form.get('password')!.value;
    return this.form.get('password')!.touched && (password.length < 8 || password.length > 32); 
  }
  
  /**
   * Form Initialization
   */
  private createForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      surname: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      phoneOne: ['', [Validators.required, Validators.pattern("[0-9]+"), Validators.minLength(10), Validators.maxLength(10)]],
      phoneTwo: ['', [Validators.required, Validators.pattern("[0-9]+"), Validators.minLength(10), Validators.maxLength(10)]],
      curp: ['', [Validators.required, Validators.pattern("[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}" +
        "(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])" +
        "[HM]{1}" +
        "(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)" +
        "[B-DF-HJ-NP-TV-Z]{3}" +
        "[0-9A-Z]{1}[0-9]{1}$"), Validators.minLength(18), Validators.maxLength(18)]],
      gender: ['', [Validators.required]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      password: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9@%#]+"), Validators.minLength(8), Validators.maxLength(32)]],
      client_id: ['']
    });
  }

  /**
   * Get information User
   */
  private getUser() {
    // Get information user in session storage
    const user = JSON.parse(localStorage.getItem('user')!);
    this.user_id = user.id;
    // Launch request
    this._accountService.getUser(user.id)
    .subscribe({
      next: ({ code, user }: UserSettings) => {
        if (code === 200) {
          // Patch Form with information user
          this.form.patchValue({
            name: user.name,
            surname: user.surname,
            phoneOne: (user.clients[0]) ? user.clients[0].phone1 : '0000000000',
            phoneTwo: (user.clients[0]) ? user.clients[0].phone2 : '0000000000',
            curp: (user.clients[0].curp) ? user.clients[0].curp : 'XXXXXXXXXXXXXXXXX1',
            gender: user.gender,
            email: user.email,
            client_id: user.clients[0].id
          });
          this.image_path = user.picture == null ? `./assets/icons/profile.svg` : `${this.url}/api/user/image/${user.picture}`;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oupps..',
            text: 'No se pudo obtener exitosamente su información, intente nuevamente.',
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });
        }
      }, 
      error: (e) => {
        // Animation request
        Swal.fire({
          icon: 'error',
          title: 'Oupps..',
          text: 'Ocurrio un error al obtener su información, vuelva a intentarlo más tarde. ' + e.error.message,
          showConfirmButton: true,
          confirmButtonColor: '#EEB838',
          timer: 3500
        });
      }
    });
  }

  /**
   * Form Client Information
  */
  public onSubmit() { 
    // Change spinner
    this.spinner = true;

    // Get information user in session storage
    const user = JSON.parse(localStorage.getItem('user')!);

    // Launch request
    this._accountService.update(user.id, this.form.value)
    .subscribe({
      next: ({ code, status, message, user }: UserUpdate) => {
        if (code === '200' && status === 'success') {
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
          this._authService.updateClient(this.form.controls.client_id.value, this.formClient.value)
          .subscribe({
            next: ({ code, status, message }: Client) => {
              if (code === '200' && status === 'success') {
                // Save information user
                localStorage.setItem('user', JSON.stringify({
                  'id': user.id,
                  'name': user.name,
                  'surname': user.surname,
                  'email': user.email
                }));
                
                // Animation request
                Swal.fire({
                  icon: 'success',
                  title: 'Actualización',
                  text: 'Actualización exitosa.',
                  showConfirmButton: true,
                  confirmButtonColor: '#EEB838',
                  timer: 3500
                });
                
                // Change spinner
                this.spinner = false;

                // Redirect.
                this._router.navigateByUrl('/auth/mi-cuenta');
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
            text: 'Ocurrio un error al actualizar su información: ' + message,
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });
        }
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

  public assignImage( fileEvent: any ){
    const file = fileEvent.target.files[0];
    this._accountService.setImage( this.user_id, file )
    .subscribe({
      next: (resp:ImageData) => {
        
        if( resp.status == "success" ){
          console.log("uno");
          this.image_path = `${this.url}/api/user/image/${resp.user.picture}`;
          Swal.fire({
            icon: 'success',
            title: 'Actualización',
            text: 'Actualización exitosa.',
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });
        }else{
          console.log("dos");
          console.log(resp.user);
          // Animation request  
          Swal.fire({
            icon: 'error',
            title: 'Oupps..',
            text: 'Ocurrio un error al actualizar su información: ' + resp.errors[0],
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500         
          });
        }
        
      }
    })
  
  }

}
