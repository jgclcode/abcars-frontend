import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// Interfaces 
import { Vehicle } from './../../interfaces/compra-tu-auto/data_buscador.interface';
import { environment } from 'src/environments/environment';

// Services
import { DetailService } from '../../services/detail/detail.service';

@Component({
  selector: 'c-vender-autos-vehicle',
  templateUrl: './vehicle.component.html',
  styles: [`
    .fade-in-image { animation: fadeIn .6s; }

    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    
    .price-container {
      position: relative;
      
    }

    /* .cover-image {
      object-fit: cover;
    } */
    
    .price {
      position: absolute;
      color: white;
      background-color: #666666;
      width: 197px;
      height: 31px;
      padding-top: 5px;
      border-radius: 27px 0px 0px 0px;
      text-align: center;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--price-title);
    }

    .price-align {
      width: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
    }

    /* .price-promo {
      font-size: var(--price-promo);
      margin-right: 30px;
    } */
    .price-promo {
      font-size: 12px;
    }

    .font-generic {
      font-size: var(--font-generic);
    }

    .view-deep-container {
      position: relative;
      margin-top: 12px;
    }

    .view {
      position: absolute;
      background-color: #666666;
      width: 100%; 
      height: 31px;
      padding-top: 5px;
      border-radius: 0px 0px 32px 0px;
      display: flex;
      align-items: center;
      text-decoration: none; 
      color: white;
      z-index: 2;
    }

    .deep {
      position: absolute;
      color: white;
      background-color: #EEB838;
      width: 100%; 
      height: 31px;
    }

    .view-deep {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .tag-choice { 
      display: block;
      position: absolute;
      padding: 2px 8px;
      z-index: 2;
    }

    .my-tag {
      width: 20px;
      height: 70px;
      display: flex;
      flex-direction: row-reverse;
    }

    .card {
      border-radius: 8px !important;
    }

    .card img {
      width: 100%;
      height: 250px;
      object-fit: cover !important;
    }

    .card-text {
      margin: 0px 0px 0px;
    }

    .divider {
      border-block-end: 1px solid #e7e9ee;
    }

    @media screen and (max-width: 1091px) {
      .card img {
        width: 100%;
        height: 200px; /**Eran 450px */
        object-fit: cover;
      }
    }

    .card-element {
      transition: transform 0.1s ease;
    }

    .card-element:hover {
      transform: scale(1.01);
    }    

    .card-body {
    flex: 1 1 auto!important;
    padding: 0rem 1rem!important;
    }

    .center_360 {
      position: relative; 
    }

    .center_360 p {
      position: absolute;
      top: 60%;
      left: 50%;
      transform: translate(-50%, -50%);         
      font-size: 15px;      
      user-select: none;
    }

    .material-icons {
      font-size: 26px;
      margin-bottom: 40px;
    }

  `]
})

export class VehicleComponent implements OnInit {
  
  public vehicle_image = ''; 
  public choice: boolean = false;
  public priceOffer: boolean = false;
  public shield: boolean = false;
  public baseUrl: string = environment.baseUrl;

  public bono: number;
  
  @Input() vehicle!: Vehicle; 
  @Output() vehicleToParent = new EventEmitter<Vehicle>();

  sendVehicleToParent( event: Event ) {  
    event.stopPropagation();    
    this.vehicleToParent.emit(this.vehicle);
  }

  constructor(private _detailService: DetailService) { }

  ngOnInit(): void {  
    this.priceOffer = this.vehicle.priceOffer != null ? true : false;
    this.shield = this.vehicle.shields.length > 0 ? true : false;
    if (this.priceOffer) {
      this.bono = this.vehicle.price - this.vehicle.priceOffer!;
    }
    let primera_imagen = this.vehicle.vehicle_images[0];  
    
    if( primera_imagen != undefined && primera_imagen.external_website == "yes" ){
      this.vehicle_image = primera_imagen.path;
    } else {
      this.vehicle_image = primera_imagen != undefined ? this.vehicle.vehicle_images[0].path : 'vacio';
      this.vehicle_image = this.baseUrl + '/api/image_vehicle/' + this.vehicle_image;
    }

    this.reservedVehicle();
    this.choiceVehicle(String(this.vehicle.vin));
  }

  /**
   * Checking exists choice   
   */
  public reservedVehicle() {
    if (this.vehicle.choices) {
      this.choice = (Object.entries(this.vehicle.choices).length === 0) ? false : true;    
    }
  }

  /**
   * Find vehicle in choice 
   */
  public choiceVehicle(vin: string) {
    this._detailService.getChoiceByVin(vin)
    .subscribe({
      next: (response) => {        
        if (response.choice) {
          this.choice = true;
        } else {
          this.choice = false;
        }
      }
    });
  }

}