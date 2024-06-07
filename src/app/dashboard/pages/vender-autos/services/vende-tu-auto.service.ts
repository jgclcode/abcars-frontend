import { Injectable } from '@angular/core';

// Form
import { UntypedFormGroup } from '@angular/forms';

// HTTP Client
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Enviroment
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

// Interfaces
import { Brands } from '../interfaces/vende-tu-auto.interface';
import { UserData } from './../interfaces/user-data.interface';
import { ClientData } from './../interfaces/client-data.interface';
import { SellYourCarData } from './../interfaces/sell-your-car-data.interface';
import { UserEmailData } from './../interfaces/user-email-data.interface';
import { DataModels } from '../../comprar-autos/interfaces/compra-tu-auto/data_models.interface';
import { SetForeingReview } from '../interfaces/set-foreign-review.interface';
import { GetForeingReviewBySellYourCarID } from '../interfaces/get-foreign-review-by-sell-your-car-id.interface';
import { SetDamageImage } from '../interfaces/set-damage-image.interface';
import { GetDamageImage } from '../interfaces/get-damage-image.interface';
import { GetDamages } from '../interfaces/get-damages.interfaces';
import { GetAppraiserTechnicians } from '../interfaces/get-appraiser-technicians.interface';

@Injectable({
  providedIn: 'root'
})

export class VendeTuAutoService {

  // Global Url
  private url: string = '';

  // Headers
  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('X-Requested-With', 'XMLHttpRequest');        

  constructor(private _http: HttpClient) { 
    this.url = environment.baseUrl;
  }

  /**
   * Get Brands
   */  
  public brands(): Observable<Brands> {
    return this._http.get<Brands>(`${ this.url }/api/brands`);
  }

  /**
   * Get Appraiser technicians
   */  
   public getAppraiserTechnicians(): Observable<GetAppraiserTechnicians> {
    return this._http.get<GetAppraiserTechnicians>(`${ this.url }/api/getappraiser_technician`);
  }

  /**
   * Get models by Brand
   */
   public getModels(brand_id: number): Observable<DataModels> {
    return this._http.get<DataModels>(`${ this.url }/api/vehicle/carmodels/${ brand_id }`);
  }

  public setUser(
    name:string,
    surname:string,
    email:string
  ): Observable<UserData>{
    let body = {
      "name":name,
      "surname":surname,
      "email":email,      
      "password":false,
      "gender":"m",
      "gettoken":false
    }    

    // return this._http.post<UserData>(this.url+'/api/register', body, {headers: this.headers});
    return this._http.post<UserData>(this.url+'/api/register', body, { headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token'))) });
  }

  public setClient(
    phone:string,
    user_id:number
  ): Observable<ClientData>{
    let body = {
      "phone1":phone,
      "points":0,
      "user_id":user_id,      
      "source_id":1
    }    

    return this._http.post<ClientData>(this.url+'/api/clients', body, {headers: this.headers});
  }

  public setSell_your_car(
    version:string,
    km: number, 
    year: number,
    vin: string,
    date: string, 
    hour: string,
    brand_id:number,
    carmodel_id:number,
    subsidiary: string,
    client_id:number,
    valuadorID:number
  ): Observable<SellYourCarData>{
    let body = {
      "version":version,
      "km": km,
      "year": year,
      "vin": vin,
      "date": date,
      "hour": hour,
      "brand_id": brand_id,
      "carmodel_id": carmodel_id,
      "subsidiary": subsidiary,
      "client_id": client_id,
      "valuador_id": valuadorID
    }    
    return this._http.post<SellYourCarData>(this.url+'/api/sell_your_car', body, {headers: this.headers});
  }

  public getUserByEmail(email: string): Observable<UserEmailData> {
    return this._http.get<UserEmailData>(`${ this.url }/api/user/email/${ email }`, { headers: this.headers });
  }

  public setForeignReview( form: UntypedFormGroup ):Observable<SetForeingReview>{
    return this._http.post<SetForeingReview>(`${ this.url }/api/foreing_review`, form, { headers: this.headers });
  }

  public updateForeignReview( form: UntypedFormGroup, id:number ):Observable<SetForeingReview>{    
    return this._http.put<SetForeingReview>(`${ this.url }/api/foreing_review/${ id }`, form, { headers: this.headers });
  }

  public getForeingReviewBySellYourCarId( sell_your_car_id: number ):Observable<GetForeingReviewBySellYourCarID>{
    return this._http.get<GetForeingReviewBySellYourCarID>(`${ this.url }/api/foreing_reviews/getForeingReviewBySellYourCarId/${ sell_your_car_id }`);
  }

  public setDamage_image( sell_your_car_id:number, damage_id:number, fileToUpload: File ):Observable<SetDamageImage>{    
    const formData: FormData = new FormData();    
    formData.append('sell_your_car_id', `${sell_your_car_id}`);
    formData.append('damage_id', `${damage_id}`);
    formData.append('status', 'before');        
    formData.append('picture', fileToUpload); 
    return this._http.post<SetDamageImage>(`${this.url}/api/damage_image`, formData);
  }

  public getDamageImage( sell_your_car_id: number, damage_id: number):Observable<GetDamageImage>{
    return this._http.get<GetDamageImage>(`${ this.url }/api/getDamageImage/${ sell_your_car_id}/${ damage_id }`);
  }

  public updateDamageImage(damage_image_id: number, picture: File): Observable<SetDamageImage> {
    let formData: FormData = new FormData();
    formData.append('picture', picture);
    return this._http.post<SetDamageImage>(`${ this.url }/api/update_damage_image/${ damage_image_id}`, formData);
  }

  public getDamages( ids_excluidos:string = '' ):Observable<GetDamages>{
    let url = '';
    if( ids_excluidos.length > 0 ){
      url = `${ this.url }/api/getDamages/exterior/${ids_excluidos}`;
    }else{
      url = `${ this.url }/api/getDamages/exterior`;
    }    
    return this._http.get<GetDamages>( url );
  }

}
