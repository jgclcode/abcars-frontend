import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource as MatTableDataSource } from '@angular/material/table';
import { MatPaginator as MatPaginator, PageEvent as PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

// Angular Material
import { MatBottomSheet } from '@angular/material/bottom-sheet';

// Animations
import Swal from 'sweetalert2';

// Services
import { SellYourCarService } from '../../../valuator/services/sell-your-car.service';
import { AppraiserDatatableService } from '../../../appraiser/services/appraiser-datatable.service';
import { AppraiserChecklistService } from '../../../appraiser/services/appraiser-checklist.service';
import { SparePartsService } from '../../../spare-parts/services/spare-parts.service';

// Components
import { CheckviewReqservComponent } from '../../../valuator/pages/checkview-reqserv/checkview-reqserv.component';
import { SellYourCarComponent } from 'src/app/dashboard/pages/vender-autos/components/sell-your-car/sell-your-car.component';

// Interfaces
import { DataSellYourCar, SellYourCar } from '../../../valuator/interfaces/sell-your-car.interface';
import { SellYourCarValuations } from '../../../appraiser/interfaces/appraiser-datatable.interface';
import { SellCarValuation } from '../../../appraiser/interfaces/sell-car-valuation.interface';
import { Updstandbyparts } from '../../../valuator/interfaces/update-standby-parts.interface';
import { GetSpareParts } from '../../../spare-parts/interfaces/spare-parts.interface';

@Component({
  selector: 'app-tecval',
  templateUrl: './tecval.component.html',
  styles: [
  ]
})
export class TecvalComponent implements OnInit {

  // MatTableSource
  public displayedColumns: string[] = ['id', 'name', 'surname', 'brand', 'carmodel', 'vin', 'year', 'status', 'preparation', 'actions'];
  public dataSource!: MatTableDataSource<DataSellYourCar>

  // References for help
  public toggle: Boolean = false;
  public statuSelect: string = '';
  public versionIni: string = '';
  public status: string = '';

  // MatPaginator 
  public length: number = 0;
  public pageIndex: number = 1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Reference Slide toggle
  public disabled = true;

  constructor(
    private _router: Router,
    private _sellYourCar: SellYourCarService,
    private _appraiserDatatableService: AppraiserDatatableService,
    private _appraiserChecklistService: AppraiserChecklistService,
    private _sparePartsService: SparePartsService,
    private _bottomSheet: MatBottomSheet
  ) { 
    // Launch request
    this.getRequests();
  }

  ngOnInit(): void {
    this.scrollTop();
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();
  }

  /**
   * Get Requests
   * @param page number
   */
  private getRequests(page?: number){
    this._sellYourCar.getSellYourCarRequets(page)
    .subscribe({
      next: ({ code, status, sell_your_car }: SellYourCar) => {
        if (code === 200 && status === 'success') {
          // Set Requets
          this.dataSource = new MatTableDataSource(sell_your_car.data);
          // Assign the length data
          this.paginator.length = sell_your_car.total;
        }
        for (let val of sell_your_car.data) {
          this.getValuationAll(String(val.id), val.status);
        }
      }
    });
  }

  private getValuationAll(id: string, currentStatus:string){
    this._appraiserChecklistService.getChecklistValuationall(id)
    .subscribe({
      next: (resp) => {
        if (resp === 1 && currentStatus === 'stand_by') {
          this.status = 'valued_standBy_parts';
          this.updateStandByParts(Number(id), true);
        }
      }
    });

    this._sparePartsService.getSparePartsBySell(Number(id))
    .subscribe({
      next: ({code, status, spare_parts}: GetSpareParts) => {
        if (code === 200 && status === 'success') {
          spare_parts.map(spare => {
            if (spare.status !== "on hold" && currentStatus === 'valued_standBy_parts') {
              this.status = 'to_valued';
              this.updateStandByParts(Number(id));
            }
          });
        }
      }
    });
  }

  public updateStandByParts(id: number, redirect: boolean = false){
    this._sellYourCar.updateStatusStandByParts(id, { status: this.status })
    .subscribe({
      next: (resp: Updstandbyparts) => {
        if (resp.code === '200' && resp.status === 'success') {
          // let message = 'El status cambió a valued_standBy_parts';
          if (redirect) {
            this._router.navigateByUrl('/admin/tecval/sell_your_cars');
            window.location.reload();
          }
        }
      }
    });
  }

  public applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Pagination Change
   * @param event PageEvent
   */
   public paginationChange(event: PageEvent) {
    this.getRequests(event.pageIndex + 1);
    this.scrollTop();   
  }

  public openBottomSheet(){
    this._bottomSheet.open(SellYourCarComponent);
  }

  public openBottomSheetR(id: string, vin: string){
    this._appraiserChecklistService.getChecklistValuationall(id)
    .subscribe({
      next: resp => {
        // console.log(resp);
        if (resp === 1) {
          this._bottomSheet.open(CheckviewReqservComponent, {
            data: { id: id, vin: vin}
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oupps...',
            text: 'La valuación para éste auto no se ha realizado.',
            confirmButtonColor: '#EEB838',
          });
        }
      }
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
            if (find[0].status === 'pre_approved' || find[0].status === 'reject') {
              this.statuSelect = 'stand_by';
              this.versionIni = 'Ninguna';
              this.updateStatusPrime(id);
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
            if (find[0].status === 'pre_approved' || find[0].status === 'reject') {
              this.statuSelect = 'reject';
              this.versionIni = 'Ninguna';
              this.updateStatusPrime(id);
            }
          }
        });
        this.alert();
      }
    })
  }

  public updateStatusPrime(id: number){
    this._appraiserChecklistService.updateAppraiserKm(id, { km: 0, status: this.statuSelect, version: this.versionIni, vin: '00000000000000000' })
    .subscribe({
      next: ((resp: SellCarValuation) => {
        this.getRequests();
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
        title: 'Estatus es En espera'
      })
    }else{
      Toast.fire({
        icon: 'success',
        title: 'Estatus es Rechazado'
      })
    }

  }

}
