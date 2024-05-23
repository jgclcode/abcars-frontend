import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

// Enviroment
import { environment } from 'src/environments/environment';

// Interfaces
import { CarmodelDelete, CarmodelCreate, ModelsInterface, GetCarmodel, CarmodelUpdate } from '../interfaces/models.interface';
import { SearchModel } from '../interfaces/search_model.interface';
import { GetAllBrands } from '../pages/brands/interfaces/brand-by-id.interface';

@Injectable({
  providedIn: 'root'
})

export class ModelsService {

  // Global Url
  private url: string = environment.baseUrl;
  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('X-Requested-With', 'XMLHttpRequest');

  constructor(private _http: HttpClient) { }

  /**
   * Create carmodel
   */
  public createCarmodel(form: UntypedFormGroup): Observable<CarmodelCreate> {
    return this._http.post<CarmodelCreate>(`${ this.url }/api/carmodel`, form, {
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token')))
    });
  }

  /**
   * Get carmodels
   */
  public getCarmodels(page: number = 1): Observable<ModelsInterface> {
    return this._http.get<ModelsInterface>(`${ this.url }/api/carmodel?page=${ page }`);
  }

  /**
   * Get carmodel
   */
  public getCarmodel(carmodel_id: number): Observable<GetCarmodel> {
    return this._http.get<GetCarmodel>(`${ this.url }/api/carmodelByID/${ carmodel_id }`);
  }

  /**
   * Update carmodel
   */
  public updateCarmodel(carmodel_id: number, form: UntypedFormGroup): Observable<CarmodelUpdate> {
    return this._http.put<CarmodelUpdate>(`${ this.url }/api/carmodel/${ carmodel_id }`, form, {
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token')))
    });
  }

  /**
   * Delete carmodel
   */
  public deleteModel(carmodel_id: number): Observable<CarmodelDelete> {
    return this._http.delete<CarmodelDelete>(`${ this.url }/api/carmodel/${ carmodel_id }`, { 
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token')))
    });
  }

  /**
   * Get all Brands
   */
  public getAllBrands(): Observable<GetAllBrands> {
    return this._http.get<GetAllBrands>(`${ this.url }/api/brands`);
  }
  
  public searchModels(query: string, amount: number, page: number = 1 ): Observable<SearchModel>{
    return this._http.get<SearchModel>(`${ this.url}/api/search_model/${query}/${amount}?page=${ page }`);
  }
}