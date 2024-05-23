import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Environments
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentPdfService {

  // Global url
  private url: string = environment.baseUrl;

  // Headers
  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('X-Requested-With', 'XMLHttpRequest');

  constructor(private _http: HttpClient) { }

  /**
   * Reference API Get document pdf & id del sell_your_cars
   */

  public getDocumentPdf(id: number): Observable<any>{
    return this._http.get<any>(`${ this.url }/api/getdocument_pdf/${id}`);
  }
  
}
