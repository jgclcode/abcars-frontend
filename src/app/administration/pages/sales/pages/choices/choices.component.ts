import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator as MatPaginator, PageEvent as PageEvent } from "@angular/material/paginator";
import { MatTableDataSource as MatTableDataSource } from "@angular/material/table";
import { MatSort } from '@angular/material/sort';
import { MatDialog as MatDialog } from '@angular/material/dialog';

// Services
import { ChoicesService } from '../../services/choices.service';

// Interfaces
import { Choices } from '../../interfaces/sales.interface';

// Components
import { ClientDialogDataComponent } from 'src/app/administration/components/client-dialog-data/client-dialog-data.component';

@Component({
  selector: 'app-choices',
  templateUrl: './choices.component.html'
})

export class ChoicesComponent implements OnInit {

  // MatTableSource
  public displayedColumns: string[] = ['id', 'amount', 'namePayment', 'status', 'reference', 'vehicle_id', 'amountDate', 'user'];
  public dataSource!: MatTableDataSource<any>;

  // MatPaginator
  public length: number = 0;
  public pageIndex: number = 1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _choicesService: ChoicesService, private _dialog: MatDialog) { 
    // Launch request
    this.getChoices();
  }

  ngOnInit(): void {
    this.scrollTop();
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }

  /**
   * Get Choices
   * @param page number
   */
  private getChoices(page?: number) {
    this._choicesService.getChoices(page)
    .subscribe({
      next: ({ code, status, Choice: choices }: Choices) => {
        if (code === 200 && status === 'success') {
          // Set Requets
          this.dataSource = new MatTableDataSource(choices.data);
          // Assign the length data
          this.paginator.length = choices.total;
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
  }  

  /**
   * Pagination Change
   * @param event PageEvent
   */
   public paginationChange(event: PageEvent) {
    this.getChoices(event.pageIndex + 1);
    this.scrollTop();   
  }

  /**
   * Open Dialog User
   * @param client 
   */
  public openDialogUser(client: string) {
    console.log(client);
    
    this._dialog.open(ClientDialogDataComponent, {
      data: {
        client
      }
    });
  }
  
}