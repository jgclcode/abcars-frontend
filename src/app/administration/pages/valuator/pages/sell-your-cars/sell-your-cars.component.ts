import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator as MatPaginator, PageEvent as PageEvent } from "@angular/material/paginator";
import { MatTableDataSource as MatTableDataSource } from "@angular/material/table";
import { MatSort } from '@angular/material/sort';

import { environment } from 'src/environments/environment';

// Angular Material
import { MatBottomSheet } from '@angular/material/bottom-sheet';

// Animations
import Swal from 'sweetalert2';

// Services
import { SellYourCarService } from '../../services/sell-your-car.service';
import { AppraiserChecklistService } from '../../../appraiser/services/appraiser-checklist.service';
import { AppraiserDatatableService } from '../../../appraiser/services/appraiser-datatable.service';
import { SparePartsService } from '../../../spare-parts/services/spare-parts.service';
import { PaintingWorksService } from '../../services/painting-works.service';
import { DocumentPdfService } from '../../services/document-pdf.service';

// Components
import { CheckviewReqservComponent } from '../checkview-reqserv/checkview-reqserv.component';
import { ChecklistFormComponent } from '../../../appraiser/components/checklist-form/checklist-form.component';
import { DocumentationVehicleComponent } from '../../components/documentation-vehicle/documentation-vehicle.component';
import { SellYourCarComponent } from 'src/app/dashboard/pages/vender-autos/components/sell-your-car/sell-your-car.component';

// Interfaces
import { DataSellYourCar, SellYourCar } from '../../interfaces/sell-your-car.interface';
import { ValuatorChecklist } from '../../../appraiser/interfaces/valuator.checklist.interface';
import { ChecklistUpdRej } from '../../interfaces/checklistupd-rej.interface';
import { ChecklistUpdBought } from '../../interfaces/checklistupd-bought.interface';
import { SellYourCarValuations } from '../../../appraiser/interfaces/appraiser-datatable.interface';
import { SellCarValuation } from '../../../appraiser/interfaces/sell-car-valuation.interface';
import { Updstandbyparts } from '../../interfaces/update-standby-parts.interface';
import { GetSpareParts } from '../../../spare-parts/interfaces/spare-parts.interface';
import { ChecklistValuation } from '../../../appraiser/interfaces/checklist-valuation.interface';

@Component({
  selector: 'app-sell-your-car',
  templateUrl: './sell-your-cars.component.html',
  styles: [`
    ::ng-deep .mat-step-header .mat-step-icon-selected {
      background-color: #707070 !important; 
    }

    ::ng-deep .mat-step-header .mat-step-icon-state-edit {
      background-color: #FFCB54 !important; 
    }

    ::ng-deep .mat-slide-toggle.mat-checked .mat-slide-toggle-bar {
      background-color: #FFCB54 !important;
    }

    ::ng-deep .mat-slide-toggle.mat-checked .mat-slide-toggle-thumb {
      background-color: #707070 !important;
    }

    ::ng-deep textarea.mat-input-element {
      resize: none !important;
    }
  `]
})

export class SellYourCarsComponent implements OnInit {

  public url: string = environment.baseUrl;

  // MatTableSource
  public displayedColumns: string[] = ['id', 'name', 'surname', 'brand', 'carmodel', 'vin', 'year', 'status', 'preparation', 'actions'];
  public dataSource!: MatTableDataSource<DataSellYourCar>;

  // References for help
  public toggle: Boolean = false;
  public statuSelect: string = '';
  public km: number = 0;
  public versionIni: string = '';
  public myButon: boolean = false;
  public repeat: boolean = true;

  // MatPaginator 
  public length: number = 0;
  public pageIndex: number = 1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Reference id Checklist
  public id!: number; 

  // Refernce localStorage
  public _localS: any;

  // Reference user_id
  public user_id!: number;

  // Reference status Checklist
  public status: string = '';
  public inPreparation: string = '';

  // Reference Slide toggle
  public checked = false;
  public disabled = true;

  constructor(
    private _router: Router,
    private _sellYourCar: SellYourCarService,
    private _appraiserDatatableService: AppraiserDatatableService,
    private _appraiserChecklistService: AppraiserChecklistService,
    private _documentPdfService: DocumentPdfService,
    private _paintingWorksService: PaintingWorksService,
    private _bottomSheet: MatBottomSheet
  ) { 
    // Launch request
    // this.getRequests();

    if (localStorage.getItem('user')) {
      this._localS = JSON.parse(localStorage.getItem('user')!);      
      this.getValuatorsDate(this._localS.id);
    }    
  }

