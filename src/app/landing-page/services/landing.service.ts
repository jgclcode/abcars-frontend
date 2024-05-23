import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LandingService {

  private baseUrl:string = environment.baseUrl;
  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('X-Requested-With', 'XMLHttpRequest');

  constructor(private _http:HttpClient) { }

  public createLead(form: UntypedFormGroup): Observable<any> {    
    return this._http.post<any>(`${ this.baseUrl }/api/conversionForm`, form, { headers: this.headers });
  }
}
