import { Component, ElementRef, NgModule, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Meta } from '@angular/platform-browser';
import { Output, EventEmitter } from '@angular/core';

// Angular Material
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar as MatSnackBar } from '@angular/material/snack-bar';

// Services 
import { DetailService } from '../../services/detail/detail.service';

// Components
import { MethodsAcquiringComponent } from '../../components/methods-acquiring/methods-acquiring.component';
import { NotificationReservedComponent } from '../../components/notification-reserved/notification-reserved.component';
import { AskInformationComponent } from '../../components/ask-information/ask-information.component';

// Interfaces
import { VehicleData, Vehicle, Image, Shield, LocationData } from './../../interfaces/detail/vehicle_data.interface'; 
import { RecommendedCarsData } from '../../interfaces/detail/recommended_cars_data.interface';
import { Swiper, Navigation, Autoplay, SwiperOptions, Thumbs, Controller, Zoom} from 'swiper'
import { UserById } from '../../interfaces/detail/user.interface';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})

export class DetailComponent implements OnInit, OnDestroy {

  // References of Help
  public pageVehicle: string = '';
  public baseUrl: string = environment.baseUrl;

  // References of Button
  public route: boolean = false;
  public locationVeh!:LocationData[];
  // References Vehicle
  public vin!:string;
  public vehicle!: Vehicle;
  public imagesForSlider: Image[] = [];  
  public shields: Shield[] = [];
  public pathStockBrand: string = '';
  public pathStockCarmodel: string = '';
  public description: string = '';
  public descriptions!: string[];
  public priceOffer: boolean = false;

  public legalDate: Date;
  
  // References seller
  public userId!:string;

  // Recommended vehicles
  public recommended_vehicle: Vehicle[] = [];
  
  // References Carousel
  private _positionCarousel: number = 0;
  @ViewChild('carousel') carousel!: any;
  @ViewChild('carouselPreviews') carouselPreviews!: any;
  @ViewChild('divZoom') zoomDiv! : any;

  //@ViewChild('.swiper') swiper!:Swiper;
  public configSwiperV!: SwiperOptions;
  public configSwiperT!: SwiperOptions;
  public swiper!: Swiper;
  public swiperThumbs1!: Swiper;
  public swiperThumbs2!: Swiper;

  openAccordions: { [key: string]: boolean } = {};
  
  constructor(
    private _bottomSheet: MatBottomSheet,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _detailService: DetailService,
    private _snackBar: MatSnackBar,
    private meta: Meta
  ) { 
    // Assign active route for shared button    
    this.pageVehicle = window.location.href;
  }
  
  ngOnInit(): void {
    let date = new Date();
    this.legalDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    this._activatedRoute.params
    .subscribe({
      next: (params) => {
        this.scrollTop();

        this.vin = params['vin'];
        this.userId = params['userId'];

        this.vehicle != undefined ? this.vehicle.vehicle_images = [] : '';
        
        this.getVehicle();
        this.getRecommendedCarsByVin();
        this.getSeller();
        
      
        
      }
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.destroyMetaTags();

  }
  
  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }

  public notFound(){
    this._router.navigateByUrl('404');
  }
  /**
   * Function Open Bottom Sheet
   */
  public openBottomSheet(vin: string) {
    this._bottomSheet.open(MethodsAcquiringComponent, {
      data: { id: vin }
    });
  }

  /**
   * Function Open Bottom Sheet Notificaction Reserved
   */
  public openBottomSheetNotificationReserved(vehicle: Vehicle) {
    this._bottomSheet.open(NotificationReservedComponent, {
      data: { 
        brand: vehicle.carmodel.brand.name,
        id: vehicle.id
      }
    });
  }

  /**
   * Button for Copy url active to shared button
   */
  public openSnackBarCopy() {  
    // Lauch Snackbar
    this._snackBar.open('Copiado', '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 2000,
      panelClass: ['snackbar']
    });    
  }

