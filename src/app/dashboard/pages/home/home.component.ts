import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { UntypedFormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Swiper, Navigation, Pagination, SwiperOptions, Autoplay, Zoom } from 'swiper'


// Angular Material
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent as MatChipInputEvent } from '@angular/material/chips';

// Services
import { HomeService } from './../../services/home.service';

// Interfaces
import { RandomVehiclesData, Vehicle } from './../../interfaces/random_vehicles.interface';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  public randomVehicles:Vehicle[] = [];

  // References "Modelos"
  public allModels: string[] = ['Cavalier', 'Tahoe', 'Onix', 'Suburban', 'Trax'];
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public filteredModels: Observable<string[]>;
  public modelCtrl = new UntypedFormControl();
  public models: string[] = ['Aveo'];
  public selectable = true;
  public removable = true;

  @ViewChild('modelInput') modelInput!: ElementRef<HTMLInputElement>;

  // References "¿Cuál es el auto que buscas?"
  public paymenyTickInterval = 1;  
  public paymenyMax = 12;
  public paymenyMin = 2;
  public paymenyStep = 2;
  public paymenyValue = 2;

  // References "Enganche"
  public hitchTickInterval = 1;  
  public hitchMax = 200000;
  public hitchMin = 20000;
  public hitchStep = 1;
  public hitchValue = 20000;  

  public brandImages: Array<{src: string, alt: string}> = [];

  constructor(private _homeService: HomeService, private titleService: Title, private metaService: Meta) {
    // Set Title View
    this.titleService.setTitle('ABCars | Compra o Venta de vehículos seminuevos en México.');
    this.metaService.updateTag({ name: 'description', content: '¡Entra y busca tu seminuevo en ABCars.mx!' });

    this.filteredModels = this.modelCtrl.valueChanges.pipe(startWith(null),
        map( (model: string | null) => model ? this._filter(model) : this.allModels.slice() ));
  }

  ngOnInit(): void {
    this.getRandomVehicles();
    this.scrollTop();
    this.homeSwiperCarousel();
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }

  /**
   * Add Models
   */
  public add( event: MatChipInputEvent ): void {
    const value = (event.value || '').trim();

    // Add our model
    if (value) {
      this.models.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
    this.modelCtrl.setValue(null);
  }
  
  /**
   * Remove Models
   */
  public remove( model: string ): void {
    const index = this.models.indexOf(model);

    if (index >= 0) {
      this.models.splice(index, 1);
    }
  }

  /**
   * Select model    
   */
  public selected( event: MatAutocompleteSelectedEvent ): void {
    this.models.push(event.option.viewValue);
    this.modelInput.nativeElement.value = '';
    this.modelCtrl.setValue(null);
  }

  /**
   * Filter models
   */
  private _filter( value: string ): string[] {
    const filterValue = value.toLowerCase();
    return this.allModels.filter(model => model.toLowerCase().includes(filterValue));
  }

  /**
   * Number display label Payments Months
   */
  public formatLabelPayments( value: number ) {    
    if (value >= 1) {
      return value + 'm';
    }

    return value;
  }
  
  /**
   * Number display label Hitch
   */
  public formatLabelHitch( value: number ) {   
    if (value >= 1) {
      return Math.round(value / 1000) + 'k';
    }
    return value;
  }

  public getRandomVehicles(){
    this._homeService.getVehicles()
    .subscribe({
      next: ( response: RandomVehiclesData ) => {
        this.randomVehicles = response.vehicles;
      }
    });
  }

  public homeSwiperCarousel(){

    this.brandImages = [
      {
        src: 'assets/images/abcars-images/marcas/BMW-marca-1.png',
        alt: 'BMW',
      },
      {
        src: 'assets/images/abcars-images/marcas/Mini-marca-1.png',
        alt: 'Mini',
      },
      {
        src: 'assets/images/abcars-images/marcas/chevrolet-marca-1.png',
        alt: 'Chevrolet',
      },
      {
        src: 'assets/images/abcars-images/marcas/mercedes_benz-marca-1.png',
        alt: 'Mercedes Benz',
      },
      {
        src: 'assets/images/abcars-images/marcas/AUDI-marca-1.png',
        alt: 'Audi',
      },
      {
        src: 'assets/images/abcars-images/marcas/honda-marca-1.png',
        alt: 'Honda',
      },
      {
        src: 'assets/images/abcars-images/marcas/toyota-marca-1.png',
        alt: 'Toyota',
      },
      {
        src: 'assets/images/abcars-images/marcas/mazda-marca-1.png',
        alt: 'Mazda',
      },
      {
        src: 'assets/images/abcars-images/marcas/nissan-marca-1.png',
        alt: 'Nissan',
      },
      {
        src: 'assets/images/abcars-images/marcas/hyundai-marca-1.png',
        alt: 'Hyundai',
      },
      {
        src: 'assets/images/abcars-images/marcas/volkswagen-marca-1.png',
        alt: 'Volkswagen',
      },
    ]
    
    const buttonNext = document.querySelector('#btn_next')!;
    const buttonPrev = document.querySelector('#btn_previous')!;
    const buttonNextProm = document.querySelector('#btn_next_promo')!;
    const buttonPrevProm = document.querySelector('#btn_previous_promo')!;
    const swiperBrands = new Swiper ('.my-swiper-brands', {
      modules: [Autoplay, Navigation, Pagination, Zoom],
      /*navigation: {
        enabled: true,
        nextEl: '#btn_next',
        prevEl: '#btn_previous'
      },*/
      //loop: true,
      pagination: {
        clickable: true,
      },
      navigation : true,
      /*zoom: {
        maxRatio: 1.2,
        minRatio: 1
      },*/
      direction: 'horizontal',
      slidesPerView: 'auto',
      speed: 2000,
      spaceBetween: 10,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
      on: {
        init: function () {
          console.log('swiper initialized');
          //swiperBrands.autoplay.start();
        },
        /*slideChangeTransitionStart: function () {
          console.log('clicked!')
          swiperBrands.zoom.out();
        },
        slideChangeTransitionEnd: function () {
          console.log('clicked!')
          swiperBrands.zoom.in();
        }*/
      },
    });
    swiperBrands.on('slideChange', function () {
      console.log('slide changed');
    });
    
    buttonNext.addEventListener('click', () => {
      swiperBrands.slideNext();
    });
    buttonPrev.addEventListener('click', () => {
      swiperBrands.slidePrev();
    });
    /*swiperEl!.addEventListener('slidechange', (e) => {
      console.log('slide changed');
    });*/
    
    const swiperPromo = new Swiper('.my-swiper-promo',{
      modules: [Autoplay, Zoom],
      loop: true,
      direction: 'horizontal',
      slidesPerView: 'auto',
      speed: 5000,
      spaceBetween: 10,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
      loopPreventsSliding: false,
      /*zoom: {
        maxRatio: 1.2,
        minRatio: 1
      },
      on: {
        init: function () {
          console.log('swiper initialized');
        },
        slideChangeTransitionStart: function () {
          console.log('clicked!')
          swiperPromo.zoom.out();
        },
        slideChangeTransitionEnd: function () {
          console.log('clicked!')
          swiperPromo.zoom.in();
        }
      },*/
    });
    buttonNextProm.addEventListener('click', () => {
      swiperPromo.slideNext(1000);
    });
    buttonPrevProm.addEventListener('click', () => {
      swiperPromo.slidePrev(1000);
    });
  }
}