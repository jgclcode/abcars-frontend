import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Sheetquote } from '../interfaces/requestq.interface';

@Injectable({
  providedIn: 'root'
})
export class RequestqchevroletService {

  // Global Url
  private url: string = '';

  // Headers
  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('X-Requested-With', 'XMLHttpRequest');

  constructor(private _http: HttpClient) {
    this.url = environment.baseUrl;
  }

  public setQuoteRequestChevrolet(
    body: string,
    brand: string,
    model: string,
    prospectorName: string,
    prospectorSurname: string,
    placeProspection: string,
    name: string,
    surname: string,
    email: string,
    phone: number,
    buyType: string,
    next: string,
    brandType: string,
    newpreowned: string,
    commentaryLead: string,
    folioNumber: string,
    fullNameReferring: string
  ): Observable<Sheetquote>{
    let sendQuote = {
      "body": body,
      "brand": brand,
      "model": model,
      "prospectorName": prospectorName,
      "prospectorSurname": prospectorSurname,
      "placeProspection": placeProspection,
      "name": name,
      "surname": surname,
      "email": email,
      "phone": phone,
      "buyType": buyType,
      "next": next,
      "brandType": brandType,
      "newpreowned": newpreowned,
      "commentaryLead": commentaryLead,
      "folioNumber": folioNumber,
      "fullNameReferring": fullNameReferring,
    }

    return this._http.post<Sheetquote>(this.url+'/api/prospection_chevrolet', sendQuote, {headers: this.headers});
  }

}
