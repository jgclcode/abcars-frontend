import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; 

// Interfaces
import { SetJobData } from '../interfaces/careers/set_job_data.interface';

@Injectable({
  providedIn: 'root'
})

export class CareerService {
  
  private baseUrl: string = environment.baseUrl;  
  private headers = new HttpHeaders().set('X-Requested-With', 'XMLHttpRequest');        

  constructor(private _http:HttpClient) { }

  public setJob(
    name:string,
    surname:string,
    email:string,
    phone:number,
    date_of_birth:any,
    fileToUpload: File
  ): Observable<SetJobData> {
    console.log( date_of_birth );
    const formData: FormData = new FormData();
    formData.append('name', name); 
    formData.append('surname', surname);
    formData.append('email', email); 
    formData.append('phone', `${phone}`); 
    formData.append('date_of_birth', date_of_birth); 
    formData.append('file', fileToUpload); 
    console.log( date_of_birth );  
    
    return this._http.post<SetJobData>(`${this.baseUrl}/api/jobs`, formData, { headers: this.headers });
  }

}
