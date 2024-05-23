import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { SandboxService } from "src/app/shared/sandbox.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-reportes",
  templateUrl: "./reportes.component.html",
  styleUrls: ["./reportes.component.css"],
})
export class ReportesComponent implements AfterViewInit {
  public baseUrl: string = environment.baseUrl;
  data: any[] = [];
  searchKey!: string;
  displayedColumns: string[] = ["vin", "details", "download"];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private api: SandboxService, private ruta: Router) {
    this.getAllVehiclesReviewed();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAllVehiclesReviewed() {
    this.api.getVehiclesReviewed().subscribe((data: any) => {
      this.data = data.vehicle;
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
    });
  }
  onDetails(id: any) {
    this.ruta.navigate(["/"+ id , ":/details"]);
  }
  onDownload(id: any) {
      this.api.downloadFile(id).subscribe((data: any) => {
        console.log(data);
      });
  }
  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  limpiar(){
      this.searchKey = "";
      this.getAllVehiclesReviewed();
  }
}
