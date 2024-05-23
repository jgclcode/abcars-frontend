import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { MatTableDataSource as MatTableDataSource } from '@angular/material/table';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { ActivatedRoute } from '@angular/router';

// Animations
import Swal from "sweetalert2";
import { MatDialog as MatDialog } from '@angular/material/dialog';

// Services
import { AftersaleService } from '../../services/aftersale.service';

// Interfaces
import { QuoteHistory, DataQuoteHistory, GetFeatures, Feature, FeaturesByQuote } from '../../interfaces/quote-history.interface';
import { QuoteUpdate } from '../../interfaces/quote-update.interface';
interface Features {
  status: string;
  quote_id: number;
  service_feature_id: number;
}

// Change location app
import localeESMX from "@angular/common/locales/es-MX";
import { registerLocaleData } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
registerLocaleData(localeESMX);

// Pipes
import { DatePipe } from '@angular/common';

// Components
import { FeaturesQuoteComponent } from '../features-quote/features-quote.component';

@Component({
  selector: 'app-quote-history',
  templateUrl: './quote-history.component.html',
  providers: [
    { provide: LOCALE_ID, useValue: 'es-MX' },
    DatePipe
  ]
})

export class QuoteHistoryComponent implements OnInit {

  // References
  public step = 0;
  public form!: UntypedFormGroup;
  public spinner: boolean = false;
  public features: Feature[] = [];
  public titleFeatures: string = '';
  public serviceID: number = 0;
  public order: string = '';

  public minDate: Date = new Date();
  public maxDate: Date = new Date(new Date().setDate( new Date().getDate() + 365));

  public features_add: Features[] = [];

  // MatPaginator 
  public lengthPending: number = 0;
  public pageIndexPending: number = 1;
  public lengthSuccess: number = 0;
  public pageIndexSuccess: number = 1;

  public displayedColumns: string[] = ['id', 'brand', 'carmodel', 'vin', 'service', 'status', 'quoteDate', 'actions'];
  public dataSource!: MatTableDataSource<DataQuoteHistory>;

