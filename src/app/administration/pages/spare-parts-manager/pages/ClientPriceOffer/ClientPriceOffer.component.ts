import { CommonModule } from '@angular/common';
import { Component, ViewChild, type OnInit, ElementRef } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource as MatTableDataSource } from '@angular/material/table';
import { AppraiserDatatableService } from '../../../appraiser/services/appraiser-datatable.service';
import { PriceOfferClients } from '../../../appraiser/interfaces/client-price-offer.interface';
import { SheetQuotesOffer } from '../../interfaces/sheet_quote_offer.interface';

@Component({
    selector: 'app-client-price-offer',
    standalone: false,
    // imports: [
    //     CommonModule,
    // ],
    templateUrl: './ClientPriceOffer.component.html',
    styleUrls: ['./ClientPriceOffer.component.css'],
})
export class ClientPriceOfferComponent implements OnInit {

    // MatTableSource
    public displayedColumns: string[] = ['id', 'clientName', 'clientSurname', 'clientPhone', 'vehicleVin', 'vehicleModel', 'vehiclePriceOriginal', 'clientPriceOffer']; /** */
    public dataSource: MatTableDataSource<any>

    // MatPaginator 
    public length: number = 0;
    public pageIndex: number = 1;
    
    public valor: string = '';
    public pageSize: number = 10;
    public flag_pag: boolean = true;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild('txtFilter') txtFilter:ElementRef<HTMLInputElement>

    constructor( private _clientPriceOfferService: AppraiserDatatableService){
        this.getPriceOfferClients();
    }

    ngOnInit(): void { }

    scrollTop() {
        var scrollElem = document.querySelector('#moveTop');
        scrollElem!.scrollIntoView();  
    } 

    private getPriceOfferClients(page?: number){
        this._clientPriceOfferService.getClientPriceOffer(page)
            .subscribe({
                next: ({ code, status, client_price_offer}: PriceOfferClients) => {
                    // console.log(client_price_offer);
                    if (code === 200 && status === 'success') {
                        this.dataSource = new MatTableDataSource(client_price_offer.data);
                        // paginator
                        this.paginator.length = client_price_offer.total;
                    }
                }
            });
    }

    /**
   * Pagination Change
   * @param event PageEvent
   */
  public paginationChange(event: PageEvent) {
    if (this.flag_pag) {
        this.getPriceOfferClients(event.pageIndex + 1);
        this.scrollTop();   
    }else{
        this.filter(event.pageIndex + 1);
        this.scrollTop();
    }
  }

  filter(page?: number){
    if (this.txtFilter.nativeElement.value) {
        this.valor = this.txtFilter.nativeElement.value;
        
        this._clientPriceOfferService.searchPriceOffer(this.valor, this.pageSize, page)
            .subscribe(
                // ( resp => {
                //     console.log(resp.sheet_quotes.data);
                // })
                ({ code, status, sheet_quotes }: SheetQuotesOffer) => { 
                    // console.log(sheet_quotes);
                    
                    if (code === 200 && status === 'success') {
                        this.dataSource = new MatTableDataSource(sheet_quotes.data);
                        this.paginator.length = sheet_quotes.total;
                    }
                }
            );
            this.flag_pag = false;
    }else{
        this.valor = '';
        this.getPriceOfferClients();
        this.flag_pag = true;
    }
  }


}
