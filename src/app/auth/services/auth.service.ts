import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Form
import { UntypedFormGroup } from '@angular/forms';

// HTTP Client
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Enviroment
import { environment } from 'src/environments/environment';

// Interfaces
import { Client, Register } from '../interfaces/register.interface';
import { RecoverAccount } from '../interfaces/recover-account.interface';
import { ResetPassword } from '../interfaces/reset-password.interface';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  // Global Url
  private url: string = environment.baseUrl;

  // Headers
  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('X-Requested-With', 'XMLHttpRequest');        

  constructor(private _http: HttpClient) { }

  /**
   * API Login
   */
  public login(user: UntypedFormGroup): Observable<any> {   
    return this._http.post<any>(`${ this.url }/api/login`, user, { headers: this.headers });
  }

  /**
   * API Login
   */
  public newLogin(user: UntypedFormGroup): Observable<any> {   
    return this._http.post<any>(`${ this.url }/api/newLogin`, user, { headers: this.headers });
  }

  /**
   * API Register
   */
  public register(user: UntypedFormGroup): Observable<Register> {
    return this._http.post<Register>(`${ this.url }/api/register`, user, { headers: this.headers });
  }

  /**
   * API Register Client
   */
  public registerClient(client: UntypedFormGroup): Observable<Client> {
    return this._http.post<Client>(`${ this.url }/api/clients`, client);
  }

  /**
   * API Update Client
   */
  public updateClient(client_id: number, client: UntypedFormGroup): Observable<Client> {
    return this._http.put<Client>(`${ this.url }/api/clients/${ client_id }`, client, { 
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token'))) 
    });
  }

  public recoverAccount(email: string): Observable<RecoverAccount> {
    let body = {
      "email":email
    }  
    return this._http.post<RecoverAccount>(`${ this.url }/api/recoverAccount`, body);
  }

  public resetPassword( token:string, password:string ): Observable<ResetPassword>{
    let body = {
      "token":token,
      "password":password
    }  
    return this._http.put<ResetPassword>(`${ this.url }/api/resetPassword`, body);
  }
  
}
