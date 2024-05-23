import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { QuoteData } from './../interfaces/quote-data.interface';
import { ServicesData } from './../interfaces/services-data.interface';
import { QuoteService } from './../interfaces/quote-service.interface';
@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  private baseUrl:string = environment.baseUrl;
  
  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('X-Requested-With', 'XMLHttpRequest');

  constructor(
    private _http:HttpClient
  ) { }

  public setQuote(
    vin:string,
    quoteDate:string | null,
    client_id:number,
    brand_id:number,
    carmodel_id: number
  ): Observable<QuoteData>{
    let body = {
      "type":"servicio",
      "vin":vin,
      "status": "progress",
      "quoteDate": quoteDate,
      "client_id": client_id,
      "brand_id": brand_id,
      "carmodel_id": carmodel_id
    }    

    return this._http.post<QuoteData>(this.baseUrl+'/api/quote', body, {headers: this.headers});
  }

  public getServices():Observable<ServicesData>{
    return this._http.get<ServicesData>(`${ this.baseUrl }/api/service`, { headers: this.headers });
  }

  public setQuoteService(
    quote_id:number,
    service_id:number
  ):Observable<QuoteService>{
    let body = {
      "quote_id":quote_id,
      "service_id":service_id
    }    

    return this._http.post<QuoteService>(this.baseUrl+'/api/quote/service', body, {headers: this.headers});
  }
}
