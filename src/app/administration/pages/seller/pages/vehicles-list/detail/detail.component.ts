import { Component, ElementRef, NgModule, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Meta } from '@angular/platform-browser';

// Angular Material
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar as MatSnackBar } from '@angular/material/snack-bar';

// Services 
import { DetailService } from '../../../services/detail.service';

// Components
import { AskInformationComponent } from '../../../components/ask-information/ask-information.component';

// Interfaces
import { VehicleData, Vehicle, Image, Shield, LocationData } from '../../../interfaces/vehicle_data.interface'; 
import { RecommendedCarsData } from '../../../interfaces/recommended_cars_data.interface';
import { Swiper, Navigation, Autoplay, SwiperOptions, Thumbs, Controller, Zoom} from 'swiper'

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})

export class DetailComponent implements OnInit {

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
    this._activatedRoute.params
    .subscribe({
      next: (params) => {
        this.scrollTop();

        this.vin = params['vin'];
        this.vehicle != undefined ? this.vehicle.vehicle_images = [] : '';
        
        this.getVehicle();
        this.getRecommendedCarsByVin();
      }
    });
  }
  
  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }

  public notFound(){
    this._router.navigateByUrl('404');
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
        } else {
          
          this.imagesForSlider = [];
          this.priceOffer = this.vehicle.priceOffer != null ? true : false;
          this.description = this.vehicle.description!;
          this.shields = vehicleData.vehicle.shields;
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
        }
               
      },
      error: () => {
        this._router.navigateByUrl('/404');
      }
    });
        
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
}
