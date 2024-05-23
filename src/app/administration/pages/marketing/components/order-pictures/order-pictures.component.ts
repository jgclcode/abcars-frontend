import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

// Components 
import { VehiclesComponent } from '../../pages/vehicles/vehicles.component';

// Services
import { VehiclesService } from '../../services/vehicles.service';

// Interfaces
import { ImageOrder } from 'src/app/dashboard/pages/comprar-autos/interfaces/detail/vehicle_data.interface';

@Component({
  selector: 'app-order-pictures',
  templateUrl: './order-pictures.component.html',
  styles: [
    `
    .list {
      width: 800px;
      max-width: 100%;
      border: solid 1px #ccc;
      min-height: 60px;
      display: block;
      background: white;
      border-radius: 4px;
      overflow: hidden;
    }

    .box {
      padding: 20px 10px;
      border-bottom: solid 1px #ccc;
      color: rgba(0, 0, 0, 0.87);
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      cursor: move;
      background: white;
      font-size: 14px;
    }

    .cdk-drag-preview {
      box-sizing: border-box;
      border-radius: 4px;
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
                  0 8px 10px 1px rgba(0, 0, 0, 0.14),
                  0 3px 14px 2px rgba(0, 0, 0, 0.12);
    }

    .cdk-drag-placeholder {
      opacity: 0;
    }

    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .example-box:last-child {
      border: none;
    }

    .example-list.cdk-drop-list-dragging .example-box:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .img-size-sm{
      width: 200px !important;
    }

    `
  ]
})
export class OrderPicturesComponent {

  // References
  public imagesForSlider: ImageOrder[] = [];  
  public spinner: boolean = false; 
  private baseUrl: string = environment.baseUrl;

  public vehicle_id!:number;

  @ViewChild('images') images!: ElementRef;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _vehiclesService:VehiclesService,
    private _bottomSheetRef: MatBottomSheetRef<VehiclesComponent>
  ) {     
    // Set images
    if( this.data.images.length == 0 ) {
      this.imagesForSlider.push(
        { 
          id: null,
          path: this.baseUrl + '/api/image_vehicle/vacio',
          external_website: null
         }
      );
    }
    
    for (let i = 0; i < this.data.images.length; i++) {            
      if( this.data.images[i].external_website === "yes" ){
        this.imagesForSlider.push(
          { 
            id: this.data.images[i].id,
            path: this.data.images[i].path,
            external_website: "yes"
          }
        );
      }else{
        this.imagesForSlider.push(
          { 
            id: this.data.images[i].id,
            path: this.baseUrl + '/api/image_vehicle/' + this.data.images[i].path,
            external_website: "no"
          }
        );
      }  
    }

    this.vehicle_id = data.vehicle_id;
  }
  
  drop(event: CdkDragDrop<ImageOrder[]>) {    
    moveItemInArray(this.imagesForSlider, event.previousIndex, event.currentIndex);          
  }

  changeOrder():void{
    this._vehiclesService.changeOrder(this.vehicle_id, this.imagesForSlider)
        .subscribe(
          resp => {
            if( resp.status == 'success' ){
              this._bottomSheetRef.dismiss();
              Swal.fire({                    
                icon: 'success',
                title: resp.message,
                showConfirmButton: false,
                timer: 2000
              });
              window.location.reload(); 
            }else{
              Swal.fire({                    
                icon: 'error',  
                title: 'ocurrió un problema',                      
                showConfirmButton: false,
                timer: 2000
              });
            }
          }
        )  
  }
}
