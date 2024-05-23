import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetHyp } from '../interfaces/hyp.interface';

@Injectable({
  providedIn: 'root'
})
export class HypService {
  private url = 'https://bp.strega-gestion-leads.com/api/getHypOrders';

  constructor(
    private _http:HttpClient
  ) { }

  public getHyp():Observable<GetHyp> {
    return this._http.get<GetHyp>(this.url);
  }
}
