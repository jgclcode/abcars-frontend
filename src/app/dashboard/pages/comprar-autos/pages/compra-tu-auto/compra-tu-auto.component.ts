import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent as MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent as MatChipInputEvent } from '@angular/material/chips';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator as MatPaginator, MatPaginatorIntl, PageEvent as PageEvent } from '@angular/material/paginator';

// Services
import { CompraTuAutoService } from './../../services/compra-tu-auto.service';

// Interfaces
import { DataBrands } from './../../interfaces/compra-tu-auto/data_brands.interface';
import { DataModels } from './../../interfaces/compra-tu-auto/data_models.interface';
import { DataYears } from './../../interfaces/compra-tu-auto/data_years.interface';
import { DataTransmissions } from './../../interfaces/compra-tu-auto/data_transmissions.interface';
import { DataVehicleBody, Vehiclebody } from './../../interfaces/compra-tu-auto/data_vehiclebodies.interface';
import { DataBuscador, MinMaxPrices, Vehicle } from './../../interfaces/compra-tu-auto/data_buscador.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { DataStates } from '../../interfaces/compra-tu-auto/data_states.interface';

@Component({
  selector: 'app-compra-tu-auto',
  templateUrl: './compra-tu-auto.component.html',
  styleUrls: ['./compra-tu-auto.component.css'],
  providers: [{ provide: MatPaginatorIntl}]
})

export class CompraTuAutoComponent implements OnInit {
  // References Input
  public selectable = true;
  public removable = true;
  public separatorKeysCodes: number[] = [ENTER, COMMA];

  // References "Brands"
  public allBrands: string[] = [];
  public filteredBrands: Observable<string[]>;
  public brandCtrl = new FormControl('');
  public brands: string[] = [];

  // References "Models"
  public allModels: string[] = [];  
  public filteredModels: Observable<string[]>;
  public modelCtrl = new FormControl('');
  public models: string[] = [];

  // References "Years"
  public allYears: string[] = [];  
  public filteredYears: Observable<string[]>;
  public yearCtrl = new FormControl('');
  public years: string[] = [];

  // References "States"
  public allStates: string[] = [];  
  public filteredStates: Observable<string[]>;
  public stateCtrl = new FormControl('');
  public states: string[] = [];


  // References "Transmission"
  public allTransmissions: string[] = [];  
  public filteredTransmissions: Observable<string[]>;
  public transmissionCtrl = new FormControl('');
  public transmissions: string[] = [];

  public allCarrocerias: Vehiclebody[] = [];
  public carrocerias: Vehiclebody[] = [];
  public orden: string = 'precioMenos'; /** Antes era vacio */

  // Vehiculos
  public spinner = true;
  public vehicles: Vehicle[] = [];
  public palabra_busqueda: string = '';

  private timer: any;
  
  @ViewChild('brandInput') brandInput!: ElementRef<HTMLInputElement>;
  @ViewChild('modelInput') modelInput!: ElementRef<HTMLInputElement>;
  @ViewChild('yearInput') yearInput!: ElementRef<HTMLInputElement>;
  @ViewChild('stateInput') stateInput!: ElementRef<HTMLInputElement>;
  @ViewChild('stateInput') transmissionInput!: ElementRef<HTMLInputElement>; 

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public status: boolean = false;

  // References "Enganche"
  public hitchTickInterval = 1;  
  public hitchMax = 3000000;
  public hitchMin = 250000;
  public hitchStep = 100;

  public min = 100;
  public max = 3000000;

  public highEndChange = 1000000;

  public thumbLabel = true;
  public disabled = false;
  public showTicks = false;

  // MatPaginator Inputs
  public length = 0;
  public pageSize = 15;  
  public pageIndex: number = 1;

  // MatPaginator Output
  public pageEvent!: PageEvent;

  showModal: boolean = false;
  modalVehicle:any;

  openModal( vehicle:Vehicle ) {      
    this.modalVehicle = vehicle;    
    if( this.modalVehicle != undefined ){
      this.showModal = true;  
    }   
  }  

  onModalClosed() {
    this.showModal = false;
  }

