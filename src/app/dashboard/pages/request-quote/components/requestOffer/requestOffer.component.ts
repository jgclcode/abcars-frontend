import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailService } from '../../../comprar-autos/services/detail/detail.service';
import { VehicleData, Vehicle, Image } from '../../../comprar-autos/interfaces/detail/vehicle_data.interface';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Swiper, Navigation, SwiperOptions, Zoom } from 'swiper';
import { RequestqService } from '../services/requestq.service';
import { SheetOffer } from '../interfaces/requestq.interface';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-request-offer',
    // standalone: false,
    // imports: [
    //     CommonModule,
    // ],
    templateUrl: './requestOffer.component.html',
    styleUrls: ['./requestOffer.component.css'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestOfferComponent implements OnInit { 
    // References
    public vin: string = '';
    public vehicle: Vehicle;
    public requestOfferFormGroup: UntypedFormGroup;
    public bodywork: string;
    public disabled: true;
    public imagesForSlider: Image[] = [];
    public baseUrl: string = environment.baseUrl;
    public swiperThumbs2: Swiper;
    public configSwiperT: SwiperOptions;
    public swiperThumbs1: Swiper;
    public priceOffer: boolean = false;
    public description: string = '';
    public descriptions: string[];
    public spinner: boolean = false;
    
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _activatedRoute: ActivatedRoute,
        private _detailService: DetailService,
        private _requestOffer: RequestqService,
        private _router: Router
    ){
        // Form Initialization
        this.createFormRequestOfferGroup();

        this._activatedRoute.params
            .subscribe({
                next: (params) => {
                    this.scrollTop();
                    this.vin = params['vin'];
                    if (this.vin != undefined) {
                        this.getVehicle(this.vin);
                    }
                }
            });
    }

    ngOnInit(): void {
        
    }

    get nameInvalid() {
        return this.requestOfferFormGroup.get('name')!.invalid && (this.requestOfferFormGroup.get('name')!.dirty || this.requestOfferFormGroup.get('name')!.touched);
    }

    get surnameInvalid() {
        return this.requestOfferFormGroup.get('surname')!.invalid && (this.requestOfferFormGroup.get('surname')!.dirty || this.requestOfferFormGroup.get('surname')!.touched);
    }

    get emailInvalid() {
        return this.requestOfferFormGroup.get('email')!.invalid && (this.requestOfferFormGroup.get('email')!.dirty || this.requestOfferFormGroup.get('email')!.touched);
    }

    get phoneInvalid() {
        return this.requestOfferFormGroup.get('phone')!.invalid && (this.requestOfferFormGroup.get('phone')!.dirty || this.requestOfferFormGroup.get('phone')!.touched);
    }

    get clientPriceOfferInvalid() {
        return this.requestOfferFormGroup.get('clientPriceOffer')!.invalid && (this.requestOfferFormGroup.get('clientPriceOffer')!.dirty || this.requestOfferFormGroup.get('clientPriceOffer')!.touched);
    }

    scrollTop(){
        var scrollElem = document.querySelector('#moveTop');
        scrollElem!.scrollIntoView();
    }

    private getVehicle(vin: string){
        this._detailService.getVehicleByVin(vin)
            .subscribe({
                next: (vehicleData: VehicleData) => {
                    this.vehicle = vehicleData.vehicle;
                    this.imagesForSlider = [];
                    this.priceOffer = this.vehicle.priceOffer != null ? true : false;
                    this.description = this.vehicle.description;
                    this.requestOfferFormGroup.patchValue({
                        body: this.vehicle.vehiclebody.name.toString(),
                        brand: this.vehicle.carmodel.brand.name.toString(),
                        model: this.vehicle.name.toString(),
                    });
                    this.requestOfferFormGroup.get('body')?.disable();
                    this.requestOfferFormGroup.get('brand')?.disable();
                    this.requestOfferFormGroup.get('model')?.disable();
                    this.vehicle.vehicle_images.map( imagen => {
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
                    }else {
                        this.descriptions = ["Lo sentimos, este vehículo no cuenta con alguna descripción activa."]
                    }
                    // console.log(this.vehicle);
                }
            });
    }

    public carouselSwiper(){
        this.swiperThumbs2 = new Swiper('.my-swiper-thumbs-2', {
            modules: [Navigation],
            spaceBetween: 10,
            slidesPerView: 4,
            loop: true,
            loopPreventsSliding: false,
            slideToClickedSlide: true,
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

    private createFormRequestOfferGroup(){
        this.requestOfferFormGroup = this._formBuilder.group({
            body: ['', [Validators.required]],
            brand:['', [Validators.required]],
            model:['', [Validators.required]],
            name:['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
            surname: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
            email: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
            phone: ['', [Validators.required, Validators.pattern("[0-9]{10}"), Validators.minLength(10), Validators.maxLength(10)]],
            clientPriceOffer: [''],
            checkbox: [false, Validators.required]
        });
    }

    public maxLengthCheck(object: any) {
        if (object.value.length > object.maxLength) {
          object.value = object.value.slice(0, object.maxLength)
        }
    }

    public onSubmit(){
        // Change spinner
        this.spinner = true;

        // Launch request
        let body = this.requestOfferFormGroup.get('body')?.value;
        let brand = this.requestOfferFormGroup.get('brand')?.value;
        let model = this.requestOfferFormGroup.get('model')?.value;
        let name = this.requestOfferFormGroup.get('name')?.value;
        let surname = this.requestOfferFormGroup.get('surname')?.value;
        let email = this.requestOfferFormGroup.get('email')?.value;
        let phone = this.requestOfferFormGroup.get('phone')?.value;
        let clientPriceOffer = this.requestOfferFormGroup.get('clientPriceOffer')?.value;

        // console.log(body, brand, model, name, surname, email, phone, clientPriceOffer);
        
        this._requestOffer.setRequestOffer(body, brand, model, name, surname, email, phone, clientPriceOffer)
            .subscribe({
                next: (sheetO: SheetOffer) => {
                    if (sheetO.code === '200' && sheetO.status === 'success') {
                        Swal.fire({
                            icon: 'success',
                            title: 'La oferta ha sido generada correctamente',
                            text: `Nos pondremos en contacto contigo lo antes posible para seguir con el proceso de Adquirir tu Auto.`,
                            showConfirmButton: true,
                            confirmButtonColor: '#EEB838',
                            timer: 3500
                        });
                        setTimeout(() => {
                            this._router.navigateByUrl('/compra-tu-auto/detail/' + this.vin);
                        }, 2000);
                    }else {
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
}
