import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

// Interface
import { VehicleData } from '../interfaces/vehicle-data.interface';
import { RequestUnitByVinIntelimotors } from '../interfaces/request-unit-by-vin-intelimotors.interface';
import { VehicleByVinData , UpdateVehicle, requestBodyVehicle} from '../interfaces/vehicle-by-vin-data.interface';
import { UpdatePromotion } from '../interfaces/update-promotion.interface';
import { GetShields } from '../interfaces/get-shields.interface';
import { GetChecked } from '../interfaces/get-checked.interface';
import { AssignShield } from '../interfaces/assign-shield.interface';
import { AddPromotions } from '../interfaces/add-promotions.interface';
import { ApartarYDesapartarData } from '../interfaces/apartar-y-desapartar.interface';
import { VehicleSold } from '../interfaces/vehicle-sold.interface';
import { ChangeOrder, ShieldOrderImages } from '../interfaces/shield-images-order.interface';
import { PublishVehicleMl } from '../interfaces/publish-vehicle-ml.interface';


@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  baseUrl = environment.baseUrl;

  constructor(
    private _http: HttpClient
  ) { }

  public getVehicles( word:string | null = null, page:number = 1 ):Observable<VehicleData>{
    if( word == null ){      
      return this._http.get<VehicleData>(`${ this.baseUrl }/api/getActiveVehicles?page=${page}`);
    }
    return this._http.get<VehicleData>(`${ this.baseUrl }/api/getActiveVehicles/${word}?page=${page}`);
  }

  public getVehiclesLocation( word:string | null = null, page:number = 1 ):Observable<VehicleData>{
    if( word == null ){      
      return this._http.get<VehicleData>(`${ this.baseUrl }/api/getActiveVehiclesLocation?page=${page}`);
    }
    return this._http.get<VehicleData>(`${ this.baseUrl }/api/getActiveVehiclesLocation/${word}?page=${page}`);
  }

  public requestUnitByVin( vin:string ):Observable<RequestUnitByVinIntelimotors>{
    return this._http.get<RequestUnitByVinIntelimotors>(`${ this.baseUrl }/api/requestUnitByVin/${ vin }`);
  }

  public getVehicleByVin( vin:string ):Observable<VehicleByVinData>{
    return this._http.get<VehicleByVinData>(`${ this.baseUrl }/api/vehicleByVin/${ vin }`);
  }

  public updateVehicle( body: requestBodyVehicle, id:number):Observable<UpdateVehicle>{
    let headers = new HttpHeaders().set('Authorization', JSON.stringify(localStorage.getItem('user_token'))).set('X-Requested-With', 'XMLHttpRequest');
    return this._http.put<UpdateVehicle>(`${ this.baseUrl }/api/vehicle/${ id }`, body, {headers: headers });
  }

  public updatePromotion( vin:string, promotion:string ):Observable<UpdatePromotion>{
    let body = {
      vin: vin,
      promotion: promotion
    }

    let headers = new HttpHeaders().set('Authorization', JSON.stringify(localStorage.getItem('user_token'))).set('X-Requested-With', 'XMLHttpRequest');        
    return this._http.put<UpdatePromotion>(`${ this.baseUrl }/api/updatePromotion`, body, {headers: headers });
  }

  public getShields( total:number ):Observable<GetShields>{
    return this._http.get<GetShields>(`${ this.baseUrl }/api/shields/${ total }`);
  }

  public getChecked(vehicle_id:number, shield_id:number): Observable<GetChecked>{
    return this._http.get<GetChecked>(`${ this.baseUrl }/api/existsShieldIntoVehicle/${ vehicle_id }/${ shield_id }`);
  }

  public assignShield(vehicle_id:number, shield_id:number):Observable<AssignShield>{
    let body = {}
    return this._http.post<AssignShield>(`${ this.baseUrl }/api/assignShield/${ vehicle_id }/${ shield_id }`, body);
  }

  public removeShield(vehicle_id:number, shield_id:number):Observable<AssignShield>{
    let body = {}
    return this._http.post<AssignShield>(`${ this.baseUrl }/api/removeShield/${ vehicle_id }/${ shield_id }`, body);
  }

  public addPromotions( fileToUpload: File ):Observable<AddPromotions>{
    const formData: FormData = new FormData();               
    formData.append('file', fileToUpload); 
    return this._http.post<AddPromotions>(`${ this.baseUrl }/api/addPromotions/vehicles`, formData);
  }

  public apartar_y_desapartar( vin:string ): Observable<ApartarYDesapartarData>{
    return this._http.get<ApartarYDesapartarData>(`${ this.baseUrl }/api/apartar_y_desapartar/${ vin }`);
  }

  public vehicleSold( vin: string ): Observable<VehicleSold>{
    return this._http.get<VehicleSold>(`${ this.baseUrl }/api/vehicleSold/${ vin }`);
  }

  public changeOrderShieldImages(id_vehicle: number, shieldImages: ShieldOrderImages[]): Observable<ChangeOrder>{
    const body = {
      id_vehicle: `${id_vehicle}`,
      new_order: shieldImages
    };
    let headers = new HttpHeaders().set('Authorization', JSON.stringify(localStorage.getItem('user_token'))).set('X-Requested-With', 'XMLHttpRequest');
    return this._http.post<ChangeOrder>(`${this.baseUrl}/api/changeOrderShieldImages`, body, {headers: headers});
  }

  public publishMl(vehicle_id: number): Observable<PublishVehicleMl>{
    const body = {
      vehicle_id: `${vehicle_id}`      
    };
    let headers = new HttpHeaders().set('Authorization', JSON.stringify(localStorage.getItem('user_token'))).set('X-Requested-With', 'XMLHttpRequest');
    return this._http.post<PublishVehicleMl>(`${this.baseUrl}/api/ml_post_vehicle`, body, {headers: headers});
  }

  public publicFb(vehicle_id :number){
    const body = {
      vehicle_id: `${vehicle_id}`      
    };
    return this._http.post<PublishVehicleMl>(`${this.baseUrl}/api/publish`, body);
  }
  public unpublishFb(vehicle_id :number){
    const body = {
      vehicle_id: `${vehicle_id}`      
    };
    return this._http.post<PublishVehicleMl>(`${this.baseUrl}/api/deletePublish`, body);
  }
}
