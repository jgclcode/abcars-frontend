import { Component, OnInit } from '@angular/core';
import { InsurancePoliciesService } from '../../services/insurance-policies.service';
import { Client, ChoicesWithVehicle, Policy } from '../../interfaces/get-prospectus-to.insurance-policies.interface';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-insurance-policies',
  templateUrl: './insurance-policies.component.html',
  styles: [
  ]
})
export class InsurancePoliciesComponent implements OnInit { 
  public baseUrl:string = environment.baseUrl; 
  public prospectus!:Client[];
  public choices!:ChoicesWithVehicle[];
  public policies!:Policy[];
  public buyer!:String;
  public client_id!:Number;

  constructor(
    private _insurancePoliciesService:InsurancePoliciesService
  ) { }

  ngOnInit(): void {
    this.scrollTop();
  }

  public applyFilter(event: Event) {
    this.choices = [];
    this.policies = [];
    const filterValue = (event.target as HTMLInputElement).value;
    this._insurancePoliciesService.getProspectusToInsurancePolicies( filterValue )
    .subscribe({
      next: (resp) => {
        this.prospectus = resp.clients;
      }
    })
  }

  public setVehicles( name:String, client_id:Number, choices:ChoicesWithVehicle[], policies:Policy[] ){
    this.buyer = name;
    this.choices = choices;
    this.client_id = client_id;
    this.policies = policies;
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();
  }

  existsPolicy( vehicle_id:  number, returnBoolean: boolean = true ): boolean | number{
    let exists:boolean | number = false;
    this.policies.find( policy => {
      if( returnBoolean){
        exists = policy.vehicle_id === vehicle_id ? true : false;
      }else{
        exists = policy.vehicle_id === vehicle_id ? policy.id : false;
      }
    });
    return exists;
  }

  public getPoliciebyid( vehicle_id:  number ){
    const policie_id = this.existsPolicy( vehicle_id, true);
    this._insurancePoliciesService.getPoliciebyid( +policie_id )
    .subscribe({
      next: (resp) => {
        console.log( resp );
      }
    });
  }
}
