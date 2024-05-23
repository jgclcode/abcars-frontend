import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

// Interfaces
import { GetDataQuotes } from '../interfaces/get-data-quotes.interface';
import { QuoteUpdate } from '../interfaces/quote-update.interface';
import { FeaturePost, FeaturesByQuote, GetFeatures, QuoteHistory } from '../interfaces/quote-history.interface';
import { UntypedFormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AftersaleService {
  private baseUrl = environment.baseUrl;
  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('X-Requested-With', 'XMLHttpRequest');

  constructor(private _http:HttpClient) { }

  public getDataQuotes( page: number = 1, word?: string ):Observable<GetDataQuotes>{
    let url = word != undefined && word?.length > 0 ? `${ this.baseUrl }/api/getDataQuotes/${ word }?page=${ page }` : `${ this.baseUrl }/api/getDataQuotes?page=${ page }`;
    return this._http.get<GetDataQuotes>(url , {
      headers: this.headers
    });
  }

  public quoteUpdate(form: UntypedFormGroup, quote_id:number):Observable<QuoteUpdate>{
    return this._http.put<QuoteUpdate>(`${ this.baseUrl }/api/quotes/newStatus/${ quote_id }`, form, {
      headers: this.headers
    });
  }

  /**
   * GET Client for params like email and phone.
   * @param word String
   * @returns Array
   */
  public getClientsByParams(word: string, quote_status: string = 'inactive', status: string = 'progress', page: number = 1): Observable<QuoteHistory> {
    return this._http.get<QuoteHistory>(`${ this.baseUrl }/api/quote/client/${ word }/${ quote_status }/${ status }?page=${ page }`);
  }

  /**
   * GET Features by Service ID
   * @param service_id Number
   * @returns Array
   */
  public getServiceFeatureById(service_id: number): Observable<GetFeatures> {
    return this._http.get<GetFeatures>(`${ this.baseUrl }/api/getServiceFeatureById/${ service_id }`);
  }

  /**
   * POST Features
   * @param request
   * @returns
   */
  public postFeature(request: any): Observable<FeaturePost> {
    return this._http.post<FeaturePost>(`${ this.baseUrl }/api/serviceResponse`, request);
  }

  /**
   * GET Features by Quote
   * @param quote_id Number
   * @returns Object
   */
  public getFeaturesByQuote(quote_id: number): Observable<FeaturesByQuote> {
    return this._http.get<FeaturesByQuote>(`${ this.baseUrl }/api/getfeaturesbyquote/${ quote_id }`);
  }

}