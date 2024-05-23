import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator as MatPaginator, PageEvent as PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource as MatTableDataSource } from '@angular/material/table';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import Swal from "sweetalert2";
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar as MatSnackBar } from '@angular/material/snack-bar';

import { environment } from 'src/environments/environment';

// Services
import { VehiclesListService } from '../../services/vehicles-list.service';

// Interfaces
import { VehicleData, Vehicle } from '../../interfaces/vehicle-data.interface';

@Component({
  selector: 'app-vehicleslist',
  templateUrl: './vehicles-list.component.html',
  styles: [`
      .material-icons{
        font-size: 24px
      }
  `
  ]
})
export class VehicleListComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'name', 'vin', 'location', 'promotion','actions'];
  public dataSource!: MatTableDataSource<Vehicle>;
  public pageVehicle: string = '';

  // MatPaginator 
  public length: number = 0;
  public pageIndex: number = 1;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  vehicles: Vehicle[] = [];
  public word:string | null = null;
  public spinner:boolean = false;

  baseUrl:string = environment.baseUrl;

  public locationOrigin = window.location.origin;
  public user = JSON.parse(localStorage.getItem('user')!)

  constructor(
    private _vehiclesListService:VehiclesListService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.scrollTop();
    this.getVehicles();
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.word = filterValue;
    this.pageIndex = 1;
    this.getVehicles();
    this.scrollTop();
  }

  public getVehicles(page:number = 1){
    this._vehiclesListService.getVehiclesLocation(this.word, page)
    .subscribe({
      next: ( vd: VehicleData ) => {
        this.vehicles = vd.vehicles.data;
        this.dataSource = new MatTableDataSource(this.vehicles);
        // Assign the length data
        this.paginator.length = vd.vehicles.total;
      }
    });
  }

  public updateWithIntelimotors( vin:string ){
    this.spinner = true;
    this._vehiclesListService.requestUnitByVin(vin)
    .subscribe({
      next: (resp) => {
        if( resp.message.length > 0 ){
          Swal.fire({
            icon: 'success',
            text: resp.message,
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          }).then( () => {
            this.vehicles = [];
            this.getVehicles( this.pageIndex );
          });
        }else {
          Swal.fire('Ocurrio un problema', '', 'error')
            .then( () => {
              this.vehicles = [];
              this.getVehicles( this.pageIndex );
          });
        }
        this.spinner = false;
      }
    });
  }

  public paginationChange(event: PageEvent) {
    this.pageIndex = event.pageIndex + 1;
    this.getVehicles(event.pageIndex + 1);
    this.scrollTop();
  }

  public apartar_y_desapartar( vin:string ):void {
    this._vehiclesListService.apartar_y_desapartar( vin )
    .subscribe({
      next: (resp) => {
        if( resp.status == 'success'){
          Swal.fire({
            icon: 'success',
            text: resp.message,
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          }).then( () => {
            this.vehicles = [];
            this.getVehicles( this.pageIndex );
          });
        }else{
          Swal.fire('Ocurrio un problema', '', 'error')
            .then( () => {
              this.vehicles = [];
              this.getVehicles( this.pageIndex );
          });
        }
      }
    })
  }

  public vehicleSold( vin:string ):void{
    this._vehiclesListService.vehicleSold( vin )
    .subscribe({
      next: (resp) => {
        if( resp.status == 'success'){
          Swal.fire({
            icon: 'success',
            text: "Vehículo vendido correctamente",
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          }).then( () => {
            this.vehicles = [];
            this.getVehicles( this.pageIndex );
          });
        }else{
          Swal.fire('Ocurrio un problema', '', 'error')
            .then( () => {
              this.vehicles = [];
              this.getVehicles( this.pageIndex );
          });
        }
      }
    });
  }

  /**
   * Button for Copy url active to shared button
   */
  
  public openSnackBarCopy(name : string) {  
    
    // Lauch Snackbar
    this._snackBar.open('Copiado: '+name, '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 5000,
      panelClass: ['snackbar']
    });    
  }
}
