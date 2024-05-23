import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GetActiveValuator, GetAssignValuator, ValuationQuotes } from '../interfaces/valuation-quotes.interface';

@Injectable({
  providedIn: 'root'
})
export class ValuationQuotesService {

  private baseUrl: string = environment.baseUrl;

  constructor(
    private _http: HttpClient
  ) { }

  getValuationQuotes(page: number = 1): Observable<ValuationQuotes>{
    return this._http.get<ValuationQuotes>(`${ this.baseUrl }/api/get_valuation_quotes?page=${ page }`);
  }

  public getActiveValuator(): Observable<GetActiveValuator>{
    return this._http.get<GetActiveValuator>(`${ this.baseUrl }/api/get_active_valuator`);
  }

  public onChangeValuator(uid: number, sycid: number): Observable<GetAssignValuator>{
    return this._http.get<GetAssignValuator>(`${ this.baseUrl }/api/exists_assign_valuator/${uid}/${sycid}`);
  }

}