  constructor(
    private _compraTuAutoService: CompraTuAutoService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private titleService: Title,
    private metaService: Meta,
    private paginatorIntl: MatPaginatorIntl
  ) {
    this.customizePaginator();
    this._compraTuAutoService.getMinMaxPrices()
    .subscribe({
      next: ( minMaxPrices: MinMaxPrices ) => {
        
        this.min = minMaxPrices.min;
        this.max = minMaxPrices.max;
        
        this.hitchMin = minMaxPrices.min;
        this.hitchMax = minMaxPrices.max;

      }
    });    

    // Set Title View
    this.titleService.setTitle('Elegir mi próximo auto');
    this.metaService.updateTag({ name: 'description', content: 'Utiliza nuestro sistema de apartado para comprar de contado o finaciado próximo auto' });

    /**
     * Filtered Elements   
     */     

    // Brands
    this.filteredBrands = this.brandCtrl.valueChanges.pipe(startWith(null),
      map((brand: string | null) => brand ? this._filterBrands(brand) : this.allBrands.slice()));

    // Models
    this.filteredModels = this.modelCtrl.valueChanges.pipe(startWith(null),
      map((model: string | null) => model ? this._filterModels(model) : this.allModels.slice()));

    // Years
    this.filteredYears = this.yearCtrl.valueChanges.pipe(startWith(null),
      map((year: string | null) => year ? this._filterYears(year) : this.allYears.slice()));

    // States 
    this.filteredStates = this.stateCtrl.valueChanges.pipe(startWith(null),
      map((state: string | null) => state ? this._filterStates(state) : this.allStates.slice()));

    // Transmissions 
    this.filteredTransmissions = this.transmissionCtrl.valueChanges.pipe(startWith(null),
      map((transmission: string | null) => transmission ? this._filterTransmissions(transmission) : this.allTransmissions.slice()));
      
  }

  ngOnInit(): void {
    this._activatedRoute.params
    .subscribe({
      next: (params) => {
        
        this.brands = [];
        if( params['marca'] != undefined && params['marca'] != 'sin-marcas' ){
          let brands = params['marca'].split('-');
          brands.forEach((brand:string) => {
            this.brands.push( this.capitalizeFirstLetter(brand) );
          });
        }

        this.models = [];
        if( params['modelo'] != undefined && params['modelo'] != 'sin-modelos'){
          let models = params['modelo'].split('-');
          models.forEach((model:string) => {
            this.models.push( this.capitalizeFirstLetter(model) );
          });
        }

        this.years = [];
        if( params['anio'] != undefined && params['anio'] != 'sin-anios'){
          let years = params['anio'].split('-');
          years.forEach((year:string) => {
            this.years.push( this.capitalizeFirstLetter(year) );
          });
        }

        if( params['minprecio'] != undefined ){
          this.hitchMin = params['minprecio'];          
        }
        
        if( params['maxprecio'] != undefined ){
          this.hitchMax = params['maxprecio'];          
        }

        if( params['busqueda'] != undefined && params['busqueda'] != 'sin-busqueda' ){
          this.palabra_busqueda = params['busqueda'];
        }

        if( params['carroceria'] != undefined && params['carroceria'] != 'sin-carrocerias' ){
          let carroceriasParams = this.eliminarDuplicados(params['carroceria'].split(','));
          let fecha = new Date();

          if(this.carrocerias.length > 0){
            this.carrocerias.forEach((carroceria: Vehiclebody ) => {
              if( !this.existsInArray( carroceriasParams, `${carroceria.id}`) ){
                this.carrocerias.push( { id: +carroceria.id, name: '', description: null, created_at: fecha, updated_at: fecha} );
              }
            });
          } else {
            carroceriasParams.forEach((idCarroceria: string) => {
              this.carrocerias.push( { id: +idCarroceria, name: '', description: null, created_at: fecha, updated_at: fecha} );
            });
          }
        }

        this.states = [];
        if( params['estado'] != undefined && params['estado'] != 'sin-estados'){
          let estados = params['estado'].split('-');
          estados.forEach((estado:string) => {
            this.states.push( this.capitalizeFirstLetter(estado) );
          });
        }

        this.transmissions = [];
        if( params['transmision'] != undefined && params['transmision'] != 'sin-transmisiones'){
          let transmisiones = params['transmision'].split('-');
          transmisiones.forEach((transmision:string) => {
            this.transmissions.push( this.capitalizeFirstLetter(transmision) );
          });
        }
        
        if( params['pagina'] != undefined ){
          this.pageIndex = +params['pagina'];  
        }

      }
    });

    this.execImportantMethods();
    this.search( this.pageIndex );
  }

