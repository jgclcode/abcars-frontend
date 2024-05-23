import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import Swal, { SweetAlertIcon } from "sweetalert2";

import { PromotionService } from '../../services/promotion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-promotions',
  templateUrl: './upload-promotions.component.html',
  styles: [
  ]
})
export class UploadPromotionsComponent implements OnInit {
  public formFile!: UntypedFormGroup;
  public file!:any;

  constructor(
    private _router: Router,
    private _fb: UntypedFormBuilder,
    private _bottomSheetRef: MatBottomSheetRef,
    private _promotionService:PromotionService
  ) { }

  ngOnInit(): void {
    this.formFileInit();
  }

  private formFileInit(){
    this.formFile = this._fb.group({
      file: ['', Validators.required]      
    });
  }

  get fileInvalid() {
    return this.formFile.get('file')!.invalid && (this.formFile.get('file')!.dirty || this.formFile.get('file')!.touched);
  }

  getFile( event:any ){
    this.file = event.target.files[0];
  }

  onSubmit(): void {
    if( this.file != undefined ){
      this._promotionService.addPromotions( this.file )
        .subscribe({
          next: (resp) => {
            if( resp.status == "success"){
              let cadena = JSON.stringify( resp.respuesta.updated );
              cadena = this.replaceAll( cadena, '{', '' );
              cadena = this.replaceAll( cadena, '}', '' );
              cadena = this.replaceAll( cadena, ',', '<br>' );
              cadena = this.replaceAll( cadena, "\\", ':' );
              this.alert(
                'success',
                'Promociones agregadas correctamente',
                cadena
              ).then( () => {
                this.redirectTo('/admin/gestor/promotions');
                let errores = JSON.stringify( resp.respuesta.errors );
                errores = this.replaceAll( errores, '{', '' );
                errores = this.replaceAll( errores, '}', '' );
                errores = this.replaceAll( errores, ',', '<br>' );
                errores = this.replaceAll( errores, "\\", ':' );

                if( errores.length > 10 ){
                  this.alert(
                    'error',
                    'Errores en el csv',
                    errores
                  );
                }
              });
            }else{

            }
          }
      });
    }
  }

  alertInfo():void{
    Swal.fire(
      'Datos necesarios en el csv',
      '<b>vin:</b> cadena de texto con 17 caracteres <br> <b>promocion:</b> cadena de texto, la palabra promocion no lleva acento en el csv',
      'info'
    )
  }

  alert( icon:SweetAlertIcon, title:string, html:string ){
    return Swal.fire({
      icon,
      width: 800,
      title,
      html
    })
  }

  replaceAll(str:string, find:string, replace:string) {
    return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
  }

  escapeRegExp(string:string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

  redirectTo(uri:string){
    this._router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this._router.navigate([uri]));
  }

}
