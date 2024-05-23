import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Form
import { UntypedFormGroup } from '@angular/forms';

// HTTP Client
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Enviroment
import { environment } from 'src/environments/environment';

// Interfaces
import { UserByEmail, UserSettings, UserUpdate } from '../interfaces/settings.interface';
import { ImageData } from './../interfaces/load-image.interface';
import { RolData } from '../interfaces/rol-data.interface';

@Injectable({
  providedIn: 'root'
})

export class AccountService {

  // Global Url
  private url: string = environment.baseUrl;

  // Headers
  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('X-Requested-With', 'XMLHttpRequest');        

  constructor(private _http: HttpClient) { }

  /**
   * Consult the user with token and information
   * in Session Storage [Guards and protection routes].
   */
  public checkUser() {
    let user_token = localStorage.getItem('user_token');
    let user = localStorage.getItem('user');  
    
    // Check variables
    if (user_token && user) {      
      return true;              
    } else {
      return false;      
    }
  }

  public checkUserWithRol( rol:string,  ) {
    let user_token = localStorage.getItem('user_token');
    let user = localStorage.getItem('user');  
    
    let userJson = ( user_token && user ) ? JSON.parse(user) : { "id": 0 };             
    return this._http.get<RolData>(`${ this.url }/api/getRolByNameAndUserId/${ rol }/${ userJson.id }`, { 
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token')))
    });              
  }

  /**
   * API Get information User 
   */
  public getUser(user_id: number): Observable<UserSettings> {    
    return this._http.get<UserSettings>(`${ this.url }/api/user/${ user_id }`, { 
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token')))
    });
  }

  /**
   * API Get User by email
   */
  public getUserByEmail(email: string) {    
    return this._http.get(`${ this.url }/api/user/email/${ email }`);
  }

  /**
   * Check user active in database
   */
  public checkingUser(): Observable<boolean> {
    const u = JSON.parse(localStorage.getItem('user')!);
  
    return this.getUserByEmail(u.email).pipe(
      map(res => {        
        return res ? true : false
      })
    );
  }

  /**
   * API Update information User 
   */ 
  public update(user_id: number, form: UntypedFormGroup): Observable<UserUpdate> {    
    return this._http.post<UserUpdate>(`${ this.url }/api/user/update/${ user_id }`, form, { 
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token')))
    });
  }

  public setImage(
    user_id:number,
    fileToUpload: File
  ): Observable<ImageData>{
    const formData: FormData = new FormData();
    formData.append('picture', fileToUpload);   
    let headers = new HttpHeaders().set('Authorization', JSON.stringify(localStorage.getItem('user_token')));
    return this._http.post<ImageData>(this.url+'/api/user/image/' + user_id , formData, {headers: headers });
  }
  
}