  customizePaginator(){
    this.paginatorIntl.itemsPerPageLabel = 'Items por página';
    this.paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
      }
      const startIndex = page * pageSize;
      const endIndex = Math.min(startIndex + pageSize, length);

      return `${startIndex + 1} – ${endIndex} de ${length}`;
    };
  }

  capitalizeFirstLetter(string:string):string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  eliminarDuplicados( array: string []): string[]{
    return array.filter( (ele:string,pos:number)=>array.indexOf(ele) == pos);        
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
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
    
    this.carrocerias.map( carroceria => {
      arrayCarrocerias.push( carroceria.id );
    });
    
    let stringCarrocerias = arrayCarrocerias.join().length > 0 ? arrayCarrocerias.join() : 'vacio';
    
    // Obtener marcas del servicio
    this._compraTuAutoService.getBrands(stringModels, stringYears, stringCarrocerias, this.hitchMin, this.hitchMax, stringStates, stringTransmissions)
    .subscribe({
      next: ( dataBrands: DataBrands ) => {
        this.allBrands = [];

        dataBrands.brands.map( brand => { 
          if( !this.existsInArray( this.brands, this.titleCase(brand.name)) ){
            this.allBrands.push( brand.name );
          }
          this.filteredBrands = this.brandCtrl.valueChanges.pipe(startWith(null),
            map((brand: string | null) => brand ? this._filterBrands(brand) : this.allBrands.slice()));
        });
      }
    });
    
    // Obtener modelos del servicio
    this._compraTuAutoService.getModels( stringBrands, stringYears, stringCarrocerias, this.hitchMin, this.hitchMax, stringStates, stringTransmissions )
    .subscribe({
      next: ( dataModels: DataModels ) => {
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
    this._compraTuAutoService.getYears( stringBrands, stringModels, stringCarrocerias, this.hitchMin, this.hitchMax, stringStates, stringTransmissions )
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

    // Obtener vehiclebodies
    this._compraTuAutoService.getVehicleBodies( stringBrands, stringModels, stringYears, this.hitchMin, this.hitchMax, stringStates, stringTransmissions )
    .subscribe({
      next: ( dataVehicleBody: DataVehicleBody ) => {
        this.allCarrocerias = [];
        
        dataVehicleBody.vehiclebodies.map( carroceria => {
          this.allCarrocerias.push( carroceria );
        });

        if( this.allCarrocerias.length == 0 ){
          this.brands = [];
          this.years = [];
          this.models = [];
          this.carrocerias = [];
        }
        
        
      }
    });

    // Obtener states del servicio
    this._compraTuAutoService.getStates( stringBrands, stringModels, stringCarrocerias, stringYears, this.hitchMin, this.hitchMax, stringTransmissions )
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
    this._compraTuAutoService.getTransmissions( stringBrands, stringModels, stringCarrocerias, stringYears, this.hitchMin, this.hitchMax, stringStates)
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
  /**
   * Change status accordion
   */
  public openAccordion(accordion: boolean) {
    this.status = !accordion;    
  }

  /**
   * Add Models
   */
  public add( event: MatChipInputEvent, input: string ): void {
    const value = (event.value || '').trim();

    // Add element
    if (value) {
      switch (input) {
        case 'brands':
          this.brands.push(value);
          this.brandCtrl.setValue(null);
          event.chipInput!.clear();
          break;

        case 'models':
          this.models.push(value);
          this.modelCtrl.setValue(null);
          event.chipInput!.clear();
          break;

        case 'years':
          this.years.push(value);
          this.yearCtrl.setValue(null);
          event.chipInput!.clear();
          break;
        
        case 'states':
          this.states.push(value);
          this.stateCtrl.setValue(null);
          event.chipInput!.clear();
          break;

        case 'transmissions':
          this.transmissions.push(value);
          this.transmissionCtrl.setValue(null);
          event.chipInput!.clear();
          break;
      }
    }

    
  }
  
  /**
   * Remove element
   */
  public remove( model: string, input: string ): void {
    let index;

    switch (input) {
      case 'brands':
        index = this.brands.indexOf(model);

        if (index >= 0) {
          this.brands.splice(index, 1);
        }
        break;
      
      case 'models':
        index = this.models.indexOf(model);

        if (index >= 0) {
          this.models.splice(index, 1);
        }
        break;

      case 'years':
        index = this.years.indexOf(model);

        if (index >= 0) {
          this.years.splice(index, 1);
        }        
        break;

      case 'states':
        index = this.states.indexOf(model);

        if (index >= 0) {
          this.states.splice(index, 1);
        }        
        break;
      
      case 'transmissions':
        index = this.transmissions.indexOf(model);

        if (index >= 0) {
          this.transmissions.splice(index, 1);
        }        
        break;
    }
    this.execImportantMethods();
    this.search()
  }

  /**
   * Select element    
   */
  public selected( event: MatAutocompleteSelectedEvent, input: string ): void {    
    this.palabra_busqueda = ''; 
    switch (input) {
      case 'brands':        
        if(!this.existsInArray( this.brands, event.option.viewValue)){
          this.brands.push(event.option.viewValue);
        }          
        this.brandInput.nativeElement.value = '';
        this.brandCtrl.setValue(null);
        break;

      case 'models':
        if(!this.existsInArray( this.models, event.option.viewValue)){
          this.models.push(event.option.viewValue);
        }         
        this.modelInput.nativeElement.value = '';
        this.modelCtrl.setValue(null);        
        break;  

      case 'years':
        if(!this.existsInArray( this.years, event.option.viewValue)){
          this.years.push(event.option.viewValue);
        }          
        this.yearInput.nativeElement.value = '';
        this.yearCtrl.setValue(null);
        break;
      
      case 'states':
        if(!this.existsInArray( this.states, event.option.viewValue)){
          this.states.push(event.option.viewValue);
        }          
        this.stateInput.nativeElement.value = '';
        this.stateCtrl.setValue(null);
        break;
      
      case 'transmissions':
        if(!this.existsInArray( this.transmissions, event.option.viewValue)){
          this.transmissions.push(event.option.viewValue);
        }          
        this.transmissionInput.nativeElement.value = '';
        this.transmissionCtrl.setValue(null);
        break;
      
    }
    this.execImportantMethods();
    this.search(1);
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

  /**
   * Number display label Hitch
   */
  formatLabelHitch( value: number ): string {   
    if (value >= 1) {
      return '$' + Math.round(value / 1000);
    }

    return  '${value}';
  }

  /**
   * Change color when clicked "<mat-chip></mat-chip>"
  */
  public existsInArray( arreglo:any[], elemento:any ): boolean {   
      let exists = false;
      arreglo.find( element => {
        if( element == elemento ){
          exists = true;        
        }
      });   
      return exists;
  }

  public bodyWorkIsSelected( carroceria: Vehiclebody ): boolean {
    let exists = false;
    this.carrocerias.find( bodywork => {
      if( bodywork.id == carroceria.id ){
        exists = true;
      }
    });
    return exists;
  }
  
  public selectBodyWork(carroceria: Vehiclebody) {
    let index:number = 0;  
    this.palabra_busqueda = '';

    if (this.timer){
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      if( this.bodyWorkIsSelected( carroceria ) ){
          this.carrocerias.find( (car, key) => {
            if(car != undefined){
              if( car.id == carroceria.id ){
                index = key;
                this.carrocerias.splice(index, 1);
              }
            }
          });
      } else {
        this.carrocerias.push( carroceria );
      }
    }, 500);
    
    setTimeout(() => {
      this.execImportantMethods();
      this.search(1);
    }, 500);
  }

  public precio() {
    if (this.timer){
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.execImportantMethods();
      this.search(1);
    }, 600);
  }

  public search( page:number | null = null ){
    page == null ? this.executeSearch( this.pageIndex ) : this.executeSearch( page );

    let marcas = this.brands.length > 0 ? this.brands.join('-') : 'sin-marcas';
    let modelos = this.models.length > 0 ? this.models.join('-') : 'sin-modelos';
    let anios = this.years.length > 0 ? this.years.join('-') : 'sin-anios';
    let busqueda = this.palabra_busqueda.length > 0 ? this.palabra_busqueda : 'sin-busqueda';
    let carrocerias = this.carrocerias.length > 0 ? this.carrocerias.map(function(elem:any){
      return elem.id;
    }).join(",") : 'sin-carrocerias';
    let estados = this.states.length > 0 ? this.states.join('-') : 'sin-estados';
    let transmisiones = this.transmissions.length > 0 ? this.transmissions.join('-') : 'sin-transmisiones';

    this._router.navigate(['compra-tu-auto', marcas, modelos, anios, this.hitchMin, this.hitchMax, carrocerias, estados, busqueda, transmisiones, page == null ? this.pageIndex : page ]);
  }

  public navigate(){
    this._router.navigate(['compra-tu-auto', 'sin-marcas', 'sin-modelos', 'sin-anios', 250000, 3000000, 'sin-carrocerias', 'sin-estados', 'sin-busqueda', 'sin-transmisiones', 1 ]);              
  }

  public searchByWord(){
    this.brands = [];
    this.models = [];
    this.years = [];
    this.states = [];
    this.pageIndex = 1;
    this.execImportantMethods();
    this.search();
    
  }

  public searchChanged(){    

    if (this.timer){
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.searchByWord();
    }, 630);
          
  }

  public executeSearch( page:number ){
    let stringBrands = this.brands.join().length > 0 ? this.brands.join() : 'vacio';
    let stringModels = this.models.join().length > 0 ? this.models.join() : 'vacio';
    let stringYears = this.years.join().length > 0 ? this.years.join() : 'vacio';
    let stringStates = this.states.join().length > 0 ? this.states.join() : 'vacio';
    let arrayCarrocerias:number[] = [];
    this.carrocerias.map( carroceria => {
      arrayCarrocerias.push( carroceria.id );
    });
    let stringCarrocerias = arrayCarrocerias.join().length > 0 ? arrayCarrocerias.join() : 'vacio';
    let stringTransmisiones = this.transmissions.join().length > 0 ? this.transmissions.join() : 'vacio';

    this._compraTuAutoService.getVehicles( this.pageSize, stringBrands, stringModels, stringYears,
                                          stringCarrocerias, this.hitchMin, this.hitchMax, this.palabra_busqueda.length > 0 ? this.palabra_busqueda : 'a',
                                          this.orden, page, stringStates, stringTransmisiones)
    .subscribe({
      next: ( response ) => {
        this.spinner = false;
        this.vehicles = response.vehicles.data;
        this.length = response.vehicles.total;
      }
    });
  }

  public paginationChange( pageEvent:PageEvent ){
    this.pageEvent = pageEvent;
    this.pageSize = this.pageEvent.pageSize;
    this.pageIndex = this.pageEvent.pageIndex + 1;
    this.scrollTop(); 
    this.search();
  }

  public cambiarOrden( orden: string ){
    this.orden = orden;
    this.executeSearch(1);
    this.paginator.firstPage();
  }

  public clean(){
    this.allCarrocerias =  []; 
    this.brands = [];
    this.models = [];
    this.years = [];
    this.palabra_busqueda = '';
    this.carrocerias = [];
    this.states = [];
    this.transmissions = [];
    this.hitchMin = this.hitchMin;
    this.hitchMax = this.hitchMax;
    this.execImportantMethods();
    this.search(1);
  }

  public highEnd( page: number | null = null, highEndChange: number){
    // this.orden = 'highEnd';
    this.hitchMin = highEndChange;
    this.hitchMax = this.max;
    this.execImportantMethods();
    this.search(page);
  }

  public lowEnd(){
    this.hitchMin = this.min;
    this.hitchMax = this.max;
    this.execImportantMethods();
    this.search(1);
  }
}
