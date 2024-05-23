import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RequestQuoteRoutingModule } from './request-quote-routing.module';
import { RequestqComponent } from './components/requestq/requestq.component';

import { AngularMaterialModule } from '../../../angular-material/angular-material.module';
import { RequestOfferComponent } from './components/requestOffer/requestOffer.component';
import { RequestSetAsideComponent } from './requestSetAside/requestSetAside.component';
import { SafePipe } from './pipes/safe.pipe';
import { QuoteRequestComponent } from './components/quote-request/quote-request.component';



@NgModule({
  declarations: [
    RequestqComponent,
    RequestOfferComponent,
    RequestSetAsideComponent,
    SafePipe,
    QuoteRequestComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RequestQuoteRoutingModule
  ]
})
export class RequestQuoteModule { }
