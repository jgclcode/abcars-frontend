import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { map, startWith } from 'rxjs/operators';
import { UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';

import { MatAutocompleteSelectedEvent as MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent as MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { MatPaginator as MatPaginator, PageEvent as PageEvent } from '@angular/material/paginator';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';

// Services
import { CompraTuAutoService } from 'src/app/dashboard/pages/comprar-autos/services/compra-tu-auto.service';

// Interfaces
import { DataVehicleBody, Vehiclebody } from 'src/app/dashboard/pages/comprar-autos/interfaces/compra-tu-auto/data_vehiclebodies.interface';
import { DataStates } from 'src/app/dashboard/pages/comprar-autos/interfaces/compra-tu-auto/data_states.interface';
import { DataBrands } from 'src/app/dashboard/pages/comprar-autos/interfaces/compra-tu-auto/data_brands.interface';
import { DataModels } from 'src/app/dashboard/pages/comprar-autos/interfaces/compra-tu-auto/data_models.interface';
import { DataYears } from 'src/app/dashboard/pages/comprar-autos/interfaces/compra-tu-auto/data_years.interface';
import { Vehicle } from 'src/app/dashboard/pages/comprar-autos/interfaces/compra-tu-auto/data_buscador.interface';

// Components
import { DetailComponent } from '../../components/detail/detail.component';

@Component({
  selector: 'app-external-buy-your-car',
  templateUrl: './external-buy-your-car.component.html',
  styleUrls: ['./external-buy-your-car.component.css']
})

export class ExternalBuyYourCarComponent implements OnInit {
  public selectable = true;
  public removable = true;
  public separatorKeysCodes: number[] = [ENTER, COMMA];

  // References "Brands"
  public allBrands: string[] = [];
  public filteredBrands: Observable<string[]>;
  public brandCtrl = new UntypedFormControl();
  public brands: string[] = [];

  // References "Models"
  public allModels: string[] = [];  
  public filteredModels: Observable<string[]>;
  public modelCtrl = new UntypedFormControl();
  public models: string[] = [];

  // References "Years"
  public allYears: string[] = [];  
  public filteredYears: Observable<string[]>;
  public yearCtrl = new UntypedFormControl();
  public years: string[] = [];

  // References "States"
  public allStates: string[] = [];  
  public filteredStates: Observable<string[]>;
  public stateCtrl = new UntypedFormControl();
  public states: string[] = [];

  public allCarrocerias: Vehiclebody[] = [];
  public carrocerias: Vehiclebody[] = [];
  public orden:string = 'vacio';

  // Vehiculos
  public vehicles: Vehicle[] = [];

  public palabra_busqueda: string = '';
  
  @ViewChild('brandInput') brandInput!: ElementRef<HTMLInputElement>;
  @ViewChild('modelInput') modelInput!: ElementRef<HTMLInputElement>;
  @ViewChild('yearInput') yearInput!: ElementRef<HTMLInputElement>;
  @ViewChild('stateInput') stateInput!: ElementRef<HTMLInputElement>;  

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public status: boolean = false;

  // References "Enganche"
  public hitchTickInterval = 1;  
  public hitchMax = 3000000;
  public hitchMin = 20000;
  public hitchStep = 1;
  public hitchValue = 3000000;  

  // MatPaginator Inputs
  length = 100;
  pageSize = 15;
  pageSizeOptions: number[] = [15, 30, 45, 60, 150];

  // MatPaginator Output
  pageEvent!: PageEvent;
  pageIndex:number = 1;

  constructor(
    private _compraTuAutoService: CompraTuAutoService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _bottomSheet: MatBottomSheet
  ) {     
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
  }

  ngOnInit(): void {
    this._activatedRoute.params
    .subscribe({
        next: (params) => {

        if( params['marca'] != undefined && params['marca'] != 'sin-marcas' ){
          let brands = params['marca'].split('-');
          brands = this.eliminarDuplicados( brands );
          brands.forEach((brand:string) => {
            this.brands.push( this.capitalizeFirstLetter(brand) );
          });    
          this.brands = this.eliminarDuplicados( this.brands );
        }

        if( params['modelo'] != undefined && params['modelo'] != 'sin-modelos'){
          let models = params['modelo'].split('-');
          models = this.eliminarDuplicados( models );
          models.forEach((model:string) => {
            this.models.push( this.capitalizeFirstLetter(model) );
          });  
          this.models = this.eliminarDuplicados( this.models );  
        }

        if( params['anio'] != undefined && params['anio'] != 'sin-anios'){
          let years = params['anio'].split('-');
          years = this.eliminarDuplicados( years );
          years.forEach((year:string) => {
            this.years.push( this.capitalizeFirstLetter(year) );
          });    
          this.years = this.eliminarDuplicados( this.years );
        }

        if( params['precio'] != undefined ){
          this.hitchValue = params['precio'];          
        }

        if( params['busqueda'] != undefined && params['busqueda'] != 'sin-busqueda' ){
          this.palabra_busqueda = params['busqueda'];
        }
        
        if( params['carroceria'] != undefined && params['carroceria'] != 'sin-carrocerias' ){
          let carrocerias = params['carroceria'].split('-');
          let fecha = new Date();        
          carrocerias.forEach((carroceria: string ) => {
            this.carrocerias.push( { id: +carroceria, name: 'El moro se la come', description: null, created_at: fecha, updated_at: fecha} );          
          });    
        }

        if( params['estado'] != undefined && params['estado'] != 'sin-estados'){
          let estados = params['estado'].split('-');
          estados = this.eliminarDuplicados( estados );
          estados.forEach((estado:string) => {
            this.states.push( this.capitalizeFirstLetter(estado) );
          });  
          this.states = this.eliminarDuplicados( this.states );  
        }
        
        if( params['pagina'] != undefined ){
          this.pageIndex = +params['pagina'];  
        }
      }
    });

    this.execImportantMethods();
    this.executeSearch( this.pageIndex );
    this.scrollTop();
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

  private execImportantMethods(){       
    let stringBrands = this.brands.join().length > 0 ? this.brands.join() : 'vacio';
    let stringModels = this.models.join().length > 0 ? this.models.join() : 'vacio';
    let stringYears = this.years.join().length > 0 ? this.years.join() : 'vacio';
    let stringStates = this.states.join().length > 0 ? this.states.join() : 'vacio';
    let arrayCarrocerias:number[] = [];
    this.carrocerias.map( carroceria => {
      arrayCarrocerias.push( carroceria.id );
    });
    let stringCarrocerias = arrayCarrocerias.join().length > 0 ? arrayCarrocerias.join() : 'vacio';
    let stringTransmissions = 'vacio';
    // Obtener marcas del servicio
    this._compraTuAutoService.getBrands(stringModels, stringYears, stringCarrocerias, this.hitchValue, stringStates, stringTransmissions )
    .subscribe({
      next: ( dataBrands: DataBrands ) => {
        this.allBrands = [];
        this.filteredBrands = this.brandCtrl.valueChanges.pipe(startWith(null),
          map((brand: string | null) => brand ? this._filterBrands(brand) : this.allBrands.slice()));
        dataBrands.brands.map( brand => { 
          if( !this.existsInArray( this.brands, brand.name) ){
            this.allBrands.push( brand.name );
          }
          this.filteredBrands = this.brandCtrl.valueChanges.pipe(startWith(null),
            map((brand: string | null) => brand ? this._filterBrands(brand) : this.allBrands.slice()));
        });
      }
    });

    // Obtener modelos del servicio
    this._compraTuAutoService.getModels( stringBrands, stringYears, stringCarrocerias, this.hitchValue, stringStates, stringTransmissions )
    .subscribe({
      next: ( dataModels: DataModels ) => {
        this.allModels = [];
        this.filteredModels = this.modelCtrl.valueChanges.pipe(startWith(null),
          map((model: string | null) => model ? this._filterModels(model) : this.allModels.slice()));
        dataModels.models.map( model => {
          if( !this.existsInArray( this.models, model.name) ){
            this.allModels.push( model.name );
          }
          this.filteredModels = this.modelCtrl.valueChanges.pipe(startWith(null),
            map((model: string | null) => model ? this._filterModels(model) : this.allModels.slice()));
        });
      }
    });

    // Obtener years del servicio
    this._compraTuAutoService.getYears( stringBrands, stringModels, stringCarrocerias, this.hitchValue, stringStates, stringTransmissions )
    .subscribe({
      next: ( dataYears: DataYears ) => {
        this.allYears = [];
        this.filteredYears = this.yearCtrl.valueChanges.pipe(startWith(null),
          map((year: string | null) => year ? this._filterYears(year) : this.allYears.slice()));
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
    this._compraTuAutoService.getVehicleBodies( stringBrands, stringModels, stringYears, this.hitchValue, stringStates, stringTransmissions )
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
    this._compraTuAutoService.getStates( stringBrands, stringModels, stringCarrocerias, stringYears, this.hitchValue, stringTransmissions )
    .subscribe({
      next: ( dataStates: DataStates ) => {
        this.allStates = [];
        this.filteredStates = this.stateCtrl.valueChanges.pipe(startWith(null),
          map((state: string | null) => state ? this._filterStates(state) : this.allStates.slice()));
        dataStates.states.map( state => {
          if( !this.existsInArray( this.states, `${state.name}`) ){
            this.allStates.push(`${state.name}`);
          }
          this.filteredStates = this.stateCtrl.valueChanges.pipe(startWith(null),
            map((state: string | null) => state ? this._filterStates(state) : this.allStates.slice()));
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
          break;

        case 'models':
          this.models.push(value);
          break;

        case 'years':
          this.years.push(value);
          break;
        
        case 'states':
          this.states.push(value);
          break;
      }
    }

    // Clear the input value
    event.chipInput!.clear();
    //this.modelCtrl.setValue(null);
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
    }
    
    this.execImportantMethods();
  }

  /**
   * Select element    
   */
  public selected( event: MatAutocompleteSelectedEvent, input: string ): void {  
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
    }
    this.execImportantMethods();
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

  /**
   * Number display label Hitch
   */
  public formatLabelHitch( value: number ) : string {   
    if (value >= 1) {
      return '$' + Math.round(value / 1000);
    }

    return '${value}'
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
    let index:number;    
    if( !this.bodyWorkIsSelected( carroceria ) ){       
      this.carrocerias.push( carroceria ); 
    }else{            
      this.carrocerias.find( (car, key) => {
        if( car.id == carroceria.id ){
          index = key;
        }
      });      
      setTimeout( () => {        
        if (index >= 0) {          
          this.carrocerias.splice(index, 1);
        }         
      }, 300);      
    }   
    setTimeout( () => {        
      this.execImportantMethods();       
    }, 310);            
  }

  public precio(){
    this.execImportantMethods();    
  }

  public search(){
    this.executeSearch( this.pageIndex );
    this.execImportantMethods();
    let marcas = this.brands.length > 0 ? this.brands.join('-') : 'sin-marcas';
    let modelos = this.models.length > 0 ? this.models.join('-') : 'sin-modelos';
    let anios = this.years.length > 0 ? this.years.join('-') : 'sin-anios';
    let busqueda = this.palabra_busqueda.length > 0 ? this.palabra_busqueda : 'sin-busqueda';
    let carrocerias = this.carrocerias.length > 0 ? this.carrocerias.map(function(elem:any){
      return elem.id;
    }).join(",") : 'sin-carrocerias';
    let estados = this.states.length > 0 ? this.states.join('-') : 'sin-estados';
    this._router.navigate(['externals/compra-tu-auto', marcas, modelos, anios, this.hitchValue, carrocerias, estados, busqueda, this.pageIndex]);
  }

  public searchByWord(){
    this.pageIndex = 1;
    this.search();
    this.execImportantMethods();
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
    let stringTransmissions = 'vacio';
    this._compraTuAutoService.getVehicles( this.pageSize, stringBrands, stringModels, stringYears, stringCarrocerias, 
                                          this.hitchValue, this.palabra_busqueda.length > 0 ? this.palabra_busqueda : 'a', 
                                          this.orden, page, stringStates, stringTransmissions)
    .subscribe({
      next: ( response ) => {
        this.vehicles = response.vehicles.data;
        this.length = response.vehicles.total;
      }
    });
  }

  public paginationChange( pageEvent:PageEvent ){    
    this.pageEvent = pageEvent;
    this.pageSize = this.pageEvent.pageSize;   
    this.pageIndex = this.pageEvent.pageIndex + 1; 
    this.search();
    this.scrollTop(); 
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
    this.search();       
  }

  /**
   * Open Detail Sheet Vehicle
   */
  public openDetailSheet(vehicle: Vehicle): void {
    this._bottomSheet.open(DetailComponent, {
      data: vehicle
    });
  }

}