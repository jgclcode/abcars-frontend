// import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource as MatTableDataSource} from '@angular/material/table';
import { ValuationQuotesService } from './services/valuation-quotes.service';
import { DataValuationQuotes, ValuationQuotes, GetActiveValuator, ActiveValuator, GetAssignValuator } from './interfaces/valuation-quotes.interface';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { AppraiserChecklistService } from '../../../appraiser/services/appraiser-checklist.service';
import { ValuatorChecklist } from '../../../appraiser/interfaces/valuator.checklist.interface';


@Component({
    selector: 'app-valuation-quotes',
    // standalone: true,
    // imports: [
    //     CommonModule,
    // ],
    templateUrl: './valuationQuotes.component.html',
    styles: [
        '::ng-deep .mat-mdc-select-value { color: #ffcc54be; font-weight: bold; }'
    ]
})
export class ValuationQuotesComponent implements OnInit {
    public displayedColumns: string[] = ['id', 'brand', 'model', 'name', 'surname', 'phone1', 'date', 'hour', 'subsidiary', 'valuator'];
    public dataSource!: MatTableDataSource<DataValuationQuotes>

    public length: number = 0;
    public pageIndex: number = 1;

    public valuators: ActiveValuator[] = [];

    public datas: string[] | null;

    public myFilter: any;
    public myReal: any[] = [];
    
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private _valuationQuotesService: ValuationQuotesService,
        private _appraiserChecklistService: AppraiserChecklistService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void { 
        this.getActiveValuator();
        this.getValuationQuotes();
    }

    public getValuationQuotes(page?: number){
        this._valuationQuotesService.getValuationQuotes(page)
            .subscribe({
                next: ({ valuation_quotes }: ValuationQuotes) => {
                    this.myReal = [];
                    this.dataSource = new MatTableDataSource(valuation_quotes.data);
                    this.paginator.length = valuation_quotes.total;
                    const datas = valuation_quotes.data.map(d => d.sycID != null ? d.sycID : null);
                    this.getChecklistAppraiser( datas);
                }
            });
    }

    public getActiveValuator(){
        this._valuationQuotesService.getActiveValuator()
            .subscribe({
                next: ({ code, active_valuator }:GetActiveValuator) => {
                    this.valuators = (code === 200) ? active_valuator : [];
                }
            });
    }

    public paginationChange(event: PageEvent) {
        this.getValuationQuotes(event.pageIndex +1 );
    }

    public applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    public onChangeValuator(uid: number, sycid: number){
        this._valuationQuotesService.onChangeValuator(uid, sycid)
            .subscribe({
                next: ({ code, status, message }: GetAssignValuator) => {
                    if (code === 200 && status === 'success') {
                        this.alert(message);
                    }
                }
            });
    }

    private alert(msg: string){
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer),
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });

        Toast.fire({
            icon: 'success',
            title: msg
        });
    }

    public getChecklistAppraiser(datos: any){
        this._appraiserChecklistService.getChecklistAppraiser()
            .subscribe({
                next: ({Check_List }: ValuatorChecklist) => {
                    for (let i = 0; i < datos.length; i++) {
                        this.myFilter = Check_List.data.filter(chl => chl.sell_your_car_id === datos[i]);
                        this.myReal.push(this.myFilter);
                    }
                    
                }
            });
            
    }

    public viewRefresh(){
        this.getValuationQuotes(this.pageIndex);
    }

}
