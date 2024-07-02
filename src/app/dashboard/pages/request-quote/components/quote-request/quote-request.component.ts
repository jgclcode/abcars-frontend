import { CommonModule } from '@angular/common';
// import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

// Services
import { CompraTuAutoService } from '../../../comprar-autos/services/compra-tu-auto.service';
import { RequestqService } from '../services/requestq.service';
import { DetailService } from '../../../comprar-autos/services/detail/detail.service';

// Animaciones
import Swal from "sweetalert2";

// Swiper
import { Swiper, Navigation, SwiperOptions, Zoom} from 'swiper';

// Interfaces
import { DataVehicleBody, Vehiclebody } from '../../../comprar-autos/interfaces/compra-tu-auto/data_vehiclebodies.interface';
import { DataBrands } from '../../../comprar-autos/interfaces/compra-tu-auto/data_brands.interface';
import { DataModels, Model } from '../../../comprar-autos/interfaces/compra-tu-auto/data_models.interface';
import { DataYears } from '../../../comprar-autos/interfaces/compra-tu-auto/data_years.interface';
import { DataStates } from '../../../comprar-autos/interfaces/compra-tu-auto/data_states.interface';
import { DataTransmissions } from '../../../comprar-autos/interfaces/compra-tu-auto/data_transmissions.interface';
import { Vehicle } from '../../../comprar-autos/interfaces/compra-tu-auto/data_buscador.interface';
import { Sheetquote } from '../interfaces/requestq.interface';
import { Image, VehicleData } from '../../../comprar-autos/interfaces/detail/vehicle_data.interface';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-quote-request',
    // standalone: true,
    // imports: [
    //     CommonModule,
    // ],
    templateUrl: './quote-request.component.html',
    styleUrls: ['./quote-request.component.css'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteRequestComponent implements OnInit {

    public spinner: boolean = false;

    public isDisabled: boolean = true;

  // References forms
  public requestQuoteFormGroup!: UntypedFormGroup

  public allBrands: string[] = [];
  public brands: string[] = [];
  public filteredBrands!: Observable<string[]>;
  public brandCtrl = new FormControl('');

  public allModels: string[] = [];
  public filteredModels!: Observable<string[]>;
  public modelCtrl = new FormControl('');
  public models: string[] = [];
  
  public allYears: string[] = [];
  public filteredYears!: Observable<string[]>;
  public yearCtrl = new FormControl('');
  public years: string[] = [];

  public allStates: string[] = [];
  public filteredStates!: Observable<string[]>;
  public stateCtrl = new FormControl('');
  public states: string[] = [];

  public allTransmissions: string[] = [];
  public filteredTransmissions!: Observable<string[]>;
  public transmissionCtrl = new FormControl('');
  public transmissions: string[] = [];

  public allCarrocerias: Vehiclebody[] = [];
  public carrocerias: Vehiclebody[] = [];

  public brand_id: number = 0;
  public my_brands: any;
  public brandTotal: boolean = false;

  public pageSize = 100;
  public palabra_busqueda: string = '';
  public orden: string = 'precioMenos';
  public pageIndex: number = 1;

  public vehicles: Vehicle[] = [];
  public my_vehicle =  true;
  public imagesForSlider: Image[] = [];
  public priceOffer: boolean = false;
  public description: string = '';
  public baseUrl: string = environment.baseUrl;

  public swiperThumbs2!: Swiper;
  public swiperThumbs1!: Swiper;
  public configSwiperT!: SwiperOptions;
  public vehicle!: Vehicle;
  public descriptions!: string[];

  public table_view: boolean = false;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _compraTuAutoService: CompraTuAutoService,
    private _detailService: DetailService,
    private _router: Router,
    private _requestQ: RequestqService
  ) { 
    // Form Initialization
    this.createFormRequestQuoteGroup();
  }

  ngOnInit(): void {
    this.execImportantMethods();
    this.search( this.pageIndex );
  }

  // get bodyInvalid() {
  //   return this.requestQuoteFormGroup.get('body')!.invalid && (this.requestQuoteFormGroup.get('body')!.dirty || this.requestQuoteFormGroup.get('body')!.touched);
  // }

  // get brandInvalid() {
  //   return this.requestQuoteFormGroup.get('brand')!.invalid && (this.requestQuoteFormGroup.get('brand')!.dirty || this.requestQuoteFormGroup.get('brand')!.touched);
  // }
  
  // get modelInvalid() {
  //   return this.requestQuoteFormGroup.get('model')!.invalid && (this.requestQuoteFormGroup.get('model')!.dirty || this.requestQuoteFormGroup.get('model')!.touched);
  // }

  get prospectorNameInvalid() {
    return this.requestQuoteFormGroup.get('prospectorName')!.invalid && (this.requestQuoteFormGroup.get('prospectorName')!.dirty || this.requestQuoteFormGroup.get('prospectorName')!.touched);
  }
  
  get prospectorSurnameInvalid() {
    return this.requestQuoteFormGroup.get('prospectorSurname')!.invalid && (this.requestQuoteFormGroup.get('prospectorSurname')!.dirty || this.requestQuoteFormGroup.get('prospectorSurname')!.touched);
  }
  
  get placeProspectionInvalid() {
    return this.requestQuoteFormGroup.get('placeProspection')!.invalid && (this.requestQuoteFormGroup.get('placeProspection')!.dirty || this.requestQuoteFormGroup.get('placeProspection')!.touched);
  }
  
  get nextInvalid() {
    return this.requestQuoteFormGroup.get('next')!.invalid && (this.requestQuoteFormGroup.get('next')!.dirty || this.requestQuoteFormGroup.get('next')!.touched);
  }
  
  
  get nameInvalid() {
    return this.requestQuoteFormGroup.get('name')!.invalid && (this.requestQuoteFormGroup.get('name')!.dirty || this.requestQuoteFormGroup.get('name')!.touched);
  }
  
  get surnameInvalid() {
    return this.requestQuoteFormGroup.get('surname')!.invalid && (this.requestQuoteFormGroup.get('surname')!.dirty || this.requestQuoteFormGroup.get('surname')!.touched);
  }
  
  get emailInvalid() {
    return this.requestQuoteFormGroup.get('email')!.invalid && (this.requestQuoteFormGroup.get('email')!.dirty || this.requestQuoteFormGroup.get('email')!.touched);
  }
  
  get phoneInvalid() {
    return this.requestQuoteFormGroup.get('phone')!.invalid && (this.requestQuoteFormGroup.get('phone')!.dirty || this.requestQuoteFormGroup.get('phone')!.touched);
  }
  
  // get buyTypeInvalid() {
  //   return this.requestQuoteFormGroup.get('buyType')!.invalid && (this.requestQuoteFormGroup.get('buyType')!.dirty || this.requestQuoteFormGroup.get('buyType')!.touched);
  // }
  
  // get wantReleaseInvalid() {
  //   return this.requestQuoteFormGroup.get('wantRelease')!.invalid && (this.requestQuoteFormGroup.get('wantRelease')!.dirty || this.requestQuoteFormGroup.get('wantRelease')!.touched);
  // }
  
  // get initialCreditInvalid() {
  //   return this.requestQuoteFormGroup.get('initialCredit')!.invalid && (this.requestQuoteFormGroup.get('initialCredit')!.dirty || this.requestQuoteFormGroup.get('initialCredit')!.touched);
  // }
  
  // get WhatsCurrentProfessionalSituationInvalid() {
  //   return this.requestQuoteFormGroup.get('WhatsCurrentProfessionalSituation')!.invalid && (this.requestQuoteFormGroup.get('WhatsCurrentProfessionalSituation')!.dirty || this.requestQuoteFormGroup.get('WhatsCurrentProfessionalSituation')!.touched);
  // }

  public onSubmit() {
    // Change spinner
    this.spinner = true;

    // Launch request
    let body = 'Prospección';
    let brand = 'Prospección';
    let model = 'Prospección';
    let prospectorName = this.requestQuoteFormGroup.get('prospectorName')?.value;
    let prospectorSurname = this.requestQuoteFormGroup.get('prospectorSurname')?.value;
    let placeProspection = this.requestQuoteFormGroup.get('placeProspection')?.value;
    let name = this.requestQuoteFormGroup.get('name')?.value;
    let surname = this.requestQuoteFormGroup.get('surname')?.value;
    let email = this.requestQuoteFormGroup.get('email')?.value;
    let phone = this.requestQuoteFormGroup.get('phone')?.value;
    // let buyType = this.requestQuoteFormGroup.get('buyType')?.value;
    let buyType = 'Prospección';
    let next = this.requestQuoteFormGroup.get('next')?.value;
    // let initialCredit = this.requestQuoteFormGroup.get('initialCredit')?.value;
    // let WhatsCurrentProfessionalSituation = this.requestQuoteFormGroup.get('WhatsCurrentProfessionalSituation')?.value;
    let commentaryLead = this.requestQuoteFormGroup.get('commentaryLead')?.value;
    // console.log(body, brand, model, name, surname, email, phone, buyType, wantRelease, initialCredit, WhatsCurrentProfessionalSituation, commentaryLead);
    
    // Genera la requisición de la cotización
    // this._requestQ.setQuoteRequest(body, brand, model, name, surname, email, phone, buyType, wantRelease, initialCredit, WhatsCurrentProfessionalSituation, commentaryLead)
    this._requestQ.setQuoteRequest(body, brand, model, prospectorName, prospectorSurname, placeProspection, name, surname, email, phone, buyType, next, commentaryLead) /** initialCredit, WhatsCurrentProfessionalSituation, */
    .subscribe({
      next: (sheetQ: Sheetquote) => {
        if (sheetQ.code === '200' && sheetQ.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Formulario enviado correctamente',
            // text: `Nos pondremos en contacto contigo lo antes posible para seguir con el proceso de Adquirir tu Auto.`,
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });

          setTimeout(() => {
            // this._router.navigateByUrl('/saved-process');
            window.location.reload();
          }, 2000);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Ooopppps!',
            text: `Algo fue mal, por favor intenta de nuevo.`,
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });

          this.spinner = false;
        }
      }
    });
  }

  /**
   * Form Initialization
   */
  private createFormRequestQuoteGroup(){
    this.requestQuoteFormGroup = this._formBuilder.group({
      // body: ['', [Validators.required]],
      // brand: ['', [Validators.required]],
      // model: ['', [Validators.required]],
      body: ['Prospección'],
      brand: ['Prospección'],
      model: ['Prospección'],
      prospectorName: ['', [Validators.required]],
      prospectorSurname: ['', [Validators.required]],
      // placeProspection: ['', [Validators.required]],
      placeProspection: [{value: null, disabled: this.isDisabled}],
      next: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      surname: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      email: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      phone: ['', [Validators.required, Validators.pattern("[0-9]{10}"), Validators.minLength(10), Validators.maxLength(10)]],
      // buyType: ['', [Validators.required]],
      // wantRelease: ['', [Validators.required]],
      // initialCredit: ['', [Validators.required]],
      // WhatsCurrentProfessionalSituation: ['', [Validators.required]],
      buyType: ['Prospección'],
      wantRelease: [null],
      initialCredit: [null],
      WhatsCurrentProfessionalSituation: [null],
      commentaryLead: [null],
      checkbox: [false, Validators.required]
    });
  }

  titleCase(str: string) {
    return str.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }

  private execImportantMethods(){
    let stringBrands = this.brands.join().length > 0 ? this.brands.join() : 'vacio';
    let stringModels = this.models.join().length > 0 ? this.models.join() : 'vacio';
    let stringYears = this.years.join().length > 0 ? this.years.join() : 'vacio';
    let stringStates = this.states.join().length > 0 ? this.states.join() : 'vacio';
    let stringTransmissions = this.transmissions.join().length > 0 ? this.transmissions.join() : 'vacio'; 

    let arrayCarrocerias:number[] = [];
    arrayCarrocerias.push(this.brand_id);

    let stringCarrocerias = arrayCarrocerias.join().length > 0 ? arrayCarrocerias.join() : 'vacio';
    
    // Obtener marcas del servicio
    this._compraTuAutoService.getBrands(stringModels, stringYears, stringCarrocerias, 250000, 3000000, stringStates, stringTransmissions)
    .subscribe({
      next: ( dataBrands: DataBrands) => {
        if (!this.brandTotal) {
          this.brandTotal = true;
        } else {
          this.my_brands = dataBrands.brands
        }
        
        this.allBrands = [];

        dataBrands.brands.map( brand => {
          if (!this.existsInArray( this.brands, this.titleCase(brand.name))) {
            this.allBrands.push( brand.name );
          }
          this.filteredBrands = this.brandCtrl.valueChanges.pipe(startWith(null),
            map((brand: string | null) => brand ? this._filterBrands(brand) : this.allBrands.slice()));
        });
      }
    });

    // Obtener modelos del servicio
    this._compraTuAutoService.getModels( stringBrands, stringYears, stringCarrocerias, 250000, 3000000, stringStates, stringTransmissions)
    .subscribe({
      next: ( dataModels: DataModels) => {
        this.allModels = [];

        dataModels.models.map( model => {
          if( !this.existsInArray( this.models, this.titleCase(model.name)) ){
            this.allModels.push( model.name );
          }
          this.filteredModels = this.modelCtrl.valueChanges.pipe(startWith(null),
            map((model: string | null) => model ? this._filterModels(model) : this.allModels.slice()));
        });
      }
    });

    // Obtener years del servicio
    this._compraTuAutoService.getYears( stringBrands, stringModels, stringCarrocerias, 250000, 3000000, stringStates, stringTransmissions )
    .subscribe({
      next: ( dataYears: DataYears ) => {
        this.allYears = [];

        dataYears.years.map( year => {
          if( !this.existsInArray( this.years, `${year.yearModel}`) ){
            this.allYears.push(`${year.yearModel}`);
          }
          this.filteredYears = this.yearCtrl.valueChanges.pipe(startWith(null),
            map((year: string | null) => year ? this._filterYears(year) : this.allYears.slice()));
        });
      }
    });

    // Get vehiclebodies
    this._compraTuAutoService.getVehicleBodies( stringBrands, stringModels, stringYears, 250000, 3000000, stringStates, stringTransmissions )
    .subscribe({
      next: (dataVehicleBody: DataVehicleBody) => {
        this.allCarrocerias = [];

        dataVehicleBody.vehiclebodies.map( carroceria => {
          if (carroceria.id !== 13) {
            this.allCarrocerias.push(carroceria);
          }
        });

        for (let i = 0; i < this.allCarrocerias.length; i++) {
          switch (this.allCarrocerias[i].name) {
            case 'coupé':
              this.allCarrocerias[i].name = 'coupe'
              break;
            case 'sedán':
              this.allCarrocerias[i].name = 'sedan'
              break;
            case 'camión':
              this.allCarrocerias[i].name = 'camion'
              break;
            default:
              break;
          }
        }
        
        if( this.allCarrocerias.length == 0 ){
          this.brands = [];
          this.years = [];
          this.models = [];
          this.carrocerias = [];
        }
      }
    });

    // Obtener states del servicio
    this._compraTuAutoService.getStates( stringBrands, stringModels, stringCarrocerias, stringYears, 250000, 3000000, stringTransmissions )
    .subscribe({
      next: ( dataStates: DataStates ) => {
        this.allStates = [];

        dataStates.states.map( state => {
          if( !this.existsInArray( this.states, this.titleCase(state.name)) ){
            this.allStates.push(state.name);
          }
          this.filteredStates = this.stateCtrl.valueChanges.pipe(startWith(null),
            map((state: string | null) => state ? this._filterStates(state) : this.allStates.slice()));
        });
      }
    });

    // Obtener transmisiones del servicio
    this._compraTuAutoService.getTransmissions( stringBrands, stringModels, stringCarrocerias, stringYears, 250000, 3000000 , stringStates)
    .subscribe({
      next: ( dataTransmissions: DataTransmissions ) => {
        this.allTransmissions = [];

        dataTransmissions.transmissions.map( transmission => {
          if( !this.existsInArray( this.transmissions, this.titleCase(transmission.transmission)) ){
            this.allTransmissions.push(transmission.transmission);
          }
          this.filteredTransmissions = this.transmissionCtrl.valueChanges.pipe(startWith(null),
            map((transmission: string | null) => transmission ? this._filterTransmissions(transmission) : this.allTransmissions.slice()));
        });
      }
    });
  }

  public selected( event: any, input: string): void {
    this.palabra_busqueda = '';
    this.my_vehicle = false;
    this.brands = [];
    // console.log(event);
    
    switch (input) {
      case 'brands':
        this.brands.push(this.requestQuoteFormGroup.controls.brand.value);
        break;
    
      default:
        break;
    }
    
    this.execImportantMethods();
    this.search(1);
  }

  public search( page: number ) {
    this.executeSearch( page );
  }

  public executeSearch( page: number ) {
    
    let stringBrands = this.brands.join().length > 0 ? this.brands.join() : 'vacio';
    let stringModels = this.models.join().length > 0 ? this.models.join() : 'vacio';
    let stringYears = this.years.join().length > 0 ? this.years.join() : 'vacio';
    let stringStates = this.states.join().length > 0 ? this.states.join() : 'vacio';
    let arrayCarrocerias:number[] = [];

    arrayCarrocerias.push(this.brand_id);
    
    let stringCarrocerias = arrayCarrocerias.join().length > 0 ? arrayCarrocerias.join() : 'vacio';
    
    let stringTransmisiones = this.transmissions.join().length > 0 ? this.transmissions.join() : 'vacio';

    this._compraTuAutoService.getVehicles( this.pageSize, stringBrands, stringModels, stringYears,
                                          stringCarrocerias, 250000, 3000000, this.palabra_busqueda.length > 0 ? this.palabra_busqueda : 'a',
                                           this.orden, page, stringStates, stringTransmisiones)
    .subscribe({
      next: ( response ) => {
        if (!this.my_vehicle) {
          this.vehicles = response.vehicles.data;
          console.log(this.vehicles);
        }
      }
    });
  }

  public getVehicle(vin: string){
    this._detailService.getVehicleByVin(vin)
    .subscribe({
      next: (vehicleData: VehicleData) => {
        this.vehicle = vehicleData.vehicle;
        console.log(vehicleData.vehicle);
        this.imagesForSlider = [];
        this.priceOffer = vehicleData.vehicle.priceOffer != null ? true : false;
        this.description = vehicleData.vehicle.description!;
        vehicleData.vehicle.vehicle_images.map( imagen => {
          this.imagesForSlider.push(
            { path: this.baseUrl + '/api/image_vehicle/' + imagen.path }
          );
        });
        this.carouselSwiper();
        if (this.description != null) {
          let d = this.description.includes('\n\n') ? true : false;
          if (d) {
            this.descriptions = this.description.split('\n\n');
            this.descriptions.pop();
          }else {
            this.descriptions = this.description.split('\n');
            this.descriptions.pop();
          }
        } else {
          this.descriptions = ["Lo sentimos, este vehículo no cuenta con alguna descripción activa."]
        }
      }
    });
    this.table_view = true;
  }

  public carouselSwiper(){
    this.swiperThumbs2 = new Swiper('.my-swiper-thumbs-2', {
      modules: [Navigation],
      spaceBetween: 10,
      slidesPerView: 4,
      loop: true,
      loopPreventsSliding: false,
      slideToClickedSlide: true,
      // navigation: {
      //   prevEl: '#btn_previous_thumb',
      //   nextEl: '#btn_next_thumb'
      // }
    });
    this.swiperThumbs2.on('beforeInit', function(){
      let imgOriginal = <HTMLElement>document.querySelector(".my-swiper-thumbs-1")?.querySelector('.swiper-slide-active')?.querySelector(".img-swiper-thumbs-1"),
          imgCopia = <HTMLElement>document.querySelector("#img-2");
          imgCopia.style.background = imgOriginal.style.background;
    });

    this.configSwiperT = {
      modules: [Navigation, Zoom],
      zoom: true,
      direction: 'horizontal',
      spaceBetween: 10,
      slidesPerView: 'auto',
      // navigation: false
      navigation: {
        prevEl: '#btn_previous_thumb',
        nextEl: '#btn_next_thumb'
      }
    };

    this.swiperThumbs1 = new Swiper('.my-swiper-thumbs-1', this.configSwiperT);
    this.swiperThumbs1.on('slideChangeTransitionEnd', () => {
      let index_currentSlide = this.swiperThumbs1.realIndex;
      this.swiperThumbs2.slideTo(index_currentSlide, 0, false);
    });

    this.swiperThumbs2.on('slideChangeTransitionEnd', () => {
      let index_currentSlide = this.swiperThumbs2.realIndex;
      this.swiperThumbs1.slideTo(index_currentSlide, 0, false);
    });
    this.zoomer();
  }

  public zoomer(){
    let zooms = <HTMLElement> document.querySelector("#div-zoom");

    $('.col-12-swiper-thumbs').on('mousemove', function(e: any){
      let
        original = <HTMLElement>this.querySelector(".my-swiper-thumbs-1")?.querySelector('.swiper-slide-active')?.querySelector(".img-swiper-thumbs-1"),
        magnified = <HTMLElement>this.querySelector(".my-swiper-thumbs-1")?.querySelector('.swiper-slide-active')?.querySelector("#img-2"),
        style = magnified.style,
        x = e.pageX-this.offsetLeft,
        y = e.pageY-this.offsetTop,
        imgWidth = original.offsetWidth,
        imgHeight = original.offsetHeight,
        xperc = ((x/imgWidth) * 100),
        yperc = ((y/imgHeight) * 100);

        if(x > (.01 * imgWidth)){
          xperc += (.15*xperc);
        };
        if(y >= (.01 * imgHeight)){
          yperc += (.15*yperc);
        };

        style.backgroundPositionX = (xperc - 9) + '%';
        style.backgroundPositionY = (yperc - 9) + '%';

        style.left = (x - 180) + 'px';
        style.top = (y - 180) + 'px';
        zooms.style.background = magnified.style.background;
        zooms.removeAttribute('div-zoom-no-active');
        zooms.setAttribute('class', 'div-zoom-active');
    });
    $('.col-12-swiper-thumbs').on('mouseout', function(){
      zooms.removeAttribute('div-zoom-active');
      zooms.setAttribute('class', 'div-zoom-no-active');
    });
  }

  public bodyWorkIsSelected( carroceria: Vehiclebody ): boolean {
    let exists = false;
    this.carrocerias.find( bodywork => {
      if( bodywork.id == carroceria.id){
        exists = true;
      }
    });
    return exists;
  }

  public selectBodyWork(carroceria: Vehiclebody){
    this.palabra_busqueda = '';
    this.brand_id = carroceria.id;
    this.execImportantMethods();
    this.search(1);
  }
  
  public getModels(brand_id: number){
    // this._venderTuAutoService.getModels(brand_id)
    // .subscribe({
    //   next: ({ code, models }: DataModels) => {
    //     this.myModels = (code === 200) ? models : [];
    //   }
    // });
    // this.execImportantMethods();
  }

  /**
   * Filter models
   */
  private _filterBrands( value: string ): string[] {
    const filterValue = value.toLowerCase();    
    return this.allBrands.filter(element => element.toLowerCase().includes(filterValue));                    
  }

  private _filterModels( value: string ): string[] {
    const filterValue = value.toLowerCase();    
    return this.allModels.filter(element => element.toLowerCase().includes(filterValue));                    
  }

  private _filterYears( value: string ): string[] {
    const filterValue = value.toLowerCase();    
    return this.allYears.filter(element => element.toLowerCase().includes(filterValue));                    
  }

  private _filterStates( value: string ): string[] {
    const filterValue = value.toLowerCase();    
    return this.allStates.filter(element => element.toLowerCase().includes(filterValue));                    
  }

  private _filterTransmissions( value: string ): string[] {
    const filterValue = value.toLowerCase();    
    return this.allTransmissions.filter(element => element.toLowerCase().includes(filterValue));                    
  }

  public existsInArray( arreglo:any[], elemento:any ): boolean {   
      let exists = false;
      arreglo.find( element => {
        if( element == elemento ){
          exists = true;        
        }
      });   
      return exists;
  }

  /**
   * Checking length input
   * @param object any input
   */
  public maxLengthCheck(object: any) {
    if (object.value.length > object.maxLength) {
      object.value = object.value.slice(0, object.maxLength)
    }
  }

}
