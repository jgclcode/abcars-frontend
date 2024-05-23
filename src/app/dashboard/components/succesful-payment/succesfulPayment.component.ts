import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-succesful-payment',
    templateUrl: './succesfulPayment.component.html',
    styleUrls: ['./succesfulPayment.component.css'],
})
export class SuccesfulPaymentComponent implements OnInit {
    // References
    public resp_id: number;
    public resp_title: string;
    public resp_totalPay: number;
    public resp_status: string;
    public resp_status_detail: string;

    constructor(
        private _activateRoute: ActivatedRoute
    ) {
        this._activateRoute.params
            .subscribe({
                next: (params) => {
                    this.resp_id = params['id'];
                    this.resp_title = params['title'];
                    this.resp_totalPay = params['totalPay'];
                    this.resp_status = params['status'];
                    this.resp_status_detail = params['status_detail']
                    console.log(this.resp_id, this.resp_title,
                        this.resp_totalPay, this.resp_status);
                }
            });
    }

    ngOnInit(): void { }

}
