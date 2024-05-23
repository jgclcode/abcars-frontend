import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PromotionService } from '../../../services/promotion.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import Swal from "sweetalert2";

// Interface
import { Shield } from '../../../interfaces/get-shields.interface';
import { OrderShieldImagesComponent } from '../../../components/order-shield-images/order-shield-images.component';

@Component({
  selector: 'app-set-shield',
  templateUrl: './set-shield.component.html',
  styles: [
  ]
})
export class SetShieldComponent implements OnInit {
  // References of Help
  public spinner: boolean = false;
  public hide: boolean = true;

  // Form References
  public form!: UntypedFormGroup;

  public vin!:string;
  public vehicle_id!:number;

  public shields:Shield[] = [];
  public existsShields:number[] = [];
  public existsImageShields: string[] = [];
  public shieldsData:any[] = [];

  constructor(
    private _router: Router,    
    private _activatedRoute: ActivatedRoute,
    private _formBuilder: UntypedFormBuilder,
    private _promotionService: PromotionService,
    private _bottomSheet: MatBottomSheet
  ) { 
    this.createForm();    
  }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe(params => {      
      if( params['vin'] != undefined ){                      
        this.vin = params['vin'];
        this.getVehicle();                
      }   
    });
    this.scrollTop();
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }

  public createForm() {    
    this.form = this._formBuilder.group({
      shields: this._formBuilder.array([

      ])
    });
  }  

  get shieldsArr(){
    return this.form.get('shields') as UntypedFormArray;
  }

  public getVehicle(){
    this._promotionService.getVehicleByVin( this.vin )
        .subscribe(
          resp => {            
            this.vehicle_id = resp.vehicle.id
            resp.vehicle.shields.forEach( vehicle => this.existsShields.push(vehicle.id ) )
            this.getShields();
          }
        );
  }

  public getShields(){
    this._promotionService.getShields( 9999 )
        .subscribe(
          resp => {
            this.shields = resp.shields.data;
            this.shields.forEach( shield => {
              this.shieldsData.push({
                id: shield.id,
                name: shield.name,
                checked: this.exists( shield.id )          
              });
              this.shieldsArr.push( this._formBuilder.control( this.exists( shield.id ) ) );              
            });            
          }
        ); 
  }

  public exists( shield_id:number ){
    return this.existsShields.find( shield => shield == shield_id ?  true : false );
  }
  

  onSubmit(){    
    let valores_actuales = this.form.value.shields;
    valores_actuales.forEach( (element:number, index:number) => {
      this.shieldsData[index].checked = element;
    });  
    
    let total = this.shieldsData.length;
    this.shieldsData.forEach( (element:any, index:number ) => {
      if( element.checked ){
        this._promotionService.assignShield(this.vehicle_id, element.id)
            .subscribe( resp => {
              if(total == (index + 1)){
                Swal.fire({
                  icon: 'success',                
                  text: 'Garantias actualizadas',
                  showConfirmButton: true,
                  confirmButtonColor: '#EEB838',
                  timer: 3500         
                }).then( () => {
                  this._router.navigateByUrl('/admin/gestor/promotions');
                });
              }
            });
      }else{
        this._promotionService.removeShield(this.vehicle_id, element.id)
            .subscribe( resp => {
              if(total == (index + 1)){
                Swal.fire({
                  icon: 'success',                
                  text: 'Garantias actualizadas',
                  showConfirmButton: true,
                  confirmButtonColor: '#EEB838',
                  timer: 3500         
                }).then( () => {
                  this._router.navigateByUrl('/admin/gestor/promotions');
                });
              }
            });
      }   
    });
  }

  public openOrderImage(vin: string){
    // console.log(vin);
    this.existsImageShields = [];
    this._promotionService.getVehicleByVin(vin)
      .subscribe(
        resp => {
          // console.log(resp.vehicle.id);
          
          resp.vehicle.shields.forEach( shieldImage => this.existsImageShields.push(shieldImage.path));
          const openShieldImages = this._bottomSheet.open(OrderShieldImagesComponent, {
            data: {
              id_vehicle: resp.vehicle.id,
              shields: resp.vehicle.shields,
              path_images: this.existsImageShields
            } 
          });
        }
      );
      
  }

}
