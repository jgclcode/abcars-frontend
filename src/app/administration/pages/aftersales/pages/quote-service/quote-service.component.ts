import { Component, OnInit } from '@angular/core';
import { MatTableDataSource as MatTableDataSource } from '@angular/material/table';

// Animations
import Swal from "sweetalert2";

// Interfaces
import { QuoteHistory, Client } from '../../interfaces/quote-history.interface';

// Services
import { AftersaleService } from '../../services/aftersale.service';

@Component({
  selector: 'app-quote-service',
  templateUrl: './quote-service.component.html'
})

export class QuoteServiceComponent implements OnInit {

  // References
  public spinner: boolean = false;
  public step: number = 0;
  public search: string = 'demo@abcars.mx';
  public displayedColumns: string[] = ['id', 'name', 'surname', 'email', 'phone', 'actions'];
  public dataSource!: MatTableDataSource<Client>;

  constructor(private _aftersaleService: AftersaleService) { }

  ngOnInit(): void {
    this.scrollTop();
  }

  nextStep() {
    this.step++;
  }

  public scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();
  }

  /**
   * Search client for email or phone
   * @param search String
   */
  public searchClient(search: string) {
    this.spinner = true;

    // Launch API
    this._aftersaleService.getClientsByParams(search)
    .subscribe({
      next: ({ code, status, clients }: QuoteHistory) => {
        if (code === 200 && status === 'success') {
          this.dataSource = new MatTableDataSource(clients);
          this.spinner = false;
          this.nextStep();
        }
      }
    });
  }

}