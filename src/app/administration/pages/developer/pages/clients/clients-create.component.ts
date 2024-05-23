import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
// Animations
import Swal from "sweetalert2";

// Services
import { AuthService } from 'src/app/auth/services/auth.service';
import { ClientService } from './services/client.service';

// Interfaces
import { ClientByIDData } from './interfaces/client-by-id-data.interface';
import { SourceData, Source } from './interfaces/source-data.interface';
import { UsersWithoutClientData, User } from './interfaces/users-without-client-data.interface';
import { ClientUpdate } from './interfaces/client-update.interface';
import { ClientCreate } from './interfaces/client-create.interface';

@Component({
  selector: 'app-clients-create',
  templateUrl: './clients-create.component.html'
})

export class ClientsCreateComponent implements OnInit {

  // References of Help
  public spinner: boolean = false;
  public hide: boolean = true;

  // Form References
  public form!: UntypedFormGroup;

  public update_client: boolean = false;
  public client_id!:number;
  public client: any|undefined = undefined;

  public formData = false;

  public users: User[] = [];
  public sources: Source[] = [];

  constructor(
    private _router: Router,
    private _formBuilder: UntypedFormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _clientService: ClientService
  ) {
    this.getSources();
    // Create form
    this.createForm();
  }

  ngOnInit(): void {
    this.scrollTop();

    this._activatedRoute.params
    .subscribe({
      next: (params) => {
        if( params['client_id'] != undefined ){
          this.update_client = true;
          this.client_id = +params['client_id'];
          this.getUsersWithoutClient( this.client_id );
          this.getClient();
        }else{
          this.getUsersWithoutClient(null);
          this.formData = true;
          this.createForm();
        }    
      }
    });
  }

  public getClient (){
    this._clientService.getClientById( this.client_id )
    .subscribe({
      next: (clientData:ClientByIDData) => {
        this.client = clientData.client;
        this.formData = true;
        // Create form
        this.createForm();
      }
    });
  }

  public getSources(){
    this._clientService.getSources()
        .subscribe(
          ( sourceData:SourceData ) => {
            this.sources = sourceData.sources;
          }
        );
  }

  public getUsersWithoutClient( client_id: number | null  ){
    this._clientService.getUsersWithoutClient( client_id )
        .subscribe(
          ( response: UsersWithoutClientData ) => {
            this.users = response.users;
          }
        );
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();
  }

  /**
   * Getters Inputs Check
   */
  get phoneOneInvalid() {
    return this.form.get('phone1')!.invalid && (this.form.get('phone1')!.dirty || this.form.get('phone1')!.touched);
  }

  get phoneTwoInvalid() {
    return this.form.get('phone2')!.invalid && (this.form.get('phone2')!.dirty || this.form.get('phone2')!.touched);
  }

  get curp() {
    return this.form.get('curp')!.invalid && (this.form.get('curp')!.dirty || this.form.get('curp')!.touched);
  }

  get pointsInvalid() {
    return this.form.get('points')!.invalid && (this.form.get('points')!.dirty || this.form.get('points')!.touched);
  }

  get userInvalid() {
    return this.form.get('user_id')!.invalid && (this.form.get('user_id')!.dirty || this.form.get('user_id')!.touched);
  }

  get sourceInvalid() {
    return this.form.get('source_id')!.invalid && (this.form.get('source_id')!.dirty || this.form.get('source_id')!.touched);
  }

  /**
   * Form Initialization
   */
  public createForm() {
    this.form = this._formBuilder.group({
      phone1: [this.client != undefined ? this.client?.phone1 : '', [Validators.required, Validators.pattern("[0-9]{10}"), Validators.minLength(10), Validators.maxLength(10)]],
      phone2: [this.client != undefined ? this.client?.phone2 : '', [Validators.required, Validators.pattern("[0-9]{10}"), Validators.minLength(10), Validators.maxLength(10)]],
      curp: [this.client != undefined ? this.client?.curp : '', [Validators.required, Validators.pattern("[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}" +
        "(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])" +
        "[HM]{1}" +
        "(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)" +
        "[B-DF-HJ-NP-TV-Z]{3}" +
        "[0-9A-Z]{1}[0-9]{1}$"), Validators.minLength(18), Validators.maxLength(18)]],
      points: [this.client != undefined ? this.client?.points : '', [Validators.required, Validators.pattern("^[0-9]+"), Validators.minLength(1), Validators.maxLength(7), Validators.min(0), Validators.max(1000000)]],
      user_id: [this.client != undefined ? this.client?.user_id : '', [Validators.required]],
      source_id: [this.client != undefined ? this.client?.source_id : '', [Validators.required]],
    });
  }

  /**
   * Form Client Information
   */
  public onSubmit() {
    this.spinner = true;
    if( !this.update_client ) {
      this._clientService.createClient( this.form.value )
      .subscribe({
        next: ( clientCreate:ClientCreate ) => {
          if( clientCreate.status == "success" ){
            this.alertaSuccess( clientCreate );
          }else{
            this.alertaError( clientCreate );
          }
        }
      });
    }else{
      this._clientService.updateClient( this.form.value, this.client_id )
      .subscribe({
        next: ( clientUpdate:ClientUpdate ) => {
          if( clientUpdate.status == "success" ){
            this.alertaSuccess( clientUpdate );
          }else{
            this.alertaError( clientUpdate );
          }
        }
      })
    }
  }

  public alertaSuccess( elemento: any ){
    Swal.fire({
      icon: 'success',
      text: elemento.message,
      showConfirmButton: true,
      confirmButtonColor: '#EEB838',
      timer: 3500
    }).then( () => {
      this.spinner = false;
      this._router.navigateByUrl('/admin/developer/clients');
    });
  }

  public alertaError( elemento: any ){
    Swal.fire({
      icon: 'error',
      title: 'Ooopppps!',
      text: elemento.errors[0],
      showConfirmButton: true,
      confirmButtonColor: '#EEB838',
      timer: 3500
    }).then(()=>{
      this.spinner = false;
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
