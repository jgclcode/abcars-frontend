import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Environments
import { environment } from 'src/environments/environment';

// Interfaces
import { SellYourCarValuations } from '../interfaces/appraiser-datatable.interface';
import { PriceOfferClients } from '../interfaces/client-price-offer.interface';
import { SheetQuotesOffer } from '../../spare-parts-manager/interfaces/sheet_quote_offer.interface';

@Injectable({
  providedIn: 'root'
})

export class AppraiserDatatableService {

  // Global Url
  private url: string = environment.baseUrl;

  constructor(private _http: HttpClient) { }

  /**
   * API Get sell cars, clients & users to fill dataTable
   */
  public getAppraiserSellCars(page: number = 1): Observable<SellYourCarValuations>{
    return this._http.get<SellYourCarValuations>(`${ this.url }/api/sell_your_car?page=${ page }`);
  }

  public getClientPriceOffer(page: number = 1): Observable<PriceOfferClients>{
    return this._http.get<PriceOfferClients>(`${ this.url }/api/get_client_price_offer?page=${ page }`);
  }

  public searchPriceOffer(query: string, amount: number, page: number = 1): Observable<SheetQuotesOffer>{
    return this._http.get<SheetQuotesOffer>(`${this.url}/api/search_report_offer/${query}/${amount}?page=${page}`);
  }
}
