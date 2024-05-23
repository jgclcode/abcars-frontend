import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource as MatTableDataSource } from '@angular/material/table';
import { MatPaginator as MatPaginator, PageEvent as PageEvent } from '@angular/material/paginator';

// Angular Material
import { MatBottomSheet } from '@angular/material/bottom-sheet';

// Services
import { AppraiserDatatableService } from '../../services/appraiser-datatable.service';
import { AppraiserChecklistService } from '../../services/appraiser-checklist.service';

// Animaciones
import Swal from 'sweetalert2';

// Components
import { SellYourCarComponent } from 'src/app/dashboard/pages/vender-autos/components/sell-your-car/sell-your-car.component';
import { ChecklistFormComponent } from '../../components/checklist-form/checklist-form.component';

// Interfaces
import { SellYourCarValuations, SellYourCarData } from '../../interfaces/appraiser-datatable.interface';
import { SellCarValuation } from '../../interfaces/sell-car-valuation.interface';
import { SellYourCarService } from '../../../valuator/services/sell-your-car.service';
import { Updstandbyparts } from '../../../valuator/interfaces/update-standby-parts.interface';

@Component({
  selector: 'app-appraiser-datatable',
  templateUrl: './appraiser-datatable.component.html'
})

export class AppraiserDatatableComponent {

  // References for help
  public flag: Boolean = true;
  public toggle: Boolean = false;
  public statuSelect: string = '';
  public versionIni: string = '';
  public status: string = '';

  // References of MatTable
  public displayedColumns: string[] = ['id', 'clientName', 'clientSurname', 'brandName', 'modelName', 'vin', 'year', 'status', 'actions'];
  public dataSource!: MatTableDataSource<SellYourCarData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // MatPaginator 
  public length: number = 0;
  public pageIndex: number = 1;

  constructor(
    private _appraiserDatatableService: AppraiserDatatableService,
    private _bottomSheet: MatBottomSheet,
    private _appraiserChecklistService: AppraiserChecklistService,
    private _sellYourCar: SellYourCarService
    ) {
    // Get sell cars
    this.getSellCars();
    this.scrollTop();
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();
  }

  /**
   * Get sell cars
   */
  private getSellCars(page?: number) {
    this._appraiserDatatableService.getAppraiserSellCars(page)
    .subscribe({
      next: ({ code, status, sell_your_car }: SellYourCarValuations) => {
        for (let val of sell_your_car.data) {
          // console.log(val.id);
          this.getValuationAll(String(val.id));
        }
        if (code === 200 && status === 'success') {
          this.flag = true;

          // Assign the data to the data source for the table to render
          this.dataSource = new MatTableDataSource(sell_your_car.data);

          // Set paginator and sort
          this.paginator.length = sell_your_car.total;
        }
      }
    });
  }

  private getValuationAll(id: string){
    this._appraiserChecklistService.getChecklistValuationall(id)
    .subscribe({
      next: (resp => {
        if (resp === 1) {
          // console.log('Pasa si es true');
          this.status = 'valued_standBy_parts';
          this.updateStandByParts(Number(id));
        }
      })
    });
  }

  public updateStandByParts(id: number){
    this._sellYourCar.updateStatusStandByParts(id, { status: this.status} )
    .subscribe({
      next: ( (resp: Updstandbyparts) => {
        if (resp.code === '200' && resp.status === 'success') {
          let mensaje = 'El status cambió a valued_standBy_parts';
        }
      })
    });
  }

  /**
   * Search in datatable
   * @param event Event
   */
  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Pagination Change
   * @param event PageEvent
   */
  public paginationChange(event: PageEvent) {
    this.getSellCars(event.pageIndex + 1);
    this.scrollTop();
  }

  public openBottomSheet(){
    this._bottomSheet.open(SellYourCarComponent);
  }

  public openChecklistForm(vin: string) {
    this._bottomSheet.open(ChecklistFormComponent, {
      data: { vin }
    });
  }

  public sweetProcedure(id: number){
    Swal.fire({
      icon: 'question',
      title: '¿Proceder con la valuación del auto?',
      showDenyButton: true,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si',
      confirmButtonColor: '#eeb838',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.toggle = true;
        this._appraiserDatatableService.getAppraiserSellCars()
        .subscribe({
          next: ({ sell_your_car }: SellYourCarValuations) => {
            const find = sell_your_car.data.filter(sc => sc.id === id)
            if (find[0].status === 'stand_by' || find[0].status === 'reject') {
              this.statuSelect = 'pre_approved';
              this.versionIni = 'Ninguna';
              this.updateStatus(id);
            }
          }
        });
        this.alert();
      } else if (result.isDenied) {
        this.toggle = false;
        this._appraiserDatatableService.getAppraiserSellCars()
        .subscribe({
          next: ({ sell_your_car }: SellYourCarValuations) => {
            const find = sell_your_car.data.filter(sc => sc.id === id)
            if (find[0].status === 'stand_by' || find[0].status === 'reject') {
              this.statuSelect = 'reject';
              this.versionIni = 'Ninguna';
              this.updateStatus(id);
            }
          }
        });
        this.alert();
      }
    })
  }

  public updateStatus(id: number){
    this._appraiserChecklistService.updateAppraiserKm(id, { km: 0, status: this.statuSelect, version: this.versionIni, vin: '00000000000000000' })
    .subscribe({
      next: ((resp: SellCarValuation) => {
        this.getSellCars();
      })
    });
  }

  private alert(){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    if (this.toggle) {
      Toast.fire({
        icon: 'success',
        title: 'Estatus es Pre-aprobado'
      })
    }else{
      Toast.fire({
        icon: 'success',
        title: 'Estatus es Rechazado'
      })
    }

  }

}