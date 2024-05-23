import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import Swal from "sweetalert2";
import { environment } from 'src/environments/environment';

import { VendeTuAutoService } from '../../../../../dashboard/pages/vender-autos/services/vende-tu-auto.service';

// Interfaces
import { Damage } from '../../../../../dashboard/pages/vender-autos/interfaces/get-damages.interfaces';
import { DamageImage } from 'src/app/dashboard/pages/vender-autos/interfaces/get-damage-image.interface';
import { SetDamageImage } from '../../../../../dashboard/pages/vender-autos/interfaces/set-damage-image.interface';

@Component({
  selector: 'app-revision-internal-picture',
  templateUrl: './revision-internal-picture.component.html',
  styles: [`
    .spinner-wrapper {
      display: flex;
      align-items: center;
      margin-left: 18px;
    }
  `]
})
export class RevisionInternalPictureComponent implements OnInit {
  // Global Url
  public url: string = '';
  public sell_your_car_id!:number;
  public spinner: boolean = false;

  public carImagesPaths: any [] = [];
  public carImagesPathsOthers: any [] = [];
  public imgs: any [] = [];
  public show!: boolean;
  // public vin: string = '';

  public inputs = {
    part23: { disabled: false, loading: false, path: '-' },
    part24: { disabled: false, loading: false, path: '-' },
    part25: { disabled: false, loading: false, path: '-' },
    part26: { disabled: false, loading: false, path: '-' },
    part27: { disabled: false, loading: false, path: '-' },
    part28: { disabled: false, loading: false, path: '-' },  
    part29: { disabled: false, loading: false, path: '-' },
    part30: { disabled: false, loading: false, path: '-' },
    part31: { disabled: false, loading: false, path: '-' },
    part32: { disabled: false, loading: false, path: '-' },  
    part33: { loading: false, path: '-' },    
  };

