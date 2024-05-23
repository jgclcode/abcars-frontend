import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { VendeTuAutoService } from '../../../../../dashboard/pages/vender-autos/services/vende-tu-auto.service';
import Swal from "sweetalert2";
import { environment } from 'src/environments/environment';

// Interfaces
import { Damage } from '../../../../../dashboard/pages/vender-autos/interfaces/get-damages.interfaces';
import { SetDamageImage } from '../../../../../dashboard/pages/vender-autos/interfaces/set-damage-image.interface';

@Component({
  selector: 'app-revision-external-picture',
  templateUrl: './revision-external-picture.component.html',
  styles: [`
    .spinner-wrapper {
      display: flex;
      align-items: center;      
      margin-left: 18px;
    }
  `]
})

export class RevisionExternalPictureComponent implements OnInit {
  // Global Url
  public url: string = '';
  public sell_your_car_id!:number;
  public spinner: boolean = false;

  public carImagesPaths: any [] = [];
  public carImagesPathsOthers: any [] = [];
  public imgs: any [] = [];
  public totalRecords: number = 0;
  public count: number = 0;

  public frontal!:any;
  public inputs = {
    part1: { disabled: false, loading: false, path: '-' },
    part2: { disabled: false, loading: false, path: '-' },
    part3: { disabled: false, loading: false, path: '-' },
    part4: { disabled: false, loading: false, path: '-' },
    part5: { disabled: false, loading: false, path: '-' },
    part6: { disabled: false, loading: false, path: '-' },  
  };

  public otros:{id:number, path:string}[] = [];

  public damages:Damage[] = [];
  public damage_image_file:any;
  public damage:number = 7;

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
    // this.getImagesOtros();
  }

  saveImage( event:any, damage_id:number ){
    this.loading( damage_id, true);
    this.spinner = true;
    this._vendeTuAutoService.setDamage_image(this.sell_your_car_id, damage_id, event.target.files[0])
    .subscribe({
      next: ( resp ) => {
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
      this.saveImageTotal(image, 22);
    });
  }

  saveImageTotal( event: any, damage_id: number){
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

  assignDamageImage( event:any ){
    this.damage_image_file = event.target.files[0];
  }

  saveDamageImage(){
    if( this.damage_image_file == undefined ) {
      Swal.fire({
        icon: 'error',
        title: 'Ooopppps!',
        text: "Por favor selecciona una imagen",
        confirmButtonColor: '#EEB838',
        timer: 2500
      });
      return;
    }
    this._vendeTuAutoService.setDamage_image(this.sell_your_car_id, this.damage, this.damage_image_file)
        .subscribe({
          next: ( resp ) => {
            if( resp.status === "success" ){
              Swal.fire({
                icon: 'success',
                text: resp.message,
                showConfirmButton: true,
                confirmButtonColor: '#EEB838',
                timer: 3500
              });
            }else{
              Swal.fire({
                icon: 'error',
                title: 'Ooopppps!',
                text: resp.errors[0],
                showConfirmButton: true,
                confirmButtonColor: '#EEB838',
                timer: 3500
              });
            }
          }
        });
  }


  loading( numero: number, loading:boolean){
    switch ( numero ) {
      case 1:
        this.inputs.part1.loading = loading;
        break;
      case 2:
        this.inputs.part2.loading = loading;
        break;
      case 3:
        this.inputs.part3.loading = loading;
        break;
      case 4:
        this.inputs.part4.loading = loading;
        break;
      case 5:
        this.inputs.part5.loading = loading;
        break;
      case 6:
        this.inputs.part6.loading = loading;
        break;
    }
  }

  disabled(numero: number, disabled:boolean){
    switch ( numero ) {
      case 1:
        this.inputs.part1.disabled = disabled;
        break;
      case 2:
        this.inputs.part2.disabled = disabled;
        break;
      case 3:
        this.inputs.part3.disabled = disabled;
        break;
      case 4:
        this.inputs.part4.disabled = disabled;
        break;
      case 5:
        this.inputs.part5.disabled = disabled;
        break;
      case 6:
        this.inputs.part6.disabled = disabled;
        break;
    }
  }

  assignPath( numero: number, path:string){
    switch ( numero ) {
      case 1:
        this.inputs.part1.path = path;
        break;
      case 2:
        this.inputs.part2.path = path;
        break;
      case 3:
        this.inputs.part3.path = path;
        break;
      case 4:
        this.inputs.part4.path = path;
        break;
      case 5:
        this.inputs.part5.path = path;
        break;
      case 6:
        this.inputs.part6.path = path;
        break;
    }
  }

  getImages(): void {
    this.carImagesPaths = [];
    for( let i = 1; i < 7; i++ ){
      this._vendeTuAutoService.getDamageImage( this.sell_your_car_id, i )
      .subscribe({
        next: (resp) => {
          if( resp.damage_image != null ){
            // this.disabled(i, true);
            // this.assignPath(i, resp.damage_image.path);
            let tempPath = this.url + '/api/damage_imgs/' + resp.damage_image.path + '/' + resp.sell_your_car_vin; /** Antes +i */
            let tuple = [i, tempPath, 'si', resp.damage_image.id];
            this.carImagesPaths.push(tuple);
          } else {
            let tuple = [i, '../../../../../../assets/principalesExterior/' + i + '.svg', 'no'];
            this.carImagesPaths.push(tuple);
          }
        }
      })
    }
  }

  getImagesOthers(): void {
    this.carImagesPathsOthers = [];
    this._vendeTuAutoService.getDamageImage( this.sell_your_car_id, 22)
    .subscribe({
      next: (resp) => {
        if (resp.damage_images != null) {
          resp.damage_images.map( image => {
            let tempPath = this.url + '/api/damage_imgs/' + image.path + '/' + resp.sell_your_car_vin; /** Antes + 22 */
            let tupleOthers = [22, tempPath, image.id];
            this.carImagesPathsOthers.push(tupleOthers);
          });
        }
      }
    });
  }

  // getImagesOtros(): void {
  //   for( let i = 7; i < 23; i++ ){
  //     this._vendeTuAutoService.getDamageImage( this.sell_your_car_id, i )
  //     .subscribe({
  //       next: (resp) => {
  //         if( resp.damage_image != null ){
  //           this.otros.push({ id: resp.damage_image.id, path: resp.damage_image.path });
  //         }
  //       }
  //     })
  //   }
  // }

  closeBottomSheet():void{
    this.bottomsheet.dismiss();
  }

  getDamages():void{
    this._vendeTuAutoService.getDamages('1,2,3,4,5,6')
    .subscribe({
      next: (resp) => {
        this.damages = resp.damages;
      }
    })
  }
}
