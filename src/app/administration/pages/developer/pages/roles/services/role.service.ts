import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

// Envrioments
import { environment } from 'src/environments/environment';

// Interfaces
import { RoleData, RoleDelete, RoleUpdate } from '../interfaces/role-data.interface';
import { RoleByID } from '../interfaces/role-by-id.interface';
import { RoleCreate } from '../interfaces/role-create.interface';

@Injectable({
  providedIn: 'root'
})

export class RoleService {

  // References
  private baseUrl: string = environment.baseUrl;
  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('X-Requested-With', 'XMLHttpRequest');  

  constructor(private _http: HttpClient) { }

  public getRoles(total: number): Observable<RoleData> {
    return this._http.get<RoleData>(`${this.baseUrl}/api/roles/${total}`);
  }

  public getRolById(id: number): Observable<RoleByID> {
    return this._http.get<RoleByID>(`${this.baseUrl}/api/rolebyid/${id}`);
  }
  
  public CreateRole(role: UntypedFormGroup): Observable<RoleCreate> {
    return this._http.post<RoleCreate>(`${this.baseUrl}/api/role`,role,{
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token'))) 
    });
  }

  public updateRole(role_id: number, name: UntypedFormGroup) : Observable<RoleUpdate> {
    return this._http.put<RoleUpdate>(`${ this.baseUrl }/api/role/${ role_id }`, name, {
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token'))) 
    });
  }

  public deleteRole(role_id: number): Observable<RoleDelete> {
    return this._http.delete<RoleDelete>(`${ this.baseUrl }/api/role/${ role_id }`, {
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token')))
    });
  }
 
}