  /**
   * Get information vehicle for detail
   */
  public getVehicle() {
    
    this._detailService.getVehicleByVin(`${ this.vin }`)
    .subscribe({
      next: ( vehicleData: VehicleData ) => {
        
        this.vehicle = vehicleData.vehicle;
        
        if( vehicleData.vehicle == null || this.vehicle.status != 'active'){
          this.notFound();
          this.outOfStockTags( false );
        } else {
          
          this.imagesForSlider = [];
          this.priceOffer = this.vehicle.priceOffer != null ? true : false;
          this.description = this.vehicle.description!;
          this.shields = vehicleData.vehicle.shields;

          // Set path route for stock redirect with Brand or Carmodel
          this.pathStockBrand = `${ vehicleData.vehicle.carmodel.brand.name.toLocaleLowerCase() }/sin-modelos/sin-anios/3000000/sin-carrocerias/sin-estados/sin-busqueda/sin-transmisiones/1`;
          this.pathStockCarmodel = `${ vehicleData.vehicle.carmodel.brand.name.toLocaleLowerCase() }/${ vehicleData.vehicle.carmodel.name.toLowerCase() }/sin-anios/3000000/sin-carrocerias/sin-estados/sin-busqueda/sin-transmisiones/1`;

          this.vehicle.vehicle_images.map( imagen => {
            this.imagesForSlider.push(
              { path: this.baseUrl + '/api/image_vehicle/' + imagen.path }
            );
          });

          // Checking choice
          this.route = (vehicleData.vehicle.choices.length > 0) ? true : false;

          this._detailService.getLocationvehiclesId(this.vehicle.id).subscribe({
            next:(locat: any)=>{
              if(locat.length > 0){
                this.locationVeh = locat[0].name;
              }
            }
          });

          
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
            this.descriptions = ["Lo sentimos, este vehículo no cuenta con alguna descripción activa."];
          }
          
          // if ( this.vehicle.vehicle_images.length == 0 ) {
          //   this.imagesForSlider.push(
          //     { path: this.baseUrl + '/api/image_vehicle/vacio' }
          //   );
          // }

          // this.vehicle.vehicle_images.map( imagen => {
          //   if( imagen.external_website === "yes" ){
          //     this.imagesForSlider.push(
          //       { path: imagen.path }
          //     );
          //   }else{
          //     this.imagesForSlider.push(
          //       { path: this.baseUrl + '/api/image_vehicle/' + imagen.path }
          //     );
          //   }
          // });

          if(this.vehicle.status == 'active'){
            this.addMetaTags();
          }else{
            this.outOfStockTags(true);
          } 

          // Get element ref carousel
          /* const element = this.carousel.elementRef.nativeElement;
          
          // Carousel Buttons Previous & Next
          if (element[2].childNodes[0] && element[2].childNodes[1]) {
            element[2].childNodes[1].onclick = () => this.nextCarousel();
            element[2].childNodes[0].onclick = () => this.previusCarousel();          
          } */
        }
               
      },
      error: (error) => {
        console.log(error);
        this._router.navigateByUrl('/404');
      }
    });
        
  }

  /**
   * Process User for Seller Id
   */
  private getSeller(){
    if(this.userId != undefined){
      this._detailService.sellerById(Number(this.userId))
      .subscribe({
        next: ( userById: UserById) => {
          let {user} = userById
                        
          if(user != undefined){
            let {roles} = user;

            if(roles[0].name == 'seller'){
              // Segment to send seller spreadsheet
            } else {
              this.notFound();
            }
          } else {
            this.notFound();
          }

        },
        error: () => {
          this.notFound();
        }
      });
    }
  }


  private addMetaTags(){      
    this.meta.addTag({ content: 'in stock', property:'product:availability' }, true);
    this.propertiesMetaTags();
  } 

  private propertiesMetaTags(){
    this.meta.addTag({ content: this.vehicle.name, property: 'og:title' }, true);
    this.meta.addTag({ content: this.vehicle.description, property:'og:description' }, true);
    this.meta.addTag({ content: this.pageVehicle, property:'og:url'}, true);
    this.meta.addTag({ content: this.imagesForSlider[0].path, property:'og:image' }, true);
    this.meta.addTag({ content: this.vehicle.carmodel.brand.name, property:'product:brand' }, true);    
    this.meta.addTag({ content: 'used', property:'product:condition' }, true);
    this.meta.addTag({ content: `${this.vehicle.price}`, property:'product:price:amount' }, true);
    this.meta.addTag({ content: 'MXN', property:'product:price:currency' }, true);
    if( this.vehicle.priceOffer != null && this.vehicle.priceOffer > 0 ){
      this.meta.addTag({ content: `${this.vehicle.priceOffer}`, property:'product:sale_price:amount' }, true);
      this.meta.addTag({ content: 'MXN', property:'product:sale_price:currency' }, true);
    }    
    if( this.vehicle.vehiclebody != null ){      
      this.meta.addTag({ content: `${this.vehicle.vehiclebody.name}`, property:'product:custom_label_0' }, true);
    }
    this.meta.addTag({ content: `facebook_vehicle_${ this.vehicle.id }`, property:'product:retailer_item_id' }, true);
    this.meta.addTag({ content: `fb_vehicle_${ this.vehicle.id }`, property:'product:item_group_id' }, true);
    this.meta.addTag({ content: '888', property:'product:category' }, true);
  }

  private outOfStockTags( exists:boolean ){
    if( exists ){
      this.propertiesMetaTags();
    }
    this.meta.addTag({ content: 'out of stock', property:'product:availability' }, true);
  }

  private destroyMetaTags(){ 
    if( this.vehicle != undefined && this.vehicle.priceOffer != null && this.vehicle.priceOffer > 0 ){
      this.deleteExistsMeta("property='product:sale_price:amount'");
      this.deleteExistsMeta("property='product:sale_price:currency'");      
    }
    
    if( this.vehicle != undefined && this.vehicle.vehiclebody != null ){     
      this.deleteExistsMeta("property='product:custom_label_0'");       
    }
    
    this.deleteExistsMeta('property="og:title"');
    this.deleteExistsMeta('property="og:description"');
    this.deleteExistsMeta('property="og:url"');
    this.deleteExistsMeta('property="og:image"');
    this.deleteExistsMeta('property="product:brand"');
    this.deleteExistsMeta('property="product:availability"');
    this.deleteExistsMeta('property="product:condition"');
    this.deleteExistsMeta('property="product:price:amount"');
    this.deleteExistsMeta('property="product:price:currency"');
    this.deleteExistsMeta('property="product:retailer_item_id"');
    this.deleteExistsMeta('property="product:item_group_id"');
    this.deleteExistsMeta('property="product:category"');        
  }
   
  private deleteExistsMeta( attrSelector:string ){
    if(this.meta.getTag( attrSelector ) != null){
      
      this.meta.removeTag(attrSelector);
    }    
  }

  public getRecommendedCarsByVin(){
    this._detailService.getRecommendedCarsByVin( this.vin )
    .subscribe({
      next: ( recommendedCarsData: RecommendedCarsData ) => {
        this.recommended_vehicle = recommendedCarsData.vehicles;
        this.carouselSwiper();
      }
    });
  }

  /**
   * Show Picture Selected
   * @param position Number
   */
  public showPictureSelected(position: number) { 
    // Set new position
    this._positionCarousel = position;
    
    // Get childrens of carousel (Counter & Container)
    const carousel = this.carousel.elementRef.nativeElement.children;

    // Set Carousel Counter    
    carousel[0].innerText = `${ position + 1 } / ${ this.imagesForSlider.length }`;    
    
    // Client Width for transform translate in X
    const widthPosition: number = this.carousel.elementRef.nativeElement.clientWidth;

    // Set Previous Picture    
    carousel[1].children[0].style.transform = "700ms ease-out 0s";
    carousel[1].children[0].style.transform = `translateX(-${ position * (widthPosition + 10) }px)`;
  }

  /**
   * Previus Carousel Method
   */
  private previusCarousel() {    
    if (this._positionCarousel != undefined) {        
      if (this._positionCarousel > 0) {        
        this.showPictureSelected(this._positionCarousel - 1);
      }
    }
  }

  /**
   * Next Carousel Method
   */
  private nextCarousel() {
    this._positionCarousel = this._positionCarousel + 1;
    
    if (this._positionCarousel != undefined) {        
      if (this._positionCarousel < this.imagesForSlider.length) {
        this.showPictureSelected(this._positionCarousel);
      }
    }
  }

  /**
   * Ask Information Vehicle
   */
  public askInformation(vehicle: Vehicle) {
    this._bottomSheet.open(AskInformationComponent, {
      data: { 
        vehicle_id: vehicle.id,
        vehicle: vehicle.name,
        brand: vehicle.carmodel.brand.name,
        year: vehicle.yearModel,
        branch_name: vehicle.branch.name
      }
    });
  }

  public saveVehicleLS(){
    localStorage.setItem("vehicle", JSON.stringify(this.vehicle));
  }

  public carouselSwiper(){
    const buttonNext = document.querySelector('#btn_next_v')!;
    const buttonPrev = document.querySelector('#btn_previous_v')!;
    this.configSwiperV = {
      modules: [Autoplay],
      direction: 'horizontal',
      slidesPerView: 'auto',
      loop: true,
      // autoplay: {
      //   delay: 0,
      //   disableOnInteraction: true,
      // },
      loopPreventsSliding: false,
      speed: 100,
      spaceBetween: 10,
    };
    this.swiper = new Swiper('.my-swiper-v', this.configSwiperV); 
    if(buttonNext && buttonPrev){
      buttonNext.addEventListener('click', () => {
        this.swiper.slideNext(1000);
      });
      buttonPrev.addEventListener('click', () => {
        this.swiper.slidePrev(1000);
      });
    }
    
    this.swiperThumbs2 = new Swiper('.my-swiper-thumbs-2', {
      modules: [Navigation],
      spaceBetween: 10,
      slidesPerView: 4,
      loop: true,
      loopPreventsSliding: false,
      slideToClickedSlide: true,
      navigation: {
        prevEl: '#btn_previous_thumb',
        nextEl: '#btn_next_thumb'
      }
    });
    this.swiperThumbs2.on('beforeInit', function (){
      let imgOriginal = <HTMLElement>document.querySelector(".my-swiper-thumbs-1")?.querySelector('.swiper-slide-active')?.querySelector(".img-swiper-thumbs-1"),
          imgCopia = <HTMLElement>document.querySelector("#img-2");
          imgCopia.style.background = imgOriginal.style.background;
    });
    this.configSwiperT = {
      modules: [Navigation, Zoom],
      zoom: true, //Por ahora este zoom sería el indicado para móviles, para escritorio se quedaría el otro zoom de la funcion zoom().
      direction: 'horizontal',
      spaceBetween: 10,
      slidesPerView: 'auto',
      /*zoom: true,
      breakpoints: {
        1200: {
          zoom: false
        }
      },*/
      navigation: false
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

  public swiperZoom(){
    $(".col-12-swiper-thumbs").on("mouseover", function() 
    {
      $(this).children(".my-swiper-thumbs-1").css({ transform: "scale(2)" });
    })
    .on("mouseout", function() 
    {
      $(this).children(".my-swiper-thumbs-1").css({ transform: "scale(1)" });
    })
    .on("mousemove", function(e) 
    {
      $(this).children(".my-swiper-thumbs-1")
        .css({
          "transform-origin":
            ((e.pageX - $(this).offset()!.left) / $(this).width()!) * 100 +
            "% " +
            ((e.pageY - $(this).offset()!.top) / $(this).height()!) * 100 +
            "%"
        });
    });
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

  public toggleAccordion(collapseId: string): void {
    this.openAccordions[collapseId] = !this.openAccordions[collapseId];
  }

  public isAccordionOpen(collapseId: string): boolean {
    return this.openAccordions[collapseId];
  }
}
