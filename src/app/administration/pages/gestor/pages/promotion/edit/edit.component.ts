import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PromotionService } from '../../../services/promotion.service';
import Swal from "sweetalert2";

// Interface
import { Vehicle, requestBodyVehicle } from '../../../interfaces/vehicle-by-vin-data.interface';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})

export class EditComponent implements OnInit {
  
  public form!: UntypedFormGroup;
  
  public body = {} as requestBodyVehicle;

  public button: boolean = false;

  public vin!: string;
  public vehicle!: Vehicle;

  constructor(
    private _router: Router,    
    private _activatedRoute: ActivatedRoute,
    private _formBuilder: UntypedFormBuilder,
    private _promotionService: PromotionService
  ) { 
    this.formInit();
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

  public getVehicle(){
    this._promotionService.getVehicleByVin( this.vin )
    .subscribe(
      resp => {            
        this.vehicle = resp.vehicle
      }
    );
  }

  private formInit() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      location: ['', [Validators.required]],
      yearModel: ['', [Validators.required]],
      purchaseDate: ['', Validators.required],
      price: ['', Validators.required],
      priceList: ['', Validators.required],
      salePrice: ['', Validators.required],
      carline: ['', Validators.required],
      type: ['', Validators.required],
      cylinders: ['', Validators.required],
      colorInt: ['', Validators.required],
      colorExt: ['', Validators.required],
      status: ['', Validators.required],
      plates: [''],
      transmission: ['', Validators.required],
      km: ['', Validators.required],
      numKeys: ['', Validators.required],
      studs: ['', Validators.required],
      spareTire: ['', Validators.required],
      hydraulicJack: ['', Validators.required],
      extinguiser: ['', Validators.required],
      reflectives: ['', Validators.required],
      handbook: ['', Validators.required],
      insurancePolicy: ['', Validators.required],
      powerCables: ['', Validators.required],
      // priceOffer: [''],
      priceOffer: {value: '', disabled: true},
      // promotion: [''],
      priceBonus: ['']
    });
  }
  
  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }

  onSubmit(){    

    this.body.name = this.vehicle.name;
    this.body.description= this.vehicle.description;
    this.body.location= this.vehicle.location;
    this.body.yearModel= this.vehicle.yearModel;
    this.body.purchaseDate= this.vehicle.purchaseDate;
    this.body.price= this.vehicle.price;
    this.body.priceList= this.vehicle.priceList;
    this.body.salePrice= this.vehicle.salePrice;
    this.body.priceBonus= this.vehicle.priceBonus;
    this.body.priceOffer= this.vehicle.priceOffer;
    this.body.type= this.vehicle.type;
    this.body.carline= this.vehicle.carline;
    this.body.cylinders= this.vehicle.cylinders;
    this.body.colorInt= this.vehicle.colorInt;
    this.body.colorExt= this.vehicle.colorExt;
    this.body.status= this.vehicle.status;
    this.body.plates= this.vehicle.plates;
    this.body.transmission= this.vehicle.transmission;
    this.body.inventoryDays = this.vehicle.inventoryDays;
    this.body.km = this.vehicle.km;
    this.body.numKeys = this.vehicle.numKeys;
    this.body.studs = this.vehicle.studs;
    this.body.spareTire = this.vehicle.spareTire;
    this.body.hydraulicJack = this.vehicle.hydraulicJack;
    this.body.extinguiser = this.vehicle.extinguiser;
    this.body.reflectives = this.vehicle.reflectives;
    this.body.handbook = this.vehicle.handbook;
    this.body.insurancePolicy = this.vehicle.insurancePolicy;
    this.body.powerCables = this.vehicle.powerCables;
    this.body.promotion = this.vehicle.promotion;
    this.body.carmodel_id = this.vehicle.carmodel_id;
    this.body.vehiclebody_id = this.vehicle.vehiclebody_id;
    this.body.branch_id = this.vehicle.branch_id;
    this.body.client_id = this.vehicle.client_id;
    
    if(this.body.priceBonus === null || this.body.priceBonus === ""){
      delete this.body['priceBonus'];
    }

    if(this.body.promotion === null || this.body.promotion === ""){
      delete this.body['promotion'];
    }

    if(this.body.priceOffer === null || this.body.priceOffer === ""){
      delete this.body['priceOffer'];
    }

    if(this.body.plates === null || this.body.plates === ""){
      delete this.body['plates'];
    }

    this.button = true;

    this._promotionService.updateVehicle( this.body, this.vehicle.id)
    .subscribe({
      next: (resp) => {
        if( resp.message != undefined ){
          Swal.fire({
            icon: 'success',
            text: resp.message,
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });

        } else {
          Swal.fire('Ocurrio un problema', '', 'error')
        }

        this.button = false;
      }
    });
  }

  get isNotVehicle() {
    if(this.vehicle === undefined){
      return true;
    }
    return Object.keys(this.vehicle).length === 0;
  }

  get nameInvalid() {
    return this.form.get('name')!.invalid && (this.form.get('name')!.dirty);
  }

  get descriptionInvalid() {
    return this.form.get('description')!.invalid && (this.form.get('description')!.dirty);
  }

  get locationInvalid() {
    return this.form.get('location')!.invalid && (this.form.get('location')!.dirty);
  }

  get yearModelInvalid() {
    return this.form.get('yearModel')!.invalid && (this.form.get('yearModel')!.dirty);
  }

  get purchaseDatelInvalid() {
    return this.form.get('purchaseDate')!.invalid && (this.form.get('purchaseDate')!.dirty);
  }

  get pricelInvalid() {
    return this.form.get('price')!.invalid && (this.form.get('price')!.dirty);
  }

  get priceListInvalid() {
    return this.form.get('priceList')!.invalid && (this.form.get('priceList')!.dirty);
  }

  get salePriceInvalid() {
    return this.form.get('salePrice')!.invalid && (this.form.get('salePrice')!.dirty);
  }

  get carlineInvalid(){
    return this.form.get('carline')!.invalid && (this.form.get('carline')!.dirty);
  }

  get cylindersInvalid(){
    return this.form.get('cylinders')!.invalid && (this.form.get('cylinders')!.dirty);
  }

  get colorIntInvalid(){
    return this.form.get('colorInt')!.invalid && (this.form.get('colorInt')!.dirty);
  }

  get colorExtInvalid(){
    return this.form.get('colorExt')!.invalid && (this.form.get('colorExt')!.dirty);
  }

  get platesInvalid(){
    return this.form.get('plates')!.invalid && (this.form.get('plates')!.dirty);
  }

  get kmInvalid(){
    return this.form.get('km')!.invalid && (this.form.get('km')!.dirty);
  }

  get numKeysInvalid(){
    return this.form.get('numKeys')!.invalid && (this.form.get('numKeys')!.dirty);
  }

  get priceOfferInvalid(){
    return this.form.get('priceOffer')!.invalid && (this.form.get('priceOffer')!.dirty);
  }
  
  // Promoción no se agrega
  // get promotionInvalid() {
  //   return this.form.get('promotion')!.invalid && (this.form.get('promotion')!.dirty);
  // }
}