  public damages:Damage[] = [];
  public damage_image_file:any;
  public otros:DamageImage[] = [];
  public imagesCars: DamageImage[] = [];
  public totalRecords: number = 0;
  public count: number = 0;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomsheet: MatBottomSheetRef,
    private _vendeTuAutoService:VendeTuAutoService
  ) {
    this.url = environment.baseUrl;
  }

  ngOnInit(): void {
    this.sell_your_car_id = this.data.sell_your_car_id;
    this.getImages();
    this.getImagesOthers();
    this.getDamages();
  }

  saveImage( event:any, damage_id:any ){
    this.loading( damage_id, true);
    this.spinner = true;
    this._vendeTuAutoService.setDamage_image(this.sell_your_car_id, damage_id, event.target.files[0])
    .subscribe({
      next: ( resp ) => {
        // this.vin = resp.sell_your_car_vin;
        if( resp.status === "success" ){
          Swal.fire({
            icon: 'success',
            text: resp.message,
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });
          this.disabled( damage_id, true );
          this.spinner = false;
          // this.closeBottomSheet();
          this.getImages();
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Ooopppps!',
            text: resp.errors[0],
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });
          this.spinner = false;
        }
        this.loading( damage_id, false);
      }
    });
  }

  updateImage(damage_image_id: number, file: any){
    this.spinner = true;
    const picture = file.target.files[0];
    this._vendeTuAutoService.updateDamageImage(damage_image_id, picture)
    .subscribe({
      next: ({ code, status, message }: SetDamageImage) => {
        if (code === '200' && status === 'success') {
          Swal.fire({
            icon: 'success',
            text: message,
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer:3000
          });
          this.spinner = false;
          this.getImages();
          this.getImagesOthers();
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          text: 'No se pudo actualizar la imagen, por favor intente nuevamente o verifique su información.',
          showConfirmButton: true,
          confirmButtonColor: '#EEB838',
          timer: 3000
        });
        this.spinner = false;
      }
    });
  }

  fileCapture(event: any){
    this.spinner = true;
    this.imgs = [];
    for (const document of event.target.files) {
      this.imgs.push(document);
    }
    this.totalRecords = this.imgs.length;
    this.count = 1;
    this.imgs.map( image => {
      this.saveImageTotal(image, 33);
    });
  }

  saveImageTotal( event: any, damage_id: any ){
    // console.log(event, this.totalRecords);
    this._vendeTuAutoService.setDamage_image(this.sell_your_car_id, damage_id, event)
    .subscribe({
      next: ( resp ) => {
        if (resp.status === 'success') {
          if (this.count < this.totalRecords) {
            this.count++;
          } else {
            Swal.fire({
              icon: 'success',
              text: resp.message,
              showConfirmButton: true,
              confirmButtonColor: '#EEB838',
              timer: 3500
            });
            // Change spinner
            this.spinner = false;
            this.getImagesOthers();
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Ooopppps!',
            text: resp.errors[0],
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });
          // Change spinner
          this.spinner = false;
        }
      }
    });
  }

  loading( numero: number, loading:boolean){
    switch ( numero ) {
      case 23:
        this.inputs.part23.loading = loading;
        break;
      case 24:
        this.inputs.part24.loading = loading;
        break;
      case 25:
        this.inputs.part25.loading = loading;
        break;
      case 26:
        this.inputs.part26.loading = loading;
        break;
      case 27:
        this.inputs.part27.loading = loading;
        break;
      case 28:
        this.inputs.part28.loading = loading;
        break;
      case 29:
        this.inputs.part29.loading = loading;
        break;
      case 30:
        this.inputs.part30.loading = loading;
        break;
      case 31:
        this.inputs.part31.loading = loading;
        break;
      case 32:
        this.inputs.part32.loading = loading;
        break;
      case 33:
        this.inputs.part32.loading = loading;
        break;
    }
  }

  disabled( numero: number, disabled:boolean){
    switch ( numero ) {
      case 23:
        this.inputs.part23.disabled = disabled;
        break;
      case 24:
        this.inputs.part24.disabled = disabled;
        break;
      case 25:
        this.inputs.part25.disabled = disabled;
        break;
      case 26:
        this.inputs.part26.disabled = disabled;
        break;
      case 27:
        this.inputs.part27.disabled = disabled;
        break;
      case 28:
        this.inputs.part28.disabled = disabled;
        break;
      case 29:
        this.inputs.part29.disabled = disabled;
        break;
      case 30:
        this.inputs.part30.disabled = disabled;
        break;
      case 31:
        this.inputs.part31.disabled = disabled;
        break;
      case 32:
        this.inputs.part32.disabled = disabled;
        break;
    }
  }

  assignPath( numero: number, path:string){
    switch ( numero ) {
      case 23:
        this.inputs.part23.path = path;
        break;
      case 24:
        this.inputs.part24.path = path;
        break;
      case 25:
        this.inputs.part25.path = path;
        break;
      case 26:
        this.inputs.part26.path = path;
        break;
      case 27:
        this.inputs.part27.path = path;
        break;
      case 28:
        this.inputs.part28.path = path;
        break;
      case 29:
        this.inputs.part29.path = path;
        break;
      case 30:
        this.inputs.part30.path = path;
        break;
      case 31:
        this.inputs.part31.path = path;
        break;
      case 32:
        this.inputs.part32.path = path;
        break;
      case 33:
        this.inputs.part33.path = path;
        break;
    }
  }

  getImages(): void {
    this.carImagesPaths = []; 
    for( let i = 23; i < 33; i++ ){ /** Antes let i = 23; i < 34; */
      this._vendeTuAutoService.getDamageImage( this.sell_your_car_id, i )
      .subscribe({
        next: (resp) => {
          console.log(resp);
          
          if( resp.damage_image != null ){
            let tempPath = this.url + '/api/damage_imgs/' + resp.damage_image.path + '/' + resp.sell_your_car_vin; /** Antes + i  | this.vin*/
            let tuple = [i, tempPath, 'si', resp.damage_image.id];
            this.carImagesPaths.push(tuple);
          } else {
            let tuple = [i, '../../../../../../assets/principales/' + i + '.svg', 'no'];
            this.carImagesPaths.push(tuple);
          }
        }
      })
    }
    this.show = true;
  }

  getImagesOthers(): void {
    this.carImagesPathsOthers = [];
    this._vendeTuAutoService.getDamageImage( this.sell_your_car_id, 33)
    .subscribe({
      next: (resp) => {
        if (resp.damage_images != null) {
          resp.damage_images.map( image => {
            let tempPath = this.url + '/api/damage_imgs/' + image.path + '/' + resp.sell_your_car_vin; /** Antes + 33 | this.vin*/
            let tupleOthers = [33, tempPath, image.id];
            this.carImagesPathsOthers.push(tupleOthers);
          });
        }
      }
    });
  }

  closeBottomSheet():void{
    this.bottomsheet.dismiss();
  }

  getDamages():void{
    this._vendeTuAutoService.getDamages('23, 24, 25, 26, 27, 28, 29, 30, 31, 32')
    .subscribe({
      next: (resp) => {
        this.damages = resp.damages;
      }
    })
  }
}
