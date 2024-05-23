import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { SparePartsManagerRoutingModule } from './spare-parts-manager-routing.module';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { AdministrationModule } from '../../administration.module';
import { DataTablesModule } from 'angular-datatables';

// Components
import { SparePartsManagerDashboardComponent } from './pages/spare-parts-manager-dashboard/spare-parts-manager-dashboard.component';
import { SparePartsAdministrationComponent } from './pages/spare-parts-administration/spare-parts-administration.component';
import { SparePartsEditComponent } from './components/spare-parts-edit/spare-parts-edit.component';
import { SparePartsEditManagerComponent } from './components/spare-parts-edit-manager/spare-parts-edit-manager.component';
import { SparePartsManagerPrintValuationComponent } from './components/spare-parts-manager-print-valuation/spare-parts-manager-print-valuation.component';
import { ClientPriceOfferComponent } from './pages/ClientPriceOffer/ClientPriceOffer.component';

@NgModule({
  declarations: [
    SparePartsManagerDashboardComponent,
    SparePartsAdministrationComponent,
    ClientPriceOfferComponent,
    SparePartsEditComponent,
    SparePartsEditManagerComponent,
    SparePartsManagerPrintValuationComponent
  ],
  imports: [
    CommonModule,
    SparePartsManagerRoutingModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AdministrationModule,
    DataTablesModule
  ]
})
export class SparePartsManagerModule { }
