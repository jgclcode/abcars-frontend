import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Enviroments
import { environment } from 'src/environments/environment';

// Interfaces
import { SellYourCarValuations } from '../../appraiser/interfaces/appraiser-datatable.interface';
import { UpdateSellYourCar } from '../interfaces/buy-vehicles.interface';

@Injectable({
  providedIn: 'root'
})

export class AccountantService {

  // Global Url
  private url: string = environment.baseUrl;

  constructor(private _http: HttpClient) { }

  /**
   * API Get sell cars, clients & users to fill dataTable.
   */
  public getAppraiserSellCars(page: number = 1): Observable<SellYourCarValuations> {
    return this._http.get<SellYourCarValuations>(`${ this.url }/api/sell_your_car?page=${ page }`);
  }

  /**
   * PUT Update status of sell your car.
   * @param sell_your_car_id Number
   * @param status Number
   * @returns Object
   */
  public updateStatusSellYC(sell_your_car_id: number, status: string): Observable<UpdateSellYourCar> {
    return this._http.put<UpdateSellYourCar>(`${ this.url }/api/updatestandbyparts/${ sell_your_car_id }`, { status }, {
      headers: new HttpHeaders({ 'Authorization': JSON.stringify(localStorage.getItem('user_token')) })
    });
  }

  /**
   * API Update only the field estimated_payment_date on the table sell_your_cars.
   * @param sell_your_car_id Number
   * @param inputValue String
   */
  public estimatedPaymentDate(sell_your_car_id: number, estimated_payment_date: string): Observable<UpdateSellYourCar> {
    return this._http.put<UpdateSellYourCar>(`${ this.url }/api/update_estimated_payment/${ sell_your_car_id }`, { estimated_payment_date }, {
      headers: new HttpHeaders({ 'Authorization': JSON.stringify(localStorage.getItem('user_token')) })
    });
  }
  
}