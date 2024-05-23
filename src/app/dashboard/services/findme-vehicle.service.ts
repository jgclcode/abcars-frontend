import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

// Enviroments
import { environment } from 'src/environments/environment';

// Interfaces
interface Request {
  code: string;
  message: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})

export class FindmeVehicleService {

  // Global Url
  private url: string = environment.baseUrl;

  // Headers
  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('X-Requested-With', 'XMLHttpRequest');        

  constructor(private _http: HttpClient) { }

  /**
   * Generate request
   * @param form Information request
   * @returns JSON request
   */
  public request(form: UntypedFormGroup): Observable<Request> {
    return this._http.post<Request>(`${ this.url }/api/request`, form, { headers: this.headers });
  }
  
}