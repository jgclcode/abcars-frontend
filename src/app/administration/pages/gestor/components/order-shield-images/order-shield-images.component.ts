import { Component, Inject, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ShieldOrderImages } from '../../interfaces/shield-images-order.interface';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { environment } from 'src/environments/environment';
import { PromotionService } from '../../services/promotion.service';
import Swal from 'sweetalert2';
import { SetShieldComponent } from '../../pages/promotion/set-shield/set-shield.component';

interface Result {  
  reload: boolean;
}

@Component({
  selector: 'app-order-shield-images',
  templateUrl: './order-shield-images.component.html',
  styleUrls: ['./order-shield-images.component.css']
})
export class OrderShieldImagesComponent implements OnInit {

  // References
  public imagesOrderForSlider: ShieldOrderImages[] = [];
  private baseUrl: string = environment.baseUrl;
  public result:Result = {      
    reload: false
  }

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _promotionService: PromotionService,
    private _bottomSheetRef: MatBottomSheetRef<SetShieldComponent>
  ) { 
    // console.log(this.data.id_vehicle);
    // console.log(this.data.path_images);
    // console.log(this.data.shields[0].path);
    for (let i = 0; i < this.data.path_images.length; i++) {
      this.imagesOrderForSlider.push(
        {
          id: this.data.shields[i].id,
          name: this.data.shields[i].name,
          path: this.baseUrl + '/api/shields/imagen/' + this.data.path_images[i]
        }
      );
    }
    // console.log(this.imagesOrderForSlider);
  }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<ShieldOrderImages[]>){
    moveItemInArray(this.imagesOrderForSlider, event.previousIndex, event.currentIndex);
  }

  public changeOrderShieldImages(): void{
    console.log('Hola desde changeOrderShieldImages()');
    this._promotionService.changeOrderShieldImages(this.data.id_vehicle, this.imagesOrderForSlider)
      .subscribe(resp => {
        if (resp.status == 'success') {
          Swal.fire({
            icon: 'success',
            title: resp.message,
            showConfirmButton: false,
            timer: 2000
          });
          this.result.reload = true;
          this._bottomSheetRef.dismiss(this.result);
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Ocurrió un problema',
            showConfirmButton: false,
            timer: 2000
          });
        }
      });
  }

}