  public displayedColumnsSF: string[] = ['id', 'brand', 'carmodel', 'vin', 'service', 'status', 'quoteDate', 'actions'];
  public dataSourceSF!: MatTableDataSource<DataQuoteHistory>;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _aftersales: AftersaleService,
    private _formBuilder: UntypedFormBuilder,
    private _datePipe: DatePipe,
    public _dialog: MatDialog
  ) { 
    // Init form
    this.createForm();
  }

  ngOnInit(): void {
    this.scrollTop();
    this.getQuotesProgress();
    this.getQuotesSuccess();
  }  

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  public scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();
  }

  /**
   * Create Form
   */
  private createForm() {
    this.form = this._formBuilder.group({
      status: ['successful'],
      incomeService: ['', [Validators.required]],
      admissionDate: ['', [Validators.required]],
      incomeKM: ['', [Validators.required]],
      features: ['', [Validators.required]],
      quote_id: ['', [Validators.required]]
    });
  }

  /**
   * GET Quotes by client_id
   * and status quote
   */
  private getQuotesProgress(page?: number) {
    this._aftersales.getClientsByParams(this._activatedRoute.snapshot.params.client_id, 'active', 'progress', page)
    .subscribe({
      next: ({ code, status, quotes }: QuoteHistory) => {
        if (code === 200 && status === 'success') {
          this.dataSource = new MatTableDataSource(quotes.data);

          // Assign the length data
          this.lengthPending = quotes.total;
        }
      }
    });
  }

  /**
   * GET Quotes in status success
   */
  private getQuotesSuccess(page?: number) {
    this._aftersales.getClientsByParams(this._activatedRoute.snapshot.params.client_id, 'active', 'successful', page)
    .subscribe({
      next: ({ code, status, quotes }: QuoteHistory) => {
        if (code === 200 && status === 'success') {
          this.dataSourceSF = new MatTableDataSource(quotes.data);

          // Assign the length data
          this.lengthSuccess = quotes.total;
        }
      }
    });
  }

  /**
   * GET features for service
   * @param service Object
   */
  public getFeatures(quote: any) {
    // Reset form and clean inputs
    this.createForm();
    this.form.controls['quote_id'].setValue(quote.id);
    this.titleFeatures = quote.services[0].name;
    this.serviceID = quote.services[0].id;
    this.order = quote.order;

    if (quote.services[0].id > 3) {
      this.form.controls['incomeService'].setValue('N/A');
    }

    this._aftersales.getServiceFeatureById(quote.services[0].id)
    .subscribe({
      next: ({ code, status, features }: GetFeatures) => {
        if (code === '200' && status === 'success') {
          this.features = features;
          this.nextStep();
        }
      }
    });
  }

  /**
   * GET Geatures by Quote
   * @param quote_id Number
   */
  public getFeaturesByQuote(quote_id: number) {
    this._aftersales.getFeaturesByQuote(quote_id)
    .subscribe({
      next: ({ code, status, Service_responses }: FeaturesByQuote) => {
        if (code === 200 && status === 'success') {
          this._dialog.open(FeaturesQuoteComponent, {
            data: {
              Service_responses,
            },
          });
        }
      }
    });
  }

  /**
   * Launch forms
   */
  public onSubmit() {
    this.spinner = true;

    // Set new value in control date
    this.form.patchValue({
      incomeService: String(this.form.get('incomeService')?.value),
      admissionDate: this._datePipe.transform(this.form.get('admissionDate')!.value, "yyyy-MM-dd"),
      incomeKM: String(this.form.get('incomeKM')?.value)
    });
    
    // Change Quote
    this._aftersales.quoteUpdate(this.form.value, this.form.get('quote_id')?.value)
    .subscribe({
      next: ({ code, status }: QuoteUpdate) => {
        if (code === '200' && status === 'success') {

          let count = 0;
          this.features_add.forEach(feature => {
            this._aftersales.postFeature(feature)
            .subscribe({
              next: ({ code, status }: QuoteUpdate) => {
                count++;

                if (code === '200' && status === 'success') {
                  if (this.features_add.length === count) {
                    Swal.fire({
                      icon: 'success',
                      text: 'Cita actualizada y especificaciones del mantenimiento actualizadas',
                      showConfirmButton: true,
                      confirmButtonColor: '#EEB838',
                      timer: 3500         
                    });

                    this.spinner = false;
                    this.createForm();
                    this.ngOnInit();
                    this.step = 0;
                  }
                } else {
                  Swal.fire({
                    icon: 'error',
                    text: 'Lo sentimos, al parecer no se pudo actualizar la cita de servicio, vuelve a intentarlo.',
                    showConfirmButton: true,
                    confirmButtonColor: '#EEB838',
                    timer: 3500         
                  });

                  this.spinner = false;
                }
              }
            });
          });
        }
      }
    });
  }

  /**
   * SET Features to form
   * @param status String
   * @param service_feature_id Number
   */
  public addFeature(status: string, service_feature_id: number) {
    // If not exists, push to features array
    this.features_add.filter((feature, idx) => {
      if (this.features_add[idx].service_feature_id === service_feature_id) {
        this.features_add.splice(idx, 1);
      }
    });

    // Check features not to repeat them
    this.features_add.push({
      status,
      quote_id: this.form.get('quote_id')?.value,
      service_feature_id,
    });

    // Ser values into featurs array
    this.form.get('features')?.setValue(this.features_add);
  }

  /**
   * Pagination Change in status Pending
   * @param event PageEvent
   */
  public paginationChangePending(event: PageEvent) {
    this.getQuotesProgress(event.pageIndex + 1);
    this.scrollTop();
  }

  /**
   * Pagination Change in status Success
   * @param event PageEvent
   */
  public paginationChangeSuccess(event: PageEvent) {
    this.getQuotesSuccess(event.pageIndex + 1);
    this.scrollTop();
  }

}