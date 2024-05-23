import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AftersalesRoutingModule } from './aftersales-routing.module';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { AdministrationModule } from '../../administration.module';

// Components
import { AftersalesDashboardComponent } from './pages/aftersales-dashboard/aftersales-dashboard.component';
import { QuoteServiceComponent } from './pages/quote-service/quote-service.component';
import { IncidentsComponent } from './pages/incidents/incidents.component';
import { IncidentsVehiclesComponent } from './pages/incidents-vehicles/incidents-vehicles.component';
import { QuoteHistoryComponent } from './components/quote-history/quote-history.component';
import { FeaturesQuoteComponent } from './components/features-quote/features-quote.component';

@NgModule({
  declarations: [
    AftersalesDashboardComponent,
    QuoteServiceComponent,
    IncidentsComponent,
    IncidentsVehiclesComponent,
    QuoteHistoryComponent,
    FeaturesQuoteComponent
  ],
  imports: [
    CommonModule,
    AftersalesRoutingModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AdministrationModule
  ]
})

export class AftersalesModule { }
