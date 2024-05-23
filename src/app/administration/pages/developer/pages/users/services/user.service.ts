import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UntypedFormGroup } from '@angular/forms';

// Interfaces
import { UserData } from '../interfaces/user-data.interface';
import { UserByIDData } from '../interfaces/user-by-id-data.interface';
import { UserUpdate } from '../interfaces/user-update.interface';
import { UserCreate } from '../interfaces/user-create.interface';
import { UserDelete } from '../interfaces/user-delete.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl:string = environment.baseUrl;
  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('X-Requested-With', 'XMLHttpRequest');        

  constructor(
    private _http:HttpClient
  ) { }

  public getUsers( total: number ):Observable<UserData>{
    return this._http.get<UserData>(`${ this.baseUrl }/api/users/${ total }`);
  }

  public getUserById( user_id:number ):Observable<UserByIDData>{
    return this._http.get<UserByIDData>(`${ this.baseUrl }/api/userById/${ user_id }`);
  }

  public updateUser( user: UntypedFormGroup, id: number ):Observable<UserUpdate>{
    return this._http.put<UserUpdate>(`${ this.baseUrl }/api/user/updateUserAndClient/${ id }`, user, { headers: this.headers });
  }

  public createUser( user: UntypedFormGroup ):Observable<UserCreate>{
    return this._http.post<UserCreate>(`${ this.baseUrl }/api/user/createUserAndClient`, user, { headers: this.headers });
  }

  public deleteUser( user_id: number ):Observable<UserDelete>{
    return this._http.delete<UserDelete>(`${ this.baseUrl }/api/user/deleteUserAndClient/${ user_id }`, { headers: this.headers });
  }

}