  ngOnInit(): void {
    this.scrollTop();
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }

  public openBottomSheetSellCar(){
    this._bottomSheet.open(SellYourCarComponent);
  }

  /**
   * Get Requests
   * @param page number
   */
  private getRequests(page?: number) {
    this._sellYourCar.getSellYourCarRequets(page)
    .subscribe({
      next: ({ code, status, sell_your_car }: SellYourCar) => {
        if (code === 200 && status === 'success') {          
          // Set Requets
          this.dataSource = new MatTableDataSource(sell_your_car.data);     
          
          // Assign the length data
          this.paginator.length = sell_your_car.total;                 
        }
        for (const val of sell_your_car.data) {
          this.getValuationAll(String(val.id), val.status);
        }
      }
    });
  }

  /**
   * Get Valuators Date
   * @param userId number
   * @param page number
   */
  private getValuatorsDate(userId: number, page?: number){
    this._sellYourCar.getValuatorsDate(userId, page)
    .subscribe({
      next: ({ code, status, sell_your_car }: SellYourCar) => {
        if (code === 200 && status === 'success') {
          // Set Requets
          this.dataSource = new MatTableDataSource(sell_your_car.data);     
          
          // Assign the length data
          this.paginator.length = sell_your_car.total; 
        }else {
          this.getRequests(); // En caso de que el userId no este tomado en cuenta como un valuador en la repartición de citas.
        }
        /* for (const val of sell_your_car.data) {
          this.getValuationAll(String(val.id), val.status);
        } */
        if (this.repeat === true) {
          sell_your_car.data.map(sycd => {
            this.getValuationAll(String(sycd.id), sycd.status);
          });
        }

      }
    });
  }

  private getValuationAll(id:string, currentStatus:string){
    this._appraiserChecklistService.getChecklistValuationall(id)
    .subscribe({
      next: (resp) => {
        if (resp === 1 && currentStatus === 'stand_by') {
          this.status = 'valued_standBy_parts';
          this.updateStandByParts(Number(id));
          this.repeat = false;
          this.getValuatorsDate(this._localS.id);
        }
      }
    });

    this._paintingWorksService.getPaintingWorks(Number(id))
    .subscribe({
      next: (resp) => {
        resp.painting_works.map(hp => {
          if (hp.status === 'on hold' && currentStatus === 'valued_standBy_parts') {
            // console.log(hp.status);
            this.status = 'to_valued';
            this.updateStandByParts(Number(id), true);
            /* this.repeat = false;
            this.getValuatorsDate(this._localS.id); */
          }
        });
      }
    });

    this._appraiserChecklistService.getChecklistAppraiser()
    .subscribe({
      next: ( { Check_List }: ValuatorChecklist ) => {
        if (Check_List.data[0] !== undefined) {
          
          if (Check_List.data[0].hyp !== null && Check_List.data[0].spare_parts !== null && currentStatus === 'buy' || currentStatus === 'preparation') { /* Check_List.data[0].hyp !== 0 && Check_List.data[0].spare_parts !== 0 */
            this.updateStandByParts(Number(id));
            this.myButon = true;
          }

        }
      }
    });

    this._documentPdfService.getDocumentPdf(Number(id))
    .subscribe({
      next: (resp) => {
        if (resp.datos) {
          if (currentStatus === 'valued') {
            this.status = 'buy_offer';
            this.updateStandByParts(Number(id));
            this.repeat = false;
            this.getValuatorsDate(this._localS.id);
          }

        }
      }
    });
  }

  public updateStandByParts(id: number, redirect: boolean = false){
    this._sellYourCar.updateStatusStandByParts(id, { status: this.status })
    .subscribe({
      next: ( (resp: Updstandbyparts) => {
        if (resp.code === '200' && resp.status === 'success') {
          if (redirect) {
            this._router.navigateByUrl('/admin/valuator/vende-tu-auto');
            window.location.reload();
          }
        }
      })
    });
  }

  public updatePreparation(id: string){  /* Antes: id: number */
    this._appraiserChecklistService.getChecklistValuationall(id)
    .subscribe({
      next: (resp) => {
        if (resp === 1) {
          this._sellYourCar.getSellYourCarRequets().subscribe({
            next: ({ sell_your_car }: SellYourCar) => {
              // console.log(sell_your_car);
              const find = sell_your_car.data.some(sc => sc.id == Number(id));
              // console.log(find);
              if (find) {
                const check = sell_your_car.data.filter(sc => sc.id == Number(id));
                // console.log(check);
                if (check[0].status === 'pre_approved' || check[0].status === 'reject' || check[0].status === 'valued_standBy_parts') {
                  Swal.fire({
                    icon: 'error',
                    title: 'Oupps...',
                    text: 'La cotización no se ha realizado, o se ha rechazado la venta.',
                    confirmButtonColor: '#EEB838',
                  });
                }
              }
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oupps...',
            text: 'La valuación para éste auto no se ha realizado.',
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });

          // Redirect
          this._router.navigateByUrl('/admin/valuator/vende-tu-auto');
        }
        
      }
    });
  }

  public updateStatusBought(id: number){
    this._sellYourCar.updateStatusBought(id, { status: this.status, preparation: this.inPreparation, user_id: this.user_id })
    .subscribe({
      next: (resp: ChecklistUpdBought) => {
        // console.log(resp.checklist);
        this.getRequests();
        if (resp.code === '200' && resp.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Status',
            text: 'El status ha cambiado a Comprado',
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Oupps...',
            text: 'El status no pudo actualizarse, intenta mas tarde.',
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });
        }

        // Redirect
        this._router.navigateByUrl('/admin/valuator/vende-tu-auto');
      }
    });
  }

  public updateStatus(id: string){ 

    this._appraiserChecklistService.getChecklistValuationall(id)
    .subscribe({
      next: (resp) => {
        if (resp === 1) {
          this._appraiserChecklistService.getAppraiserChecklist(String(id)).subscribe(
            ( { sell_car_valuation_id }: SellCarValuation) => {
              if (sell_car_valuation_id.status === 'valued') {
                this.statuSelect = 'rejected';
                this.updateStatusRejected(Number(id));
              }
            }
          );
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oupps...',
            text: 'La valuación para éste auto no se ha realizado.',
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });

          // Redirect
          this._router.navigateByUrl('/admin/valuator/vende-tu-auto');
        }
      }
    });
  }

  public updateStatusRejected(id: number){
    this._sellYourCar.updateStatusStandByParts(id, { status: this.statuSelect})
    .subscribe({
      next: ( resp: Updstandbyparts) => {
        if (resp.code === '200' && resp.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Status',
            text: 'El status ha cambiado a Rechazado',
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Oupps...',
            text: 'El status no pudo actualizarse, intenta mas tarde.',
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });
        }

        // Redirect
        this._router.navigateByUrl('/admin/valuator/vende-tu-auto');
        window.location.reload();
      }
    });
  }

  public updateStatusReject(id: number){
    this._sellYourCar.updateStatusReject(id, { status: this.status, preparation: this.inPreparation, user_id: this.user_id } )
    .subscribe( {
      next: (resp: ChecklistUpdRej) => {
        // console.log(resp.checklist.status);
        this.getRequests();
        if (resp.code === '200' && resp.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Status',
            text: 'El status ha cambiado a Rechazado',
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Oupps...',
            text: 'El status no pudo actualizarse, intenta mas tarde.',
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });
        }

        // Redirect
        this._router.navigateByUrl('/admin/valuator/vende-tu-auto');
        
      }
    });
  }

  // Open Bottom Sheet
  public openBottomSheet(id: number, vin: string){
    this._appraiserChecklistService.getChecklistAppraiser()
    .subscribe({
      next: ({ code, status, Check_List }: ValuatorChecklist ) => {
        const find = Check_List.data.some(cl => cl.sell_your_car_id === id); /* cl.id */
        if (code == '200' && status == 'success') {
          if(find) {
            this._bottomSheet.open(CheckviewReqservComponent, {
              data: { id: vin }
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
      }
    });
  }

  public openBottomSheetRating(id: string, vin: string){
    this._appraiserChecklistService.getChecklistValuationall(id)
    .subscribe({
      next: (resp) => {
        // console.log(resp);
        if (resp === 1) {
          this._bottomSheet.open(CheckviewReqservComponent, {
            data: { id: id, vin: vin }
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

  // Open Checklist Form
  public openChecklistForm(id: number, vin: string){
    this._appraiserChecklistService.getChecklistAppraiser()
    .subscribe({
      next: ({ code, status, Check_List }: ValuatorChecklist ) => {
        const find = Check_List.data.some(cl => cl.sell_your_car_id === id);
        if (code == '200' && status == 'success') {
          if(find){
            this._bottomSheet.open(ChecklistFormComponent, {
              data: { vin }
            });
          }
        }
      }
    });
  }

  public sheetService(id: number){
    // console.log('Si entró, el ID es: ', id);
    this.status = 'preparation';
    this.updateStandByParts(Number(id));
  }

  public updateReadyForSale(id: number){
    // console.log('Hola desde última parte', id);
    this.status = 'readyForSale';
    this.updateStandByParts(Number(id), true);
  }

  public updateStatusBuy(id: number){
    this._sellYourCar.updateStatusStandByParts(id, { status: this.statuSelect })
    .subscribe({
      next: ( (resp: Updstandbyparts) => {
        this.getRequests();
      })
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
        this._appraiserChecklistService.getAppraiserChecklist(String(id))
        .subscribe({
          next: ( { sell_car_valuation_id }: SellCarValuation) => {
            if (sell_car_valuation_id.status === 'pre_approved' || sell_car_valuation_id.status === 'reject') {
              this.statuSelect = 'stand_by';
              this.versionIni = 'Ninguna';
              this.km = sell_car_valuation_id.km;
              this.updateStatusPrime(id);
            }
          }
        });
        this.alert();
      } else if (result.isDenied) {
        this.toggle = false;
        this._appraiserChecklistService.getAppraiserChecklist(String(id))
        .subscribe({
          next: ( { sell_car_valuation_id }: SellCarValuation) => {
            if (sell_car_valuation_id.status === 'pre_approved' || sell_car_valuation_id.status === 'reject') {
              this.statuSelect = 'reject';
              this.versionIni = 'Ninguna';
              this.km = sell_car_valuation_id.km;
              this.updateStatusPrime(id);
            }
          }
        });
        this.alert();
      }
    })
  }

  public updateStatusPrime(id: number){
    this._appraiserChecklistService.updateAppraiserKm(id, { km: this.km, status: this.statuSelect, version: this.versionIni, vin: '00000000000000000' })
    .subscribe({
      next: ((resp: SellCarValuation) => {
        // this.getRequests();
        this.getValuatorsDate(this._localS.id);
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

  /**
   * Open Bottom Sheet
   * Documentation Vehicle
   */
  // public openBottomSheetDocumentation(id: number, checklist_id: number) {
  public openBottomSheetDocumentation(id: number) {
    this._appraiserChecklistService.getChecklistValuation(String(id))
    .subscribe({
      next: ({ code, status, DataChecklist }: ChecklistValuation ) => {
        // console.log(code, status, DataChecklist);
        if (code === '200' && status === 'success') {
          this._bottomSheet.open(DocumentationVehicleComponent, {
            data: { 
              // checklist_id, 
              id, 
              tomaAutometrica: DataChecklist.take,
              ventaAutometrica: DataChecklist.sale,
              tomaIntelimotors: DataChecklist.take_intelimotors,
              ventaIntelimotors: DataChecklist.sale_intelimotors
            }
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

  public statusOutstanding(id: number){
    // status change to ready_to_buy 
    this.status = 'ready_to_buy';
    this.updateStandByParts(Number(id), true);
  }

  /**
   * Filter data
   * @param event Event
   */
  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();    
  }

  /**
   * Pagination Change
   * @param event PageEvent
   */
  public paginationChange(event: PageEvent) {
    // this.getRequests(event.pageIndex + 1);
    this.getValuatorsDate(this._localS.id, event.pageIndex + 1);
    this.scrollTop();   
  }
  /*add content to dom*/
  public addDom(valor:number):string{
    const div:string = "<td><img class='icon__table'></img></td>"
    const screan:number = screen.width;
    const valuestable:string[] = ['ID','Nombre','Apellido','Marca','Modelo','Vin','Año','estatus','preparacion','acciones'];
    return valuestable[valor];
  }
}