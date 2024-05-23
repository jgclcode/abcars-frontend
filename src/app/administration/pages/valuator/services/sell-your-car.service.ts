import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

// Enviroment
import { environment } from 'src/environments/environment';

// Interfaces
import { ValuatorChecklist } from '../../appraiser/interfaces/valuator.checklist.interface';
import { ChecklistUpdRej } from '../interfaces/checklistupd-rej.interface';
import { ChecklistUpdBought } from '../interfaces/checklistupd-bought.interface';
import { SellYourCar } from '../interfaces/sell-your-car.interface';
import { Documentation, GetDocumentImagen, PostDocumentation, UpdateDocument } from '../interfaces/documentation.interface';
import { Updstandbyparts } from '../interfaces/update-standby-parts.interface';
import { GetDocumentation } from '../interfaces/get-documentation.interface';
import { StoreDocumentation } from '../interfaces/store-documentation.interface';

@Injectable({
  providedIn: 'root'
})

export class SellYourCarService {

  // Referencias
  private _url: string = environment.baseUrl;

  // Headers
  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('X-Requested-With', 'XMLHttpRequest');

  constructor(private _http: HttpClient) { }

  public getSellYourCarRequets(page: number = 1): Observable<SellYourCar> {
    return this._http.get<SellYourCar>(`${ this._url }/api/sell_your_car?page=${ page }`);
  }

  public getValuatorsDate(userID: number, page: number = 1): Observable<SellYourCar> {
    return this._http.get<SellYourCar>(`${ this._url }/api/getvaluatordates/${ userID }?page=${ page }`);
  }

  public updateQuotationSell(id: number, valuation: UntypedFormGroup): Observable<ValuatorChecklist>{
    return this._http.put<ValuatorChecklist>(`${ this._url}/api/updatequotation/${id}`, valuation, {
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token')))
    });
  }

  public updateStatusReject(id: number, status: Object): Observable<ChecklistUpdRej>{
    return this._http.put<ChecklistUpdRej>(`${ this._url }/api/updatestatus/${ id }`, status, {
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token')))
    });
  }

  public updateStatusBought(id: number, status: Object): Observable<ChecklistUpdBought>{
    return this._http.put<ChecklistUpdBought>(`${ this._url }/api/updatebought/${id}`, status, {
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token')))
    });
  }

  public updateStatusStandByParts(id: number, status: Object): Observable<Updstandbyparts>{
    return this._http.put<Updstandbyparts>(`${ this._url }/api/updatestandbyparts/${id}`, status, {
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token')))
    });
  }

  public updateDocumentation(id: number, documentation: UntypedFormGroup): Observable<StoreDocumentation>{
    return this._http.put<StoreDocumentation>(`${ this._url }/api/document_image/${ id }`, documentation, {
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token')))
    });
  }

  /**
   * Documentation for Check List
   */
  public documentation(): Observable<Documentation> {
    return this._http.get<Documentation>(`${ this._url }/api/document`);
  }

  /**
   * POST Documentation Imagen
   * @param params Picture, Check List ID and Document ID
   * @returns PostDocumentation
   */
  public postDocument({ picture, check_list_id, document_id }: any): Observable<PostDocumentation> {
    let formData: FormData = new FormData();
    formData.append('picture', picture);
    formData.append('check_list_id', check_list_id);
    formData.append('document_id', document_id);
      
    return this._http.post<PostDocumentation>(`${ this._url }/api/document_image`, formData);
  }

  public setDocumentation(documentation: UntypedFormGroup): Observable<StoreDocumentation>{
    return this._http.post<StoreDocumentation>(`${ this._url }/api/document_image`, documentation, {
      headers: this.headers
    });
  }

  /**
   * POST Document Imagen
   * @param document_id Number
   * @param form Any
   * @returns PutDocument
   */
  public updateDocument(document_id: number, picture: File): Observable<UpdateDocument> {
    let formData: FormData = new FormData();
    formData.append('picture', picture);    
  
    return this._http.post<UpdateDocument>(`${ this._url }/api/update_document_image/${ document_id }`, formData);
  }
  
  public updatePdfDocument(document_id: number, picture: File): Observable<UpdateDocument> {
    let formData: FormData = new FormData();
    formData.append('picture', picture);    
  
    return this._http.post<UpdateDocument>(`${ this._url }/api/update_document_pdf/${ document_id }`, formData);
  }

  /**
   * Get Document Imagen
   * @param check_lists_id number
   * @param document_id number
   * @returns GetDocumentImagen
   */
  public getDocumentImagen(check_lists_id: number, document_id: number): Observable<GetDocumentImagen> { 
    return this._http.get<GetDocumentImagen>(`${ this._url }/api/getDocumentImage/${ check_lists_id }/${ document_id}`);
  }
  
  // public getDocumentation(check_lists_id: number): Observable<GetDocumentation> { 
  public getDocumentation(sell_your_car_id: number): Observable<GetDocumentation> { 
    // return this._http.get<GetDocumentation>(`${ this._url }/api/getDocumentation/${ check_lists_id }`);
    return this._http.get<GetDocumentation>(`${ this._url }/api/getDocumentation/${ sell_your_car_id }`);
  }
  
}