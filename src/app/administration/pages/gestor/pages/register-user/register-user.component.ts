import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from "sweetalert2";

// Services
import { InsurancePoliciesService } from '../../services/insurance-policies.service';
// Interfaces
import { Vehicle } from '../../interfaces/get-sale-vehicles-without-choice.interface';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styles: [
  ]
})
export class RegisterUserComponent implements OnInit {

  public form!: UntypedFormGroup;
  public spinner:boolean = false;
  public vehicles:Vehicle[] = [];

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _insurancePoliciesService:InsurancePoliciesService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getSaleVehiclesWithoutChoice();
  }

  public createForm() {
    this.form = this._formBuilder.group({
      // Datos del comprador
      name: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9- ]+")]],
      surname: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9- ]+")]],
      email: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      gender: ['', Validators.required],

      phone1: ['', Validators.required, Validators.minLength(10), Validators.maxLength(10)],
      curp: ['', Validators.required, Validators.minLength(18), Validators.maxLength(18)],
      points: ['0', Validators.required],
      address: ['', Validators.required],
      municipality: ['', Validators.required],
      state: ['', Validators.required],
      cp: ['', Validators.required, Validators.minLength(5), Validators.maxLength(5)],
      rfc: ['', Validators.required, Validators.minLength(13), Validators.maxLength(13)],

      user_id: [''],
      source_id: ['1', Validators.required],
      vehicle_id: ['', Validators.required],

      client_id: [''],
      amount: ['0', Validators.required],
      namePayment: ['ninguno', Validators.required],
      status: ['apartado', Validators.required],
      reference: ['ninguno', Validators.required],
      amountDate: ['2022-06-01', Validators.required],
      rewards: ['0', Validators.required]
    });
  }

  public fieldInvalid( name:string ) {
    return this.form.get(name)!.invalid && (this.form.get(name)!.dirty || this.form.get(name)!.touched);
  }

  onSubmit(){
    this.setUser();
  }

  public getSaleVehiclesWithoutChoice(){
    this._insurancePoliciesService.getSaleVehiclesWithoutChoice()
        .subscribe(
          resp => {
            this.vehicles = resp.vehicles;
          }
        );
  }

  public setUser(){
    this.spinner = true;
    this._insurancePoliciesService.register( this.form.value )
    .subscribe({
      next: (resp) => {
        if( resp.status === "success"){
          this.form.patchValue({
            user_id: resp.user.id
          });
          this.setClient();
        }else{
          Swal.fire('Ocurrio un problema', '', 'error');
          this.spinner = false;
        }
      }
    })
  }

  public setClient(){
    this._insurancePoliciesService.setClient( this.form.value )
    .subscribe({
      next: (resp) => {
        if( resp.status === "success"){
          this.form.patchValue({
            client_id: resp.client.id
          });
          this.setChoice();
        }else{
          Swal.fire('Ocurrio un problema', '', 'error');
          this.spinner = false;
        }
      }
    })
  }

  public setChoice(){
    this._insurancePoliciesService.setChoice( this.form.value )
    .subscribe({
      next: (resp) => {
        if( resp.status === "success"){
          Swal.fire({
            icon: 'success',
            text: "Usuario creado con exito",
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          }).then( () => {
            this._router.navigate(['/admin/gestor/insurance-policies']);
            this.spinner = false;
          });
        }else{
          Swal.fire('Ocurrio un problema', '', 'error');
          this.spinner = false;
        }
      }
    })
  }
}
