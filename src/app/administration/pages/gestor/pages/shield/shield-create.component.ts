import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';

// Animations
import Swal from "sweetalert2";

import { ShieldService } from './services/shield.service';

import { SetShield } from './interfaces/set-shield.interface';
import { UpdateShield } from './interfaces/update-shield.interface';

@Component({
  selector: 'app-shield-create',
  templateUrl: './shield-create.component.html',
  styles: [
  ]
})
export class ShieldCreateComponent implements OnInit {

  // References of Help
  public spinner: boolean = false;
  public hide: boolean = true;

  // Form References
  public form!: UntypedFormGroup;
  public update_shield: boolean = false;
  public shield_id!:number;
  public file!: File;

  constructor(
    private _router: Router,
    private _shieldService: ShieldService,
    private _activatedRoute: ActivatedRoute,
    private _formBuilder: UntypedFormBuilder,
  ) { }

  ngOnInit(): void {
    this.scrollTop();
    this.createForm();
    this._activatedRoute.params
    .subscribe({
      next: (params) => {
        if( params['shield_id'] != undefined ){
          this.update_shield = true;
          this.shield_id = +params['shield_id'];
          this._shieldService.getShield( this.shield_id )
          .subscribe({
            next: (resp) => {
              if( resp.shield != null ){
                this.form.reset({
                  name: resp.shield.name
                });
              }
            }
          });
        }
      }
    });
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }

  get nameInvalid() {
    return this.form.get('name')!.invalid && (this.form.get('name')!.dirty || this.form.get('name')!.touched);
  }

  get pathInvalid() {
    return this.form.get('path')!.invalid && (this.form.get('path')!.dirty || this.form.get('path')!.touched);
  }

  public createForm() {
    this.form = this._formBuilder.group({
      name: [ '', [Validators.required, Validators.pattern("[a-zA-Z0-9$,.%áéíóú ]+") ]],
      path: [null, [Validators.required]],
    });
  }

  onChange(event: any): void {
    this.file = event.target.files[0];
  }

  setShield(){
    this._shieldService.setShield(
      this.form.get('name')?.value,
      this.file
    ).subscribe({
      next: ( setShield: SetShield ) =>{
        if (setShield.status == "success") {
          this.alertaSuccess(setShield);
        } else {
          this.alertaError(setShield);
        }
      }
    });
  }

  updateShield(){
    this._shieldService.updateShield(
      this.shield_id,
      this.form.get('name')?.value,
      this.file
    ).subscribe({
      next: ( updateShield: UpdateShield ) =>{
        if (updateShield.status == "success") {
          this.alertaSuccess(updateShield);
        } else {
          this.alertaError(updateShield);
        }
      }
    });
  }

  onSubmit(){
    if( this.update_shield ){
      this.updateShield();
    }else{
      this.setShield();
    }
  }

  public alertaSuccess(elemento: any) {
    Swal.fire({
      icon: 'success',
      text: elemento.message,
      showConfirmButton: true,
      confirmButtonColor: '#EEB838',
      timer: 3500
    }).then(() => {
      this.spinner = false;
      this._router.navigateByUrl('/admin/gestor/shields');
    });
  }

  public alertaError(elemento: any) {
    Swal.fire({
      icon: 'error',
      title: 'Ooopppps!',
      text: elemento.errors[0],
      showConfirmButton: true,
      confirmButtonColor: '#EEB838',
      timer: 3500
    }).then(() => {
      this.spinner = false;
    });
  }

}
