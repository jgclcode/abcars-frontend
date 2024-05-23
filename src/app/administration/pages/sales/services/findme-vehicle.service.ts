import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

// Enviroment
import { environment } from 'src/environments/environment';

// Interfaces
import { FindmeVehicle, UpdateFindmeVehicle } from '../interfaces/findme-vehicle.interface';

@Injectable({
  providedIn: 'root'
})
export class FindmeVehicleService {

  // References
  private _url: string = environment.baseUrl;
  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('X-Requested-With', 'XMLHttpRequest');        

  constructor(private _http: HttpClient) { }

  /**
   * Get requets Findme Vehicle
   */
  public getFindmeVehicles(page: number = 1): Observable<FindmeVehicle> {
    return this._http.get<FindmeVehicle>(`${ this._url }/api/request?page=${ page }`);
  }

  /**
   * Update Findme Vehicle
   * @param findmeVehicle_id Number
   * @param form FormGroup
   * @returns UpdateFindmeVehicle
   */
  public updateFindmeVehicle(findmeVehicle_id: number, form: UntypedFormGroup): Observable<UpdateFindmeVehicle> {
    return this._http.put<UpdateFindmeVehicle>(`${ this._url }/api/request/${ findmeVehicle_id }`, form, { 
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token'))) 
    });
  }

}