import { Component, ElementRef, OnInit, ViewChild,Renderer2 } from '@angular/core';
import { MatPaginator as MatPaginator, PageEvent as PageEvent } from '@angular/material/paginator';
import { MatTableDataSource as MatTableDataSource } from '@angular/material/table';

// Services
import { AccountantService } from '../../services/accountant.service';

// Animaciones
import Swal from 'sweetalert2';

// Interfaces
import { SellYourCarData, SellYourCarValuations } from '../../../appraiser/interfaces/appraiser-datatable.interface';
import { UpdateSellYourCar } from '../../interfaces/buy-vehicles.interface';

// Datepicker
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-buy-vehicles',
  templateUrl: './buy-vehicles.component.html'
})

export class BuyVehiclesComponent implements OnInit {
  @ViewChild('estimatedPaymentDate') estimatedPaymentDate!: ElementRef<HTMLInputElement>;
  // References of MatTable
  public displayedColumns: string[] = ['id', 'clientName', 'clientSurname', 'brandName', 'modelName',
                                      'vin', 'year', 'status', 'finalOffer', 'estimatedPayment', 'actions'];
  public dataSource!: MatTableDataSource<SellYourCarData>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // MatPaginator
  public length: number = 0;
  public pageIndex: number = 1;

  public minDate: Date = new Date();
  public maxDate: Date = new Date(new Date().setDate( new Date().getDate() + 365));
  /**
   * Filter days
  */
  public myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  constructor(private _accountantService: AccountantService) {
    // Launch methods
    this.getSellYourCars();
  }

  ngOnInit(): void {
    this.scrollTop();
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();
  }

  /**
   * GET Vehicles in
   * status: "L.P. Venta".
   */
  public getSellYourCars(page: number=1) {
    this._accountantService.getAppraiserSellCars(page)
    .subscribe({
      next: ({ code, status, sell_your_car }: SellYourCarValuations) => {
        if (code === 200 && status === 'success') {
          // Assign the data to the data source for the table to render
          this.dataSource = new MatTableDataSource(sell_your_car.data.filter(v=> v.status.toLowerCase() === 'ready_to_buy' || v.status.toLowerCase() === 'buy')); /* || v.status === 'readyForSale' */
          // Set paginator and sort
          this.paginator.length = sell_your_car.total;
        }
      }
    });
  }

  public onSubmit(sell_your_car_id: number, event: MatDatepickerInputEvent<Date>){
    let d = new Date(`${event.value}`);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    let date = [year, month, day].join('-');

    let inputValue = date.split("-").reverse().join("-");
    this.estimatedPaymentDate.nativeElement.value = inputValue;

    this._accountantService.estimatedPaymentDate(sell_your_car_id, inputValue)
    .subscribe({
      next: ({ code, status }: UpdateSellYourCar) => {
        if ( code === '200' && status === 'success') {
          Swal.fire({
            icon: 'success',
            text: 'La fecha de pago estimada ha sido actualizada.',
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          }).then(() => {
            this.getSellYourCars();
          });
        } else {
          Swal.fire({
            icon: 'error',
            text: 'Al parecer ocurrio un error al intentar actualizar esta fecha.',
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 4000
          }).then(() => {
            this.getSellYourCars();
          });
        }
      }
    });
  }
  /**
   * Change status and acquire vehicle.
   * @param sell_your_car_id Number
   */
  public acquireVehicle(sell_your_car_id: number) {
    this._accountantService.updateStatusSellYC(sell_your_car_id, 'buy')
    .subscribe({
      next: ({ code, status }: UpdateSellYourCar) => {
        if (code === '200' && status === 'success') {
          Swal.fire({
            icon: 'success',
            text: 'El vehiculo ha sido actualizado a Comprado.',
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          }).then(() => {
            this.getSellYourCars();
          });
        } else {
          Swal.fire({
            icon: 'error',
            text: 'Al parecer ocurrio un error al intentar actualizar este vehículo.',
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 4000
          }).then(() => {
            this.getSellYourCars();
          });
        }
      }
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
    this.getSellYourCars(event.pageIndex+1);
    this.scrollTop();
  }

}