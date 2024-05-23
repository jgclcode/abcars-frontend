import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { SalesRoutingModule } from './sales-routing.module';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { AdministrationModule } from '../../administration.module';

// Components
import { SalesDashboardComponent } from './pages/sales-dashboard/sales-dashboard.component';
import { FindmeVehicleComponent } from './pages/findme-vehicle/findme-vehicle.component';
import { ChoicesComponent } from './pages/choices/choices.component';
import { FinancingsComponent } from './pages/financings/financings.component';
import { FinancingDialogDataComponent } from './components/financing-dialog-data/financing-dialog-data.component';
import { SafeURLPipe } from './pipes/safe-url.pipe';


@NgModule({
  declarations: [
    SalesDashboardComponent,
    FindmeVehicleComponent,
    ChoicesComponent,
    FinancingsComponent,
    FinancingDialogDataComponent,
    SafeURLPipe
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    AngularMaterialModule,
    AdministrationModule
  ]
})

export class SalesModule { }
