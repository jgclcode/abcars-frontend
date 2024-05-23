import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class SandboxService {
  private baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.baseUrl}`;
  }

  getAbcars(vin: string) {
    return this.http.get(`${this.baseUrl}/api/searchVehicleByVin/${vin}`);
  }
  postAbcars(data: any) {
    return this.http.post(`${this.baseUrl}/api/Ckeckvehicles`, data);
  }
  getVehiclesReviewed() {
    return this.http.get(`${this.baseUrl}/api/getVehiclesReviewed`);
  }
  getcheckByVehicleDetails(id: any) { 
    return this.http.get(`${this.baseUrl}/api/checkByVehicle/${id}`);
  }
  downloadFile(id: any) { 
    console.log(id)
    console.log(`${this.baseUrl}/api/ReportCheck/${id}`)
    return this.http.get(`${this.baseUrl}/api/ReportCheck/${id}`,{responseType: 'blob'});
  }
 
  postSetImages(data: any) { 
    return this.http.post(`${this.baseUrl}/api/addSetImage`,data);
  }
  GetImages() { 
    return this.http.get(`${this.baseUrl}/api/getSetvehicles`);
  }
  GetImagesAll(id: any) { 
    return this.http.get(`${this.baseUrl}/api/getsetImages/${id}`);
  }
}