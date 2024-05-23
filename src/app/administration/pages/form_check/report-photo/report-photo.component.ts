import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SandboxService } from 'src/app/shared/sandbox.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-report-photo',
  templateUrl: './report-photo.component.html',
  styleUrls: ['./report-photo.component.css']
})
export class ReportPhotoComponent {
  public baseUrl: string = environment.baseUrl;
  data: any[] = [];
  searchKey!: string;
  displayedColumns: string[] = ["vin", "detail","download"];
  dataSource = new MatTableDataSource();
  totalRecords: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private api: SandboxService, private ruta: Router) {
    this.getAllVehiclesReviewed();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAllVehiclesReviewed() {  
    this.api.GetImages().subscribe((res: any) => {
      console.log(res);
      this.data=res.quote; 
     // this.totalRecords=res.quote.total;
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
  changePage(event: any){
    console.log(event);
    // if(event.pageIndex == 0){
    //   this.data = [];
    // }else{
    //   event.pageIndex = event.pageIndex + 1; 
    // }
    event.pageIndex = event.pageIndex + 1; 
    this.api.GetImages().subscribe((res: any) => {
      console.log(res);
      this.data = [];
      for (let i = 0; i < res.quote.data.length; i++) {
        this.data.push(res.quote.data[i]);
      }
      this.totalRecords=res.quote.total;
      this.dataSource = new MatTableDataSource(this.data); 
      //this.dataSource.paginator = this.paginator;
    });
  }
}