import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';

// Interfaces
import { BrandData } from '../interfaces/brand-data.interface';
import { BrandByID } from '../interfaces/brand-by-id.interface';
import { BrandCreate } from '../interfaces/brand-create.interface';
import { BrandUpdate } from '../interfaces/brand-update.interface';
import { BrandDelete } from '../interfaces/brand-delete.interface';
import { SearchBrand } from '../interfaces/search_brand.interface';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private baseUrl:string = environment.baseUrl;
  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('X-Requested-With', 'XMLHttpRequest');        

  constructor(
    private _http:HttpClient
  ) { }

  public getBrands(page: number = 1):Observable<BrandData>{
    return this._http.get<BrandData>(`${ this.baseUrl }/api/brand?page=${ page }`);
  }

  public getBrandById( brand_id: number ):Observable<BrandByID>{
    return this._http.get<BrandByID>(`${ this.baseUrl }/api/getBrandById/${ brand_id }`, { headers: this.headers });
  }

  public setBrand( name:string, description:string, location:string, contact:string, fileToUpload: File ):Observable<BrandCreate>{
    const formData: FormData = new FormData();    
    formData.append('name', name);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('contact', contact);    
    formData.append('picture', fileToUpload);       
    return this._http.post<BrandCreate>(`${ this.baseUrl }/api/brand`, formData);
  }

  public updateBrand( id:number, name:string, description:string, location:string, contact:string, fileToUpload: File ): Observable<BrandUpdate>{
    const formData: FormData = new FormData();    
    formData.append('name', name);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('contact', contact);    
    formData.append('picture', fileToUpload);    
    return this._http.post<BrandUpdate>(`${ this.baseUrl }/api/brands/update/${ id }`, formData );
  }

  public deleteBrand( brand_id: number ): Observable<BrandDelete>{
    return this._http.delete<BrandDelete>(`${ this.baseUrl }/api/brand/${ brand_id }`, {
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token')))
    });
  }

  public searchBrands(query: string, amount:number, page: number = 1 ): Observable<SearchBrand>{
    return this._http.get<SearchBrand>(`${ this.baseUrl}/api/search_brand/${query}/${amount}?page=${ page }`);
  }
}
