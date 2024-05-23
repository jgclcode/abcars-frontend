import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountantRoutingModule } from './accountant-routing.module';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { AdministrationModule } from '../../administration.module';

// Components
import { AccountantDashboardComponent } from './pages/accountant-dashboard/accountant-dashboard.component';
import { BuyVehiclesComponent } from './pages/buy-vehicles/buy-vehicles.component';


@NgModule({
  declarations: [
    AccountantDashboardComponent,
    BuyVehiclesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    AccountantRoutingModule,
    AdministrationModule
  ]
})

export class AccountantModule { }
