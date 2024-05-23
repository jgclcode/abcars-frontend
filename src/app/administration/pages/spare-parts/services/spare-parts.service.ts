import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

// Enviroment
import { environment } from 'src/environments/environment';

// Interfaces
import { GetSpareParts, UpdateSparePart, PaintingWorks, UpdatePaintingWork, StatusCount } from '../interfaces/spare-parts.interface';
import { Valuator } from '../interfaces/valuators.interface';
import { SpareValuator } from '../interfaces/spare-valuators.interface';

@Injectable({
  providedIn: 'root'
})

export class SparePartsService {

  // References
  private _url: string = environment.baseUrl;

  constructor(private _http: HttpClient) { }

  /**
   * GET Sell parts by sell.
   * @param id Number
   * @returns GetSpareParts
   */
  public getSparePartsBySell(id: number): Observable<GetSpareParts> {
    return this._http.get<GetSpareParts>(`${ this._url }/api/getSpare_partsBySellYourCar/${ id }`);
  }

  public getValuationsCount(): Observable<StatusCount>{
    return this._http.get<StatusCount>(`${ this._url }/api/getValuationsCount`);
  }

  public getValuators(): Observable<Valuator>{
    return this._http.get<Valuator>(`${ this._url }/api/get_valuators`)
  }

  /**
   * PUT Spare Part.
   * @param form FormGroup
   * @param id Number
   * @returns UpdateSparePart Object
   */
  public putSparePartsByID(form: UntypedFormGroup,id: number): Observable<UpdateSparePart> {
    return this._http.put<UpdateSparePart>(`${ this._url }/api/spare_parts/${ id }`, form);
  }

  /**
   * GET Painting Works for Sell Vehicle.
   * @param sell_your_car_id Number
   * @returns Object
   */
  public getPaintingWorks(sell_your_car_id: number): Observable<PaintingWorks> {
    return this._http.get<PaintingWorks>(`${ this._url }/api/getPainting_worksBySellYourCar/${ sell_your_car_id }`);
  }

  /**
   * PUT Update Painting Work
   * @param painting_work_id Number
   * @param status String
   * @returns Object
   */
  public updatePaintingWork(painting_work_id: number, status: string): Observable<UpdatePaintingWork> {
    return this._http.put<UpdatePaintingWork>(`${ this._url }/api/painting_works/updateStatus/${ painting_work_id }`, { status });
  }

  public getSparePartsByValuators(dateValuation: string, dateEndValuation: string): Observable<SpareValuator>{
    return this._http.get<SpareValuator>(`${ this._url }/api/getNowPrintValuation/${dateValuation}/${dateEndValuation}`)
  }

}
