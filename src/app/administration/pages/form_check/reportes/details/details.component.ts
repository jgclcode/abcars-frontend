import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { SandboxService } from "src/app/shared/sandbox.service";
import { ActivatedRoute } from "@angular/router";
import { checkByVehicle } from "../../shared/models/detail";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.css"],
})
export class DetailsComponent {
  public baseUrl: string = environment.baseUrl;
  data!: checkByVehicle; 

  isBodyWork :any[]=[]
  isMotor:any[]=[]
  isElectric:any[]=[]
  isInterior:any[]=[]
  isTransmission:any[]=[]
  displayedColumns: string[] = ["comentario","path"];
  
  dataBodywork : any[]=[];
  dataElectric : any[]=[];
  dataInterior : any[]=[];
  dataMotor : any[]=[];
  dataTransmission : any[]=[];

  constructor(private api: SandboxService,   private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe((params) => { 
      this.getDetails(params.id);     
    });
  }
  
  getDetails(id: any) {
    this.api.getcheckByVehicleDetails(id).subscribe((resp: any) => {
      this.data = resp.vehicle[0]; 
      this.dataBodywork = resp.data.bodywork;
      this.dataElectric = resp.data.electric;
      this.dataInterior = resp.data.interior;
      this.dataMotor = resp.data.motor;
      this.dataTransmission = resp.data.transmission;
      this.isMotor = resp.data.motor;
      this.isBodyWork = resp.data.bodywork;
      this.isElectric = resp.data.electric;
      this.isInterior = resp.data.interior;
      this.isTransmission = resp.data.transmission;
    }, error => {
      console.log(error);
    });
  }
  
}