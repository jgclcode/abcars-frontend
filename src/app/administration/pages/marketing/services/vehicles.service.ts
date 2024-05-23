import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Environments
import { environment } from 'src/environments/environment';

// Interfaces
import { DataBuscador } from 'src/app/dashboard/pages/comprar-autos/interfaces/compra-tu-auto/data_buscador.interface';
import { LoadImageData } from './../interfaces/load-image-data.interface';
import { DeleteImagesToExternalWebSite } from '../interfaces/delete-images-to-external-website.interface';
import { ImageOrder } from '../../../../dashboard/pages/comprar-autos/interfaces/detail/vehicle_data.interface';
import { ChangeOrder } from '../interfaces/change-order.interface';

export interface Delete360Images {
  status:  string;
  code:    string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})

export class VehiclesService {

  private url: string = environment.baseUrl;

  // Headers
  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('X-Requested-With', 'XMLHttpRequest');        

  constructor(private _http:HttpClient) { }

  /**
   * Get vehicles
   */
  public getVehicles(cuantity: number): Observable<DataBuscador>{
    return this._http.get<DataBuscador>(`${ this.url }/api/vehiclesSearch/${ cuantity }`);
  }

  public setImage(
    vehicle_id:number,
    fileToUpload: File
  ): Observable<LoadImageData>{
    const formData: FormData = new FormData();
    formData.append('picture', fileToUpload); 
    formData.append('vehicle_id', `${vehicle_id}`);  
    let headers = new HttpHeaders().set('Authorization', JSON.stringify(localStorage.getItem('user_token'))).set('X-Requested-With', 'XMLHttpRequest');        
    return this._http.post<LoadImageData>(this.url+'/api/vehicle_image', formData, {headers: headers });
  }

  public set360Image(
    vehicle_id:number,
    fileToUpload: File
  ): Observable<LoadImageData>{
    const formData: FormData = new FormData();
    formData.append('picture', fileToUpload); 
    formData.append('vehicle_id', `${vehicle_id}`);  
    let headers = new HttpHeaders().set('Authorization', JSON.stringify(localStorage.getItem('user_token'))).set('X-Requested-With', 'XMLHttpRequest');        
    return this._http.post<LoadImageData>(this.url+'/api/vehicle_360_image', formData, {headers: headers });
  }

  public deleteImagesToExternalWebSite(vehicle_id:number, external_website:string): Observable<DeleteImagesToExternalWebSite>{
    const formData: FormData = new FormData();
    formData.append('external_website', external_website); 
    formData.append('vehicle_id', `${vehicle_id}`); 
    let headers = new HttpHeaders().set('Authorization', JSON.stringify(localStorage.getItem('user_token'))).set('X-Requested-With', 'XMLHttpRequest');        
    return this._http.post<DeleteImagesToExternalWebSite>(`${this.url}/api/deleteImagesToExternalWebSite`, formData, {headers: headers });
  }

  public delete360Images(vehicle_id:number ): Observable<Delete360Images>{
    const formData: FormData = new FormData();   
    formData.append('vehicle_id', `${vehicle_id}`); 
    let headers = new HttpHeaders().set('Authorization', JSON.stringify(localStorage.getItem('user_token'))).set('X-Requested-With', 'XMLHttpRequest');        
    return this._http.post<Delete360Images>(`${this.url}/api/delete360Images`, formData, {headers: headers });
  }

  

  public changeOrder(vehicle_id:number, imagesData: ImageOrder[]):Observable<ChangeOrder>{
    const body = {
      vehicle_id: `${vehicle_id}`,
      new_order: imagesData
    }    
    let headers = new HttpHeaders().set('Authorization', JSON.stringify(localStorage.getItem('user_token'))).set('X-Requested-With', 'XMLHttpRequest');        
    return this._http.post<ChangeOrder>(`${this.url}/api/changeOrder`, body, {headers: headers });
  }
}
