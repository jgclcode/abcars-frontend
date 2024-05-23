import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

// Interfaces
import { BranchData } from '../interfaces/branch-data.interface';
import { BranchByID, DeleteBranch, UpdateBranch } from '../interfaces/branch-by-id.interface';
import { StatesData } from '../interfaces/states-data.interface';
import { UntypedFormGroup } from '@angular/forms';
import { BranchCreate } from '../interfaces/branch-create.interface';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  
  // References
  private baseUrl:string = environment.baseUrl;
  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('X-Requested-With', 'XMLHttpRequest');          
  
  constructor(private _http:HttpClient) { }

  public getStates():Observable<StatesData>{
    return this._http.get<StatesData>(`${ this.baseUrl }/api/states`, {
      headers: this.headers
    });
  }

  public getBranches( word?:string, page: number = 1 ):Observable<BranchData> {
    let url = `${ this.baseUrl }/api/getBranches?page=${ page }`;
    if( word != undefined && word?.length > 0 ){
      url = `${ this.baseUrl }/api/getBranches/${ word }?page=${ page }`;
    }
    return this._http.get<BranchData>(url , {
      headers: this.headers
    });
  }

  public getBranchById( branch_id: number ):Observable<BranchByID>{
    return this._http.get<BranchByID>(`${ this.baseUrl }/api/getBranchById/${ branch_id }`, {
      headers: this.headers
    });
  }

  /**
   * Create Branch
   * @param branch FormGroup
   * @returns BranchCreate
   */
  public setBranch(branch: UntypedFormGroup): Observable<BranchCreate> {        
    return this._http.post<BranchCreate>(`${ this.baseUrl }/api/branch`, branch, {      
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token')))
    });
  }

  /**
   * Update Branch
   */
  public updateBranch(branch_id: number, form: UntypedFormGroup): Observable<UpdateBranch> {
    return this._http.put<UpdateBranch>(`${ this.baseUrl }/api/branch/${ branch_id }`, form, {
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token')))
    });
  }

  /**
   * Delete Branch 
   */
  public deleteBranch(branch_id: number): Observable<DeleteBranch> {
    return this._http.delete<DeleteBranch>(`${ this.baseUrl }/api/branch/${ branch_id }`, {
      headers: this.headers.set('Authorization', JSON.stringify(localStorage.getItem('user_token')))
    });
  }
}
