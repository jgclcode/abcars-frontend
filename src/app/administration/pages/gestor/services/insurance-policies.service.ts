import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GetProspectusToInsurancePolicies } from '../interfaces/get-prospectus-to.insurance-policies.interface';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { GetVehicleByID } from '../interfaces/get-vehicle-by-id.interface';
import { UntypedFormGroup } from '@angular/forms';
import { GetClientByID } from '../interfaces/get-client-by-id.interface';
import { SetPolicie } from '../interfaces/set-policie.interface';
import { UpdateClient } from '../interfaces/update-client.interface';
import { GetSaleVehiclesWithoutChoice } from '../interfaces/get-sale-vehicles-without-choice.interface';
import { SetChoice } from '../interfaces/set-choice.interface';
import { SetClient } from '../interfaces/set-client.interface';
import { RegisterUSer } from '../interfaces/register-user.interface';

@Injectable({
  providedIn: 'root'
})
export class InsurancePoliciesService {

  private baseUrl:string = environment.baseUrl;

  constructor(
    private _http: HttpClient
  ) { }

  public getProspectusToInsurancePolicies( word:string ): Observable<GetProspectusToInsurancePolicies>{
    word = word.length === 0 ? '@' : word;
    return this._http.get<GetProspectusToInsurancePolicies>(`${this.baseUrl}/api/getProspectusToInsurancePolicies/${word}`);
  }

  public getVehicleById( vehicle_id: number ):Observable<GetVehicleByID>{
    return this._http.get<GetVehicleByID>(`${this.baseUrl}/api/vehicleById/${vehicle_id}`, {
      headers: new HttpHeaders({ 'Authorization': JSON.stringify(localStorage.getItem('user_token')) })
    });
  }

  public getClientById( client_id:number ):Observable<GetClientByID>{
    return this._http.get<GetClientByID>(`${this.baseUrl}/api/getClientById/${client_id}`, {
      headers: new HttpHeaders({ 'Authorization': JSON.stringify(localStorage.getItem('user_token')) })
    });
  }

  public updateClient( data: UntypedFormGroup, client_id: number ):Observable<UpdateClient>{
    return this._http.put<UpdateClient>(`${ this.baseUrl }/api/client/updateDataToPolicie/${ client_id }`, data, {
      headers: new HttpHeaders({ 'Authorization': JSON.stringify(localStorage.getItem('user_token')) })
    });
  }

  public setPolicie( data: UntypedFormGroup ):Observable<SetPolicie>{
    return this._http.post<SetPolicie>(`${ this.baseUrl }/api/policies`, data, {
      headers: new HttpHeaders({ 'Authorization': JSON.stringify(localStorage.getItem('user_token')) })
    });
  }
  
  public getSaleVehiclesWithoutChoice():Observable<GetSaleVehiclesWithoutChoice>{
    return this._http.get<GetSaleVehiclesWithoutChoice>(`${ this.baseUrl }/api/getSaleVehiclesWithoutChoice`);
  }

  public register( data: UntypedFormGroup ):Observable<RegisterUSer>{
    return this._http.post<RegisterUSer>(`${ this.baseUrl }/api/register`, data, {
      headers: new HttpHeaders({ 'Authorization': JSON.stringify(localStorage.getItem('user_token')) })
    });
  }

  public setClient( data: UntypedFormGroup ):Observable<SetClient>{
    return this._http.post<SetClient>(`${ this.baseUrl }/api/clients`, data, {
      headers: new HttpHeaders({ 'Authorization': JSON.stringify(localStorage.getItem('user_token')) })
    });
  }

  public setChoice( data: UntypedFormGroup ):Observable<SetChoice>{
    return this._http.post<SetChoice>(`${ this.baseUrl }/api/choices`, data, {
      headers: new HttpHeaders({ 'Authorization': JSON.stringify(localStorage.getItem('user_token')) })
    });
  }

  public getPoliciebyid( policie_id: number ){
    return this._http.get(`${ this.baseUrl }/api/getPoliciebyid/${ policie_id }`);
  }
}
