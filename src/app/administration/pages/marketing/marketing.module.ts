import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

// Modules
import { MarketingRoutingModule } from './marketing-routing.module';
import { AdministrationModule } from '../../administration.module';

// Components
import { MarketingDashboardComponent } from './pages/marketing-dashboard/marketing-dashboard.component';
import { VehiclesComponent } from './pages/vehicles/vehicles.component';
import { VehicleDetailComponent } from './components/vehicle-detail/vehicle-detail.component';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { VehiclePicturesComponent } from './components/vehicle-pictures/vehicle-pictures.component';
import { OrderPicturesComponent } from './components/order-pictures/order-pictures.component';
import { VehicleThsComponent } from './components/vehicle-ths/vehicle-ths.component';

@NgModule({
  declarations: [   
    MarketingDashboardComponent,
    VehiclesComponent,
    VehicleDetailComponent,
    VehiclePicturesComponent,
    OrderPicturesComponent,
    VehicleThsComponent,
  ],
  imports: [
    CommonModule,
    MarketingRoutingModule, 
    FormsModule,   
    AngularMaterialModule,
    AdministrationModule,
    DragDropModule
  ]
})

export class MarketingModule { }
