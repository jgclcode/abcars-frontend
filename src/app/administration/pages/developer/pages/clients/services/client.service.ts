import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UntypedFormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';

// Interfaces
import { ClientData } from '../interfaces/client-data.interface';
import { ClientByIDData } from '../interfaces/client-by-id-data.interface';
import { SourceData } from '../interfaces/source-data.interface';
import { UsersWithoutClientData } from '../interfaces/users-without-client-data.interface';
import { ClientUpdate } from '../interfaces/client-update.interface';
import { ClientCreate } from '../interfaces/client-create.interface';
import { ClientDelete } from '../interfaces/client-delete.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private baseUrl:string = environment.baseUrl;
  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('X-Requested-With', 'XMLHttpRequest');        

  constructor(
    private _http: HttpClient
  ) { }

  public getClients( total:number ):Observable<ClientData>{
    return this._http.get<ClientData>(`${ this.baseUrl }/api/client/${ total }`);
  }

  public getClientById( client_id:number ): Observable<ClientByIDData>{
    return this._http.get<ClientByIDData>(`${ this.baseUrl }/api/getClientById/${ client_id }`);
  }

  public getSources():Observable<SourceData>{
    return this._http.get<SourceData>(`${ this.baseUrl }/api/sources/getAll`);
  }

  public getUsersWithoutClient( client_id: number | null ):Observable<UsersWithoutClientData>{
    let url = '/api/getUsersWithoutClient';
    if( client_id != null ){
      url = `/api/getUsersWithoutClient/${client_id}`;
    }
    return this._http.get<UsersWithoutClientData>(`${ this.baseUrl }${ url }`);
  }

  public createClient( client: UntypedFormGroup ):Observable<ClientCreate>{
    return this._http.post<ClientCreate>(`${ this.baseUrl }/api/clients`, client, {
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token')))
    });
  }

  public updateClient( client: UntypedFormGroup, id: number ):Observable<ClientUpdate>{
    return this._http.put<ClientUpdate>(`${ this.baseUrl }/api/clients/${ id }`, client, { 
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token'))) 
    });
  }

  public deleteClient( id: number ):Observable<ClientDelete>{
    return this._http.delete<ClientDelete>(`${ this.baseUrl }/api/clients/${ id }`, { 
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token'))) 
    });
  }
}
