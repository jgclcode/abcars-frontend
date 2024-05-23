import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PromotionService } from '../../../services/promotion.service';

import Swal from "sweetalert2";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styles: [
  ]
})
export class AddComponent implements OnInit {
  // References of Help
  public spinner: boolean = false;
  public hide: boolean = true;

  // Form References
  public form!: UntypedFormGroup;

  public vin!:string;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _formBuilder: UntypedFormBuilder,
    private _promotionService: PromotionService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this._activatedRoute.params
    .subscribe({
      next: (params) => {
        if( params['vin'] != undefined ){
          this.vin = params['vin'];
          this.getVehicle();
        }
      }
    });
  }

  onSubmit(){
    this._promotionService.updatePromotion(
      this.vin,
      this.form.get('promotion')?.value
    ).subscribe({
      next: (resp) => {
        if( resp.status === 'success' ){
          Swal.fire({
            icon: 'success',
            text: resp.message,
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          }).then( () => {
            this._router.navigate(['/admin/gestor/promotions']);
          });
        }else{
          Swal.fire('Ocurrio un problema', '', 'error');
        }
      }
    });
  }

  get promotionInvalid() {
    return this.form.get('promotion')!.invalid && (this.form.get('promotion')!.dirty || this.form.get('promotion')!.touched);
  }

  public createForm() {
    this.form = this._formBuilder.group({
      promotion: [ '', [Validators.required ]]
    });
  }

  public getVehicle(){
    this._promotionService.getVehicleByVin( this.vin )
    .subscribe({
      next: (resp) => {
        this.form.reset({
          promotion: resp.vehicle.promotion
        });
      }
    });
  }
}
