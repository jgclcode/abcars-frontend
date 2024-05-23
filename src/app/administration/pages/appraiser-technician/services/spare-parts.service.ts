import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

// Enviroment
import { environment } from 'src/environments/environment';

// Interfaces
import { PostSparePart, SpareParts, GetSpareParts } from '../interfaces/spare_parts.interface';

@Injectable({
  providedIn: 'root'
})

export class SparePartsService {

  // References
  private _url: string = environment.baseUrl;

  constructor(private _http: HttpClient) { }

  /**
   * Get spare_parts for sell your car
   * @param sell_your_car_id Number
   * @returns Spare Parts array
   */
  public getSpareParts(sell_your_car_id: number): Observable<GetSpareParts> {
    return this._http.get<GetSpareParts>(`${ this._url }/api/getSpare_partsBySellYourCar/${ sell_your_car_id }`);
  }

  /**
   * Post new spare part
   * @param form FormGroup
   */
  public postSparePart(form: UntypedFormGroup): Observable<PostSparePart> {
    return this._http.post<PostSparePart>(`${ this._url }/api/spare_parts`, form);
  }

}