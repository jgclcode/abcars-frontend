import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from "@angular/material/paginator";

// Services
import { CompraTuAutoService } from '../../services/compra-tu-auto.service';

// Interfaces
// import { Vehicle } from '../../interfaces/search-promo.interface';
import { Vehicle } from "./../../interfaces/compra-tu-auto/data_buscador.interface";
import { VehicleBody } from "./../../interfaces/compra-tu-auto/data_buscador.interface";


@Component({
  selector: 'app-autos-en-oferta',
  templateUrl: './autos-en-oferta.component.html'
})
export class AutosEnOfertaComponent implements OnInit {

  public brands: string[] = [];
  public models: string[] = [];
  public years: string[] = [];
  public states: string[] = [];

  public hitchValue = 3000000;
  public palabra_busqueda: string = '';
  public orden:string = 'vacio';

  public carrocerias: VehicleBody[] = [];

  public vehiclePromos: Vehicle[] = [];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public status: boolean = true;

  public length = 0;
  public pageSize = 12;
  public pageIndex: number = 1;

  // MatPaginator Output
  public pageEvent!: PageEvent;

  constructor(
    private _compraTuAutoService: CompraTuAutoService
  ) { 
    this.getPromoVehicles( this.pageIndex );
   }

  ngOnInit(): void {
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }

  public search( page:number | null = null ){
    page == null ? this.getPromoVehicles( this.pageIndex ) : this.getPromoVehicles( page );
  }

  public getPromoVehicles( page: number){
    let stringBrands = this.brands.join().length > 0 ? this.brands.join() : 'vacio';
    let stringModels = this.models.join().length > 0 ? this.models.join() : 'vacio';
    let stringYears = this.years.join().length > 0 ? this.years.join() : 'vacio';
    let stringStates = this.states.join().length > 0 ? this.states.join() : 'vacio';
    let arrayCarrocerias:number[] = [];
    this.carrocerias.map( carroceria => {
      arrayCarrocerias.push( carroceria.id );
    });
    let stringCarrocerias = arrayCarrocerias.join().length > 0 ? arrayCarrocerias.join() : 'vacio';
    this._compraTuAutoService.getPromoVehicles(this.pageSize, stringBrands, stringModels, stringYears, stringCarrocerias, this.hitchValue, this.palabra_busqueda.length > 0 ? this.palabra_busqueda : 'a', this.orden, page, stringStates).subscribe(
      ( response ) => {
        this.vehiclePromos = response.vehicles.data;
        this.length = response.vehicles.total;
      }
    );
  }

  public paginationChange( pageEvent:PageEvent ){    
    this.pageEvent = pageEvent;
    this.pageSize = this.pageEvent.pageSize;   
    this.pageIndex = this.pageEvent.pageIndex + 1; 
    this.search();
    this.scrollTop(); 
  }
}
