import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShieldData } from '../interfaces/shield-data.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';

import { SetShield } from '../interfaces/set-shield.interface';
import { UpdateShield } from '../interfaces/update-shield.interface';
import { DeleteShield } from '../interfaces/delete-shield.interface';
import { GetShieldByID } from '../interfaces/get-shield-by-id.interface';

@Injectable({
  providedIn: 'root'
})
export class ShieldService {
  private baseUrl:string = environment.baseUrl;
  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('X-Requested-With', 'XMLHttpRequest');        

  constructor(
    private _http:HttpClient
  ) { }

  getShields( total: number ):Observable<ShieldData>{
    return this._http.get<ShieldData>(`${ this.baseUrl }/api/shields/${ total }`);
  }

  getShield( shield_id: number ): Observable<GetShieldByID>{
    return this._http.get<GetShieldByID>(`${ this.baseUrl }/api/shields/getShieldById/${ shield_id }`);
  }

  public setShield( name:string, fileToUpload: File ):Observable<SetShield>{
    const formData: FormData = new FormData();    
    formData.append('name', name);        
    formData.append('picture', fileToUpload);       
    return this._http.post<SetShield>(`${ this.baseUrl }/api/shield`, formData);
  }

  public updateShield( id:number, name:string, fileToUpload: File ):Observable<UpdateShield>{
    const formData: FormData = new FormData();    
    formData.append('name', name);        
    formData.append('picture', fileToUpload);       
    return this._http.post<UpdateShield>(`${ this.baseUrl }/api/updateWithImage/${ id }`, formData);
  }

  public deleteShield( id:number ):Observable<DeleteShield>{
    return this._http.delete<DeleteShield>(`${ this.baseUrl }/api/shield/${ id }`);
  }

}
