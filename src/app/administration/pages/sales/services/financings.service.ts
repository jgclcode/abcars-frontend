import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

// Enviroment
import { environment } from 'src/environments/environment';

// Interfaces
import { FilesPreview, Financings } from '../interfaces/financings.interface';
import { SearchFinancing } from '../interfaces/search_financing';

@Injectable({
  providedIn: 'root'
})

export class FinancingsService {

  // References
  private _url: string = environment.baseUrl;
  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('X-Requested-With', 'XMLHttpRequest');        

  constructor(private _http: HttpClient) { }

  /**
   * Get Financings
   */
  public getFinancings(page: number = 1): Observable<Financings> {
    return this._http.get<Financings>(`${ this._url }/api/financing?page=${ page }`);
  }

  /**
   * Update Financing
   * @param financing_id Number
   * @param form FormGroup
   * @returns UpdateFinancing
   */
  public updateFinancing(financing_id: number, form: UntypedFormGroup): Observable<Financings> {
    return this._http.put<Financings>(`${ this._url }/api/financing/${ financing_id }`, form, { 
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token'))) 
    });
  }

  public getFilesFinancing(financing_id: number, type: Object): Observable<FilesPreview> {
    return this._http.post<FilesPreview>(`${ this._url }/api/financing/files/preview/${ financing_id }`, type, {
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token'))) 
    });
  }

  public buscarSolicitudes(query: string, cantidad:number, page: number = 1 ): Observable<SearchFinancing>{
    return this._http.get<SearchFinancing>(`${ this._url }/api/search_financing/${query}/${cantidad}?page=${ page }`);
  }
}
