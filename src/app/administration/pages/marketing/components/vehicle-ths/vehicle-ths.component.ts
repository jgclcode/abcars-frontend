import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { environment } from 'src/environments/environment';

// Components 
import { VehiclesComponent } from '../../pages/vehicles/vehicles.component';

// Services
import { VehiclesService } from '../../services/vehicles.service';

// Interfaces
import { Image } from 'src/app/dashboard/pages/comprar-autos/interfaces/detail/vehicle_data.interface';
import { LoadImageData } from '../../interfaces/load-image-data.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vehicle-ths',
  templateUrl: './vehicle-ths.component.html',
  styleUrls: ['./vehicle-ths.component.css']
})
export class VehicleThsComponent {
  // References
  public imagesForSlider: Image[] = [];  
  public spinner: boolean = false; 
  private baseUrl: string = environment.baseUrl;

  public vehicle_id!:number;

  @ViewChild('images') images!: ElementRef;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _vehiclesService:VehiclesService,
    private _bottomSheetRef: MatBottomSheetRef<VehiclesComponent>
  ) { 
    // console.log(this.data.images.length);
    // Set images
    if( this.data.images.length == 0 ) {
      this.imagesForSlider.push(
        {           
          path: this.baseUrl + '/api/image_360_vehicle/vacio'          
        }
      );
    }
    
    for (let i = 0; i < this.data.images.length; i++) {                  
      this.imagesForSlider.push(
        {             
          path: this.baseUrl + '/api/image_360_vehicle/' + this.data.images[i].path            
        }
      );      
    }

    this.vehicle_id = data.vehicle_id;
  }

  /**
   * Launch new imagenes vehicle 
   */
  public sendImages() {
    this.spinner = true;

    // Get files in element-ref (images)
    if (this.images.nativeElement.files.length !== 0) {
      //console.log( this.images.nativeElement.files ); 
      let time = 0;
      let last = Object.keys(this.images.nativeElement.files)[Object.keys(this.images.nativeElement.files).length-1];
      for (const property in this.images.nativeElement.files) {
        if( property != 'length' && property != 'item' ){
          time = time + 1000;
          setTimeout(() => {
            console.log( this.images.nativeElement.files[property].name );
            this._vehiclesService.set360Image(this.vehicle_id, this.images.nativeElement.files[property])
            .subscribe({
              next: (loadImageData: LoadImageData) => {
                console.log( loadImageData );
                if( last === property){
                  this._bottomSheetRef.dismiss();

                  Swal.fire({
                    icon: 'success',
                    title: 'La subida de la imagen fue exitosa.',
                    showConfirmButton: false,
                    timer: 2000
                  });

                  //window.location.reload();
                  this.spinner = false;
                }
              }
            });
          }, time );
        }
      }
    }
  }

  async deleteImages() {
    Swal.fire({
      title: "Quieres eliminar las imagenes?",      
      showCancelButton: true,
      confirmButtonText: "Eliminar",      
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this._vehiclesService.delete360Images( this.vehicle_id )
                             .subscribe(
                               resp => {
                                  if( resp.status === "success"){
                                    Swal.fire(resp.message, "", "success");
                                  }else{
                                    Swal.fire("Algo salió mal", "", "error");
                                  }                                  
                               }
                             );        
      }
    });
  }

  private deleteImagesToExternalWebSite( external_website: string):void{
    this._vehiclesService.deleteImagesToExternalWebSite(this.vehicle_id, external_website)
        .subscribe({
          next: (resp) => {
            if( resp.status == 'success' ){
              this._bottomSheetRef.dismiss();
              Swal.fire({
                icon: 'success',
                title: resp.message,
                showConfirmButton: false,
                timer: 2000
              });
              //window.location.reload();
            }else{
              Swal.fire({
                icon: 'error',
                title: 'ocurrió un problema',
                showConfirmButton: false,
                timer: 2000
              });
            }
          }
        })
  }
}
