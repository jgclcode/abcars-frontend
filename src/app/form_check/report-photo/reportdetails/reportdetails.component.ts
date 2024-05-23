import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SandboxService } from 'src/app/shared/sandbox.service';
import { checkByVehicle } from '../../shared/models/detail';

@Component({
  selector: 'app-reportdetails',
  templateUrl: './reportdetails.component.html',
  styleUrls: ['./reportdetails.component.css']
})
export class ReportdetailsComponent {
  data:any; 
  vin: any;

  constructor(private api: SandboxService,   private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe((params) => { 
      this.vin = params.id;
      this.getDetails(params.id);     
    });
  }
  
  getDetails(id: any) {
    this.api.GetImagesAll(id).subscribe((resp: any) => {
      console.log(resp);
      this.data = resp.images; 
   
    }, error => {
      console.log(error);
    });
  }
}