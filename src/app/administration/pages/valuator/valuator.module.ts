import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { ValuatorRoutingModule } from './valuator-routing.module';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { AdministrationModule } from '../../administration.module';

// Components
import { ValuatorDashboardComponent } from './pages/valuator-dashboard/valuator-dashboard.component';
import { SellYourCarsComponent } from './pages/sell-your-cars/sell-your-cars.component';
import { RequestSellCarComponent } from './pages/request-sell-car/request-sell-car.component';
import { CheckviewReqservComponent } from './pages/checkview-reqserv/checkview-reqserv.component';
import { DocumentationVehicleComponent } from './components/documentation-vehicle/documentation-vehicle.component';
import { PaintingWorksComponent } from './components/painting-works/painting-works.component';

@NgModule({
  declarations: [
    ValuatorDashboardComponent,
    SellYourCarsComponent,
    RequestSellCarComponent,
    CheckviewReqservComponent,
    DocumentationVehicleComponent,
    PaintingWorksComponent
  ],
  imports: [
    CommonModule,
    ValuatorRoutingModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AdministrationModule
  ]
})

export class ValuatorModule { }
