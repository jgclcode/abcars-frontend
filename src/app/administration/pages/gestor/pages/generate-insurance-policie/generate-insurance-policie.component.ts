import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { InsurancePoliciesService } from '../../services/insurance-policies.service';
import { Vehicle } from '../../interfaces/get-vehicle-by-id.interface';
import Swal from "sweetalert2";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-generate-insurance-policie',
  templateUrl: './generate-insurance-policie.component.html',
  styles: [
  ]
})
export class GenerateInsurancePolicieComponent implements OnInit {

  public baseUrl:string = environment.baseUrl; 
  public vehicle_id!:number;
  public client_id!:number;

  public form!: UntypedFormGroup;
  public spinner:boolean = false;

  public vehicle!:Vehicle;

  public updated_client:boolean = false;
  public existsPolicy:boolean = false;
  public pdfUrl!:string;
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _insurancePoliciesService:InsurancePoliciesService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this._activatedRoute.params
    .subscribe({
      next: (params) => {
        if( params['vehicle_id'] != undefined && params['client_id'] != undefined){
          this.vehicle_id = +params['vehicle_id'];
          this.client_id = +params['client_id'];

          this.getVehicleById();
          this.getClientById();
        }
      }
    });
    this.scrollTop();
    this.createForm();
  }

  public createForm() {
    this.form = this._formBuilder.group({                  
      warranty_period: ['', [Validators.required]],
      signature_place: ['', [Validators.required]],      
      // Vigencia
      start_date_gm: ['', [Validators.required]],
      ending_date_gm: ['', [Validators.required]],
      start_date_ge: ['', [Validators.required]],
      ending_date_ge: ['', [Validators.required]],
      // Datos del comprador
      name: [{value: '', disabled: true}, [Validators.required, Validators.pattern("[a-zA-Z0-9- ]+")]],      
      surname: [{value: '', disabled: true}, [Validators.required, Validators.pattern("[a-zA-Z0-9- ]+")]],      
      address: ['', [Validators.required]],
      municipality: ['', [Validators.required]],
      rfc: ['', [Validators.required]],
      state: ['', [Validators.required]],
      phone: [{value: '', disabled: true}, [Validators.required]],
      cp: ['', [Validators.required]],
      email: [{value: '', disabled: true}, Validators.required],
      // Datos del vehículo
      brand: [{value: '', disabled: true}, Validators.required],
      km: [{value: '', disabled: true}, Validators.required],
      model: [{value: '', disabled: true}, Validators.required],
      cylinder: [{value: '', disabled: true}, Validators.required],
      model_year: [{value: '', disabled: true}, Validators.required],
      tuition: [{value: '', disabled: true}, Validators.required],
      vin: [{value: '', disabled: true}, Validators.required],
      km_last_service: ['', [Validators.required]],
      km_next_service: ['', [Validators.required]],
      business: ['abcars', [Validators.required]],
      buyer: ['firma', [Validators.required]],
      client_id: ['', [Validators.required]],
      vehicle_id: ['', [Validators.required]]
    });
  }

  public fieldInvalid( name:string ) {
    return this.form.get(name)!.invalid && (this.form.get(name)!.dirty || this.form.get(name)!.touched);
  }

  onSubmit(){    
    this.updateClient();    
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }

  async getVehicleById(){
    await this._insurancePoliciesService.getVehicleById( this.vehicle_id )
    .subscribe({
      next: (resp) => {
        this.vehicle = resp.vehicle;
        this.form.patchValue({
          brand: this.vehicle.carmodel.brand.name, 
          km: this.vehicle.km, 
          model: this.vehicle.carmodel.name, 
          cylinder: this.vehicle.cylinders, 
          model_year: this.vehicle.yearModel, 
          tuition: this.vehicle.plates, 
          vin: this.vehicle.vin,
          buyer: `${this.vehicle.client.user.name} ${this.vehicle.client.user.surname}`,
          client_id: this.client_id,
          vehicle_id: this.vehicle_id
        });
      }
    })
  }

  async getClientById(){
    this._insurancePoliciesService.getClientById( this.client_id )
    .subscribe({
      next: (resp) => {
        this.form.patchValue({
          name: resp.client.user.name,
          surname: resp.client.user.surname,
          address: resp.client.address,
          municipality: resp.client.municipality,
          rfc: resp.client.rfc,
          state: resp.client.state,
          phone: resp.client.phone1,
          cp: resp.client.cp,
          email: resp.client.user.email
        });
      }
    });
  }

  async updateClient(){
    await this._insurancePoliciesService.updateClient( this.form.value, this.client_id )
    .subscribe({
      next: (response) => {
        if( response.status === 'success' ){
          this.updated_client = true;
          this.setPolicie();
        }else{
            Swal.fire('Ocurrio un problema', '', 'error');
        }
      }
    })
  }

  async setPolicie(){
    if( !this.updated_client ){
      return;
    }

    await this._insurancePoliciesService.setPolicie( this.form.value )
    .subscribe({
      next: (resp) => {
        if( resp.status === 'success'  ){
          Swal.fire({
            icon: 'success',
            text: resp.message,
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          }).then( () => {
            this.existsPolicy = true;
            this.pdfUrl = this.baseUrl + '/api/getPoliciebyid/' + resp.policie.id;
          });
        }else{
          Swal.fire('Ocurrio un problema', '', 'error');
        }
      }
    })
  }

  public getPoliciebyid( policie_id: number ){
    this._insurancePoliciesService.getPoliciebyid( policie_id )
        .subscribe({
          next: (resp) => {
            console.log( resp );
          }
        });
  }

  public redirect(){
    this._router.navigate(['/admin/gestor/insurance-policies']);
  }

}
