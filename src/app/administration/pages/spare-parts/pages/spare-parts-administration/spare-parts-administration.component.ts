import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator as MatPaginator, PageEvent as PageEvent } from '@angular/material/paginator';
import { MatTableDataSource as MatTableDataSource } from '@angular/material/table';

// Services
import { AppraiserDatatableService } from '../../../appraiser/services/appraiser-datatable.service';

// Interfaces
import { SellYourCarValuations } from '../../../appraiser/interfaces/appraiser-datatable.interface';

@Component({
  selector: 'app-spare-parts-administration',
  templateUrl: './spare-parts-administration.component.html'
})

export class SparePartsAdministrationComponent implements OnInit {

  // MatTableSource
  public displayedColumns: string[] = ['id', 'clientName', 'clientSurname', 'brandName', 'modelName', 'vin', 'year', 'status', 'statusRefac', 'actions'];
  public dataSource!: MatTableDataSource<any>;

  // MatPaginator 
  public length: number = 0;
  public pageIndex: number = 1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _appraiserDatatableService: AppraiserDatatableService) { 
    this.getSellCars();
  }

  ngOnInit(): void {
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
        if (code === 200 && status === 'success') {
          // Assign the data to the data source for the table to render
          this.dataSource = new MatTableDataSource(sell_your_car.data);

          // Set paginator and sort
          this.paginator.length = sell_your_car.total;
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
    this.getSellCars(event.pageIndex + 1);
    this.scrollTop();
  }

}
