import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Enviroment
import { environment } from 'src/environments/environment';

// Interfaces
import { Choices } from '../interfaces/sales.interface';

@Injectable({
  providedIn: 'root'
})

export class ChoicesService {

  // References
  private _url: string = environment.baseUrl;
  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('X-Requested-With', 'XMLHttpRequest');        

  constructor(private _http: HttpClient) { }

  /**
   * Get Choices
   */
  public getChoices(page: number = 1): Observable<Choices> {
    return this._http.get<Choices>(`${ this._url }/api/getchoices?page=${ page }`);
  }

}
