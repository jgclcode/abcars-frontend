import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { SellerRoutingModule } from './seller-routing.module';
import { AdministrationModule } from '../../administration.module';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// Components
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { VehicleListComponent } from './pages/vehicles-list/vehicles-list.component'
import { DetailComponent } from './pages/vehicles-list/detail/detail.component'
import { AskInformationComponent } from './components/ask-information/ask-information.component';

@NgModule({
  declarations: [
    DashboardComponent,
    VehicleListComponent,
    DetailComponent,
    AskInformationComponent
  ],
  imports: [
    CommonModule,
    SellerRoutingModule,
    AdministrationModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SellerModule { }
