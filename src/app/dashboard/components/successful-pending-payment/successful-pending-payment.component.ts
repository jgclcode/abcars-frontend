import { Component, OnInit } from '@angular/core';
import { MatTableDataSource as MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
// import { Payments } from '../../interfaces/payments.interface';


@Component({
    selector: 'app-successful-pending-payment',
    templateUrl: './successful-pending-payment.component.html',
    styleUrls: ['./successful-pending-payment.component.css'],
})
export class SuccessfulPendingPaymentComponent implements OnInit {
    // References
    // public resp_pending_id: number;
    // public resp_pending_title: string;
    // public resp_pending_totalPay: number;
    // public resp_pending_status: string;
    // public resp_pending_status_detail: string;
    public resp_pending_redirect_url: string;

    // MatTableSource
    public displayedColumns: string[] = ['id_reference', 'name', 'pay', 'status', 'status_detail'];
    // public dataSource!: MatTableDataSource<Payments>
    public dataSource: any[] = [];

    constructor(
        private _activatedRoute: ActivatedRoute
    ){
        this._activatedRoute.params
            .subscribe({
                next: (params) => {
                    console.log(params);
                    
                    const resp_pending_id = params['id'];
                    const resp_pending_title = params['title'];
                    const resp_pending_totalPay = params['totalPay'];
                    const resp_pending_status = params['status'];
                    const resp_pending_status_detail = params['status_detail'];
                    this.resp_pending_redirect_url = params['redirect_url'];

                    this.dataSource = [{resp_pending_id, resp_pending_title, resp_pending_totalPay, resp_pending_status, resp_pending_status_detail}];
                    console.log(this.dataSource);
                    
                }
            });
    }

    ngOnInit(): void { }

    public getUrl(){
        return this.resp_pending_redirect_url;
    }

}
