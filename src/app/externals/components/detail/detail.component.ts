import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatSnackBar as MatSnackBar } from '@angular/material/snack-bar';

import { Vehicle } from 'src/app/dashboard/pages/comprar-autos/interfaces/compra-tu-auto/data_buscador.interface';
import { Image, Shield } from 'src/app/dashboard/pages/comprar-autos/interfaces/detail/vehicle_data.interface';
import { DetailService } from 'src/app/dashboard/pages/comprar-autos/services/detail/detail.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.components.css']
})

export class DetailComponent implements OnInit {

  // References of Help
  public pageVehicle: string = '';
  public route!: boolean;

  // Vehicle
  public vehicle: Vehicle;  
  public imagesForSlider: Image[] = []; 
  public shields: Shield[] = [];
  
  public baseUrl: string = environment.baseUrl;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) data: any,
    private _bottomSheetRef: MatBottomSheetRef<DetailComponent>, 
    private _snackBar: MatSnackBar,
    private _detailService: DetailService,
  ) {    
    // Assing data of vehicle
    this.vehicle = data;

    // Set shields of vehicle
    this.shields = data.shields;
  }

  ngOnInit(): void {
    this.getVehicle();
    this.getChoice();
    this.scrollTop();
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }

  /**
   * Close sheet   
   */
  public closeSheet(): void {
    this._bottomSheetRef.dismiss();    
  }

  /**
   * Get information vehicle for detail
   */
  public getVehicle() {
    if (this.vehicle.vehicle_images.length == 0) {
      this.imagesForSlider.push(
        { path: this.baseUrl + '/api/image_vehicle/vacio' }
      );
    }

    this.vehicle.vehicle_images.map(imagen => {
      if (imagen.external_website === "yes") {
        this.imagesForSlider.push(
          { path: imagen.path }
        );
      } else {
        this.imagesForSlider.push(
          { path: this.baseUrl + '/api/image_vehicle/' + imagen.path }
        );
      }
    });
  }

  public getChoice(){
    this._detailService.getChoiceByVin(this.vehicle.vin)
    .subscribe( {
      next: (response) => {
        if (response.code == 200) {
          this.route = false;
        } else {
          this.route = true;
        }
      }
    });
  }

}