import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

// Environments
import { environment } from 'src/environments/environment';

// Interfaces
import { SellCarValuation } from '../interfaces/sell-car-valuation.interface';
import { ValuatorChecklist } from '../interfaces/valuator.checklist.interface';
import { ChecklistValuation } from '../interfaces/checklist-valuation.interface';
import { Technician } from '../interfaces/technician.interface';
import { MechanicElectric } from '../../../interfaces/mechanic-electric.interface';
import { MechanicalElectric } from 'src/app/administration/interfaces/mechanical-electric.interface';
import { IntReview } from '../interfaces/int-review.interface';
import { InteriorReview } from '../interfaces/interior-review.interface';
import { CertificationVeh } from '../interfaces/certification-veh.interface';
import { CertificationVehicle } from '../interfaces/certification-vehicle.interface';
import { UpdateStatusAll } from '../interfaces/update-status-all.interface';
import { GetChecklistForms } from '../../valuator/interfaces/get-checklist-forms.interface';
import { OwnedPreowned } from '../../valuator/interfaces/owned_preowned.interface';

@Injectable({
  providedIn: 'root'
})

export class AppraiserChecklistService {

  // Global Url
  private url: string = environment.baseUrl;

  // Headers
  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('X-Requested-With', 'XMLHttpRequest');

  constructor(private _http: HttpClient) { }

  /**
   * Reference API Get sell cars, clients, users & vin id
   */
  public getAppraiserChecklist(id: string): Observable<SellCarValuation>{  /* El parámetro era vin del tipo string */
    return this._http.get<SellCarValuation>(`${ this.url }/api/sell-car-valuation/${id}`); /* Se enviaba el vin */
  }

  /**
   * Reference API Post checklist
   */
  public setAppraiserChecklist(valuation: UntypedFormGroup): Observable<ValuatorChecklist>{
    return this._http.post<ValuatorChecklist>(`${ this.url }/api/checklist/`, valuation, {
      headers: this.headers
    });
  }

  public setMechanicElectronic(valuation: UntypedFormGroup): Observable<MechanicElectric>{
    return this._http.post<MechanicElectric>(`${ this.url }/api/mechanicalelectronic/`, valuation, {
      headers: this.headers
    });
  }

  public setIntReview(valuation: UntypedFormGroup): Observable<IntReview>{
    return this._http.post<IntReview>(`${ this.url }/api/interior_reviews/`, valuation, {
      headers: this.headers
    });
  }

  public setVehCertification(valuation: UntypedFormGroup): Observable<CertificationVeh>{
    return this._http.post<CertificationVeh>(`${ this.url }/api/certification/`, valuation, {
      headers: this.headers
    });
  }
  
  public getChecklistValuation(id: string): Observable<ChecklistValuation>{ /* Era vin: string */
    return this._http.get<ChecklistValuation>(`${ this.url }/api/getchecklist/${id}`);  /* Era ${vin} */
  }

  public getChecklistForms(id: string): Observable<GetChecklistForms>{
    return this._http.get<GetChecklistForms>(`${ this.url }/api/getcheckFront/${id}`);
  }
  
  public getChecklistValuationall(id: string): Observable<any>{ /* Era vin: string */
    return this._http.get<any>(`${ this.url }/api/getchecklistall/${id}`);  /* Era ${vin} */
  }

  public getMechanicElectronic(id: string): Observable<MechanicalElectric>{
    return this._http.get<MechanicalElectric>(`${ this.url }/api/getmechanic_electronic/${id}`)
  }

  public getInteriorReview(id:string): Observable<InteriorReview>{
    return this._http.get<InteriorReview>(`${ this.url }/api/getinterior_review/${id}`)
  }

  public getVehCertification(id:string): Observable<CertificationVehicle>{
    return this._http.get<CertificationVehicle>(`${ this.url }/api/getcert_vehicle/${id}`)
  }

  public getTechnician(user_id: number): Observable<Technician>{
    return this._http.get<Technician>(`${ this.url }/api/technicians/${user_id}`);
  }


  /**
   * Reference API Get checklist
   */

  public getChecklistAppraiser(): Observable<ValuatorChecklist>{
    return this._http.get<ValuatorChecklist>(`${ this.url }/api/checklist`);
  }

  public getMechanicalElectronic(): Observable<MechanicElectric>{
    return this._http.get<MechanicElectric>(`${ this.url }/api/mechanicalelectronic`)
  }

  public getIntReview(): Observable<IntReview>{
    return this._http.get<IntReview>(`${ this.url }/api/interior_reviews`)
  }

  public getCertVehicle(): Observable<CertificationVeh>{
    return this._http.get<CertificationVeh>(`${ this.url }/api/certification`)
  }

  public ownedPreowned(): Observable<OwnedPreowned> {
    return this._http.get<OwnedPreowned>('https://bp.strega-gestion-leads.com/api/getVehicles')
  }

  /**
   * Reference API Update checklist
   */
   public updateAppraiserChecklist(id: number, valuation: UntypedFormGroup): Observable<ValuatorChecklist>{    
    return this._http.put<ValuatorChecklist>(`${ this.url }/api/checklist/${ id }`, valuation, { 
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token'))) 
    });
  }

  public updateStatusForms(id: number, valuation: UntypedFormGroup): Observable<UpdateStatusAll>{
    return this._http.put<UpdateStatusAll>(`${ this.url }/api/updatestatusforms/${ id }`, valuation, {
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token')))
    })
  }

  public updateMechanicElectric(id:number, valuation: UntypedFormGroup): Observable<MechanicElectric>{
    return this._http.put<MechanicElectric>(`${ this.url }/api/mechanicalelectronic/${ id }`, valuation, {
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token')))
    });
  }

  public updateIntReview(id: number, valuation: UntypedFormGroup): Observable<IntReview>{
    return this._http.put<IntReview>(`${ this.url }/api/interior_reviews/${ id }`, valuation, {
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token')))
    });
  }

  public updateVehicleCertification(id: number, valuation: UntypedFormGroup): Observable<CertificationVeh>{
    return this._http.put<CertificationVeh>(`${ this.url }/api/certification/${ id }`, valuation, {
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token')))
    });
  }

  /**
   * Reference API Update km
   */
  public updateAppraiserKm(id:number, status: Object): Observable<SellCarValuation>{
    return this._http.put<SellCarValuation>(`${ this.url }/api/sell_your_car/${ id }`, status, {      
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token'))) 
    });
  }
}
