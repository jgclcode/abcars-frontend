import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator as MatPaginator, PageEvent as PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource as MatTableDataSource } from '@angular/material/table';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import Swal from "sweetalert2";

import { environment } from 'src/environments/environment';

// Services
import { PromotionService } from '../../services/promotion.service';

// Interfaces
import { VehicleData, Vehicle } from '../../interfaces/vehicle-data.interface';
import { UploadPromotionsComponent } from '../../components/upload-promotions/upload-promotions.component';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styles: [
    `
    .cursor-pointer {
      cursor: pointer;
    }
    `
  ]
})
export class PromotionComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'name', 'vin', 'location', 'oportunity', 'ml', 'fb', 'actions'];
  public dataSource!: MatTableDataSource<Vehicle>;

  // MatPaginator 
  public length: number = 0;
  public pageIndex: number = 1;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  vehicles: Vehicle[] = [];
  public word:string | null = null;
  public spinner:boolean = false;

  baseUrl:string = environment.baseUrl;
  loading_publish_ml:number = 0;
  loading_update_ml:number = 0;
  loading_delete_ml:number = 0;

  loading_publish_fb:number = 0;
  loading_unpublish_fb:number = 0;


  constructor(
    private _promotionService:PromotionService,
    private _bottomSheet: MatBottomSheet
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
    this._promotionService.getVehiclesLocation(this.word, page)
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
    this._promotionService.requestUnitByVin(vin)
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

  public openPictures(): void {
    this._bottomSheet.open(UploadPromotionsComponent);
  }

  public apartar_y_desapartar( vin:string ):void {
    this._promotionService.apartar_y_desapartar( vin )
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
    this._promotionService.vehicleSold( vin )
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

  public publishMl( vehicle_id:number, row:any ): void {        
    Swal.fire({
      title: "Quieres publicar esta unidad en mercado libre?",      
      showCancelButton: true,
      confirmButtonText: "Publicar"      
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.loading_publish_ml = vehicle_id;        
        this._promotionService.publishMl( vehicle_id )
            .subscribe(
              ( resp ) => {
                if(resp.status === "success"){
                  Swal.fire("Vehículo publicado correctamente", "", "success");
                  row.mercado_id = resp.response.id;
                }else{
                  Swal.fire(resp.message != undefined ? resp.message : resp.errors != undefined && resp.errors.length > 0 ? resp.errors[0] : 'Ocurrió un problema', "", "error");
                }
                this.loading_publish_ml = 0;
              }              
            )        
      }
    });
  }

  updateMl( vehicle_id:number ):void {
    Swal.fire({
      title: "Quieres actualizar esta unidad en mercado libre?",      
      showCancelButton: true,
      confirmButtonText: "Actualizar"      
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.loading_update_ml = vehicle_id;                
      }
    });
  }

  deleteMl( vehicle_id:number ):void {
    Swal.fire({
      title: "Quieres eliminar esta unidad en mercado libre?",      
      showCancelButton: true,
      confirmButtonText: "Eliminar"      
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.loading_delete_ml = vehicle_id;                
      }
    });
  }
  public publishfb(vehicle_id:number){
    Swal.fire({
      title: "Quieres publicar esta unidad en Facebook?",      
      showCancelButton: true,
      confirmButtonText: "Publicar"      
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.loading_publish_fb = vehicle_id;        
        this._promotionService.publicFb( vehicle_id )
            .subscribe(
              ( resp ) => {
                if(resp.status === "success"){
                  Swal.fire("Vehículo publicado correctamente", "", "success");
 
                }else{
                  Swal.fire(resp.message != undefined ? resp.message : resp.errors != undefined && resp.errors.length > 0 ? resp.errors[0] : 'Ocurrió un problema', "", "error");
                }
                this.loading_publish_fb = 0;

               }              
            )        
      }
    });
  }

  unpublish(vehicle_id:number){
    Swal.fire({
      title: "Quieres eliminar esta unidad de Facebook?",      
      showCancelButton: true,
      confirmButtonText: "Eliminar"      
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.loading_unpublish_fb = vehicle_id;        
        this._promotionService.unpublishFb( vehicle_id )
            .subscribe(
              ( resp ) => {
                if(resp.status === "success"){
                  Swal.fire("Publicacion eliminada correctamente", "", "success");
 
                }else{
                  Swal.fire(resp.message != undefined ? resp.message : resp.errors != undefined && resp.errors.length > 0 ? resp.errors[0] : 'Ocurrió un problema', "", "error");
                }
                this.loading_unpublish_fb = 0;

               }              
            )        
      }
    });
  }
}
