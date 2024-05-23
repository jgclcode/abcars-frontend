import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SandboxService } from 'src/app/shared/sandbox.service';

@Component({
  selector: 'app-report-photo',
  templateUrl: './report-photo.component.html',
  styleUrls: ['./report-photo.component.css']
})
export class ReportPhotoComponent {
  data: any[] = [];
  searchKey!: string;
  displayedColumns: string[] = ["id", "name", "vin", "detail","download"];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private api: SandboxService, private ruta: Router) {
    this.getAllVehiclesReviewed();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAllVehiclesReviewed() {
    // this.api.getVehiclesReviewed().subscribe((data: any) => {
    //   this.data = data.vehicle;
    //   this.dataSource = new MatTableDataSource(this.data);
    //   this.dataSource.paginator = this.paginator;
    // });
    this.api.GetImages().subscribe((res: any) => {
      console.log(res);
      this.data = res.quote.data;
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
    console.log(  this.dataSource.filter);
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  limpiar(){
      this.searchKey = "";
      this.getAllVehiclesReviewed();
  }
}