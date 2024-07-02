import { Component } from '@angular/core';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';

// Services
import { CompraTuAutoService } from 'src/app/dashboard/pages/comprar-autos/services/compra-tu-auto.service';

// Interfaces
import { Vehiclebody } from 'src/app/dashboard/pages/comprar-autos/interfaces/compra-tu-auto/data_vehiclebodies.interface';
import { Vehicle } from 'src/app/dashboard/pages/comprar-autos/interfaces/compra-tu-auto/data_buscador.interface';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styles: [`
    mat-form-field {
      width: 100%;
    }
  `]
})

export class VehiclesComponent {

  // References "Brands"
  public brands: string[] = [];

  // References "Models"
  public models: string[] = [];

  // References "Years"
  public years: string[] = [];

  public carrocerias: Vehiclebody[] = [];

  public orden:string = 'vacio';

  // References "Enganche"
  public hitchMin = 20000;
  public hitchValue = 3000000;

  // MatPaginator Inputs
  public length: number = 0;
  public pageSize: number = 12;
  public pageSizeOptions: number[] = [15, 30, 45, 60, 150];

  // MatPaginator Output
  pageEvent!: PageEvent;

  // Vehiculos
  public vehicles: Vehicle[] = [];

  public palabra_busqueda:string = '';

  constructor(private _compraTuAutoService: CompraTuAutoService) { 
    this.getVehicles(1);
    this.scrollTop();
  }

  scrollTop() {
    var scrollElem= document.querySelector('#moveTop');
        scrollElem!.scrollIntoView();  
  }

  /**
   * Get vehicles
   */
  public getVehicles(page: number) { 
    let stringBrands = this.brands.join().length > 0 ? this.brands.join() : 'vacio';
    let stringModels = this.models.join().length > 0 ? this.models.join() : 'vacio';
    let stringYears = this.years.join().length > 0 ? this.years.join() : 'vacio';
    let arrayCarrocerias:number[] = [];
    this.carrocerias.map( carroceria => {
      arrayCarrocerias.push( carroceria.id );
    });
    let stringCarrocerias = arrayCarrocerias.join().length > 0 ? arrayCarrocerias.join() : 'vacio';

    this._compraTuAutoService.getVehiclesAll(this.pageSize, stringBrands, stringModels, stringYears, stringCarrocerias, this.hitchMin,
                                            this.hitchValue, this.palabra_busqueda.length > 0 ? this.palabra_busqueda : 'a', this.orden, page, 'vacio')
                                            .subscribe({
                                              next: (response) => {
                                                this.vehicles = response.vehicles.data;
                                                this.palabra_busqueda = ''; 
                                                this.length = response.vehicles.total;
                                              }
                                            });
  }

  /**
   *  Change pagination
   */
  public paginationChange(pageEvent: PageEvent) { 
    this.pageEvent = pageEvent;
    this.pageSize = this.pageEvent.pageSize;    
    this.getVehicles( this.pageEvent.pageIndex + 1 );  
  }

}
