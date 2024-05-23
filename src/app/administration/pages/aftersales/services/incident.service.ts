import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

// Interfaces
import { GetIncidents } from '../interfaces/get-incidents.interface';
import { IncidentUpdate } from '../interfaces/incident-update.interface';
import { IncidentsVehicle } from '../interfaces/incidents-vehicle.interface';
import { UntypedFormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private baseUrl = environment.baseUrl;
  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('X-Requested-With', 'XMLHttpRequest');
  constructor(
    private _http:HttpClient
  ) { }

  public getIncidents( page: number = 1, word?:string ):Observable<GetIncidents>{
    let url = word != undefined && word.length > 0 ? `${ this.baseUrl }/api/getIncidents/${ word }?page=${ page }` :  `${ this.baseUrl }/api/getIncidents?page=${ page }`;       
    return this._http.get<GetIncidents>( url, {
      headers: this.headers
    });
  }

  public getIncidentsVehicle(page: number = 1): Observable<IncidentsVehicle> {
    return this._http.get<IncidentsVehicle>(`${ this.baseUrl }/api/vehicle_incident?page=${ page }`, {
      headers: this.headers
    });
  }

  public incidentUpdate( status:string, id:number ):Observable<IncidentUpdate>{
    let body = {
      'status': status
    }
    return this._http.put<IncidentUpdate>(`${ this.baseUrl }/api/incidents/updateStatus/${ id }`, body, {
      headers: this.headers
    });
  }

  public incidentUpdateVehicle(id: number, incident: UntypedFormGroup): Observable<IncidentUpdate> {
    return this._http.put<IncidentUpdate>(`${ this.baseUrl }/api/vehicle_incident/${ id }`, incident, {
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token')))
    });
  }

}
