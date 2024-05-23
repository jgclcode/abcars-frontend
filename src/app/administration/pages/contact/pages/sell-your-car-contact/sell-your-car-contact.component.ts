import { Component, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatPaginator as MatPaginator, PageEvent as PageEvent } from '@angular/material/paginator';
import { MatTableDataSource as MatTableDataSource } from '@angular/material/table';

// Interfaces
import { DataSellYourCar, SellYourCar } from '../../../valuator/interfaces/sell-your-car.interface';

// Services
import { SellYourCarService } from '../../../valuator/services/sell-your-car.service';

// Change location app
import localeESMX from "@angular/common/locales/es-MX";
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeESMX);

@Component({
  selector: 'app-sell-your-car-contact',
  templateUrl: './sell-your-car-contact.component.html',
  providers: [
    { provide: LOCALE_ID, useValue: 'es-MX' }
  ]
})

export class SellYourCarContactComponent implements OnInit {

  // MatTableSource
  public displayedColumns: string[] = ['id', 'name', 'surname', 'phone', 'email', 'brand', 'carmodel', 'vin', 'year', 'date', 'hour'];
  public dataSource!: MatTableDataSource<DataSellYourCar>;

  // MatPaginator 
  public length: number = 0;
  public pageIndex: number = 1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _sellYourCar: SellYourCarService) { 
    // Launch
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
      }
    });
  }

  /**
   * Filter data
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
    this.getRequests(event.pageIndex + 1);
    this.scrollTop();
  }

}
