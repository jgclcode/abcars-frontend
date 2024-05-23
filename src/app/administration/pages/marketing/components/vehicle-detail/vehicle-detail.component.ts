import { Component, OnInit, Input } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

// Enviroments
import { environment } from 'src/environments/environment';

// Interfaces
import { Vehicle } from 'src/app/dashboard/pages/comprar-autos/interfaces/compra-tu-auto/data_buscador.interface';

// Components
import { VehiclePicturesComponent } from '../vehicle-pictures/vehicle-pictures.component';
import { OrderPicturesComponent } from '../order-pictures/order-pictures.component';
import { VehicleThsComponent } from '../vehicle-ths/vehicle-ths.component';

@Component({
  selector: 'app-vehicle-detail',
  templateUrl: './vehicle-detail.component.html'  
})

export class VehicleDetailComponent implements OnInit{

  // Get vehicle
  @Input() vehicle!: Vehicle;
  public vehicle_image = '';
  public baseUrl: string = environment.baseUrl;

  constructor(private _bottomSheet: MatBottomSheet) { }

  ngOnInit(): void {
    let primera_imagen = this.vehicle.vehicle_images[0];  
    
    if( primera_imagen != undefined && primera_imagen.external_website == "yes" ){
      this.vehicle_image = primera_imagen.path;
    }else{
      this.vehicle_image = primera_imagen != undefined ? this.vehicle.vehicle_images[0].path : 'vacio';
      this.vehicle_image = this.baseUrl + '/api/image_vehicle/' + this.vehicle_image;
    }
  }

  /**
   * Open buttom sheet pictures
   */
  public openPictures(): void {
    this._bottomSheet.open(VehiclePicturesComponent, {
      data: {
        vehicle_id: this.vehicle.id,
        vin: this.vehicle.vin,
        images: this.vehicle.vehicle_images
      }
    });
  }

  public openOrderPictures():void{
    this._bottomSheet.open(OrderPicturesComponent, {
      data: {
        vehicle_id: this.vehicle.id,
        vin: this.vehicle.vin,
        images: this.vehicle.vehicle_images
      }
    });
  }

  public open360Vehicles():void {
    this._bottomSheet.open(VehicleThsComponent, {
      data: {
        vehicle_id: this.vehicle.id,
        vin: this.vehicle.vin,
        images: this.vehicle.vehicle_360_images
      }
    });
  }
}
