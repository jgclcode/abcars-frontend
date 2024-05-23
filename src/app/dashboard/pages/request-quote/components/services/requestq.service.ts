import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// HTTP CLient
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Environment
import { environment } from 'src/environments/environment';

// Interfaces
import { SheetOffer, Sheetquote } from '../interfaces/requestq.interface';

@Injectable({
  providedIn: 'root'
})
export class RequestqService {

  // Global Url
  private url: string = '';

  // Headers
  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('X-Requested-With', 'XMLHttpRequest');

  constructor(private _http: HttpClient) { 
    this.url = environment.baseUrl;
  }

  public setRequestQuote(
    body: string,
    brand: string,
    model: string,
    name: string,
    surname: string,
    email: string,
    phone: number,
    buyType: string
  ): Observable<Sheetquote>{
    let sendQuote = {
      "body": body,
      "brand": brand,
      "model": model,
      "name": name,
      "surname": surname,
      "email": email,
      "phone": phone,
      "buyType": buyType,
    }

    return this._http.post<Sheetquote>(this.url+'/api/sheet_quote', sendQuote, {headers: this.headers});
  }

  public setRequestOffer(
    body: string,
    brand: string,
    model: string,
    name: string,
    surname: string,
    email: string,
    phone: number,
    clientPriceOffer: number
  ): Observable<SheetOffer>{
    let sendOffer = {
      "body": body,
      "brand": brand,
      "model": model,
      "name": name,
      "surname": surname,
      "email": email,
      "phone": phone,
      "clientPriceOffer": clientPriceOffer,
    }

    return this._http.post<SheetOffer>(this.url+'/api/sheet_quote', sendOffer, {headers: this.headers});
  }

  public setQuoteRequest(
    body: string,
    brand: string,
    model: string,
    name: string,
    surname: string,
    email: string,
    phone: number,
    buyType: string,
    wantRelease: string,
    initialCredit: string,
    WhatsCurrentProfessionalSituation: string,
    commentaryLead: string,
  ): Observable<Sheetquote>{
    let sendQuote = {
      "body": body,
      "brand": brand,
      "model": model,
      "name": name,
      "surname": surname,
      "email": email,
      "phone": phone,
      "buyType": buyType,
      "wantRelease": wantRelease,
      "initialCredit": initialCredit,
      "WhatsCurrentProfessionalSituation": WhatsCurrentProfessionalSituation,
      "commentaryLead": commentaryLead
    }

    return this._http.post<Sheetquote>(this.url+'/api/sheet_quote', sendQuote, {headers: this.headers});
  }
}
