import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

// Environment
import { environment } from 'src/environments/environment';

// Interfaces
import { PostPaintingWorks, ImgDamagePaintingWorks } from '../interfaces/painting_works.interface';

@Injectable({
  providedIn: 'root'
})
export class PaintingWorksService {

  // References
  private _url: string = environment.baseUrl;

  constructor(private _http: HttpClient) { }

  /**
   * Post new painting works
   * 
   */
  public postPaintingWorks(name: string, amount: number, picture: File, sell_your_car_id: number ): Observable<PostPaintingWorks> { /* fileToUpload:File */
  // console.log('Dentro del servicio postPaintingWorks ',picture);
  
    const formData: FormData = new FormData();
    formData.append('sell_your_car_id', `${sell_your_car_id}`);
    formData.append('name', `${name}`);
    formData.append('amount', `${amount}`);
    formData.append('status', 'on hold');
    formData.append('picture', picture);
    return this._http.post<PostPaintingWorks>(`${ this._url }/api/painting_works`, formData);
  }

  public getPaintingWorks(sell_your_car_id: number): Observable<ImgDamagePaintingWorks> {
    return this._http.get<ImgDamagePaintingWorks>(`${ this._url }/api/getPainting_worksBySellYourCar/${sell_your_car_id}`);
  }
}
