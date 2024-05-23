import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Modules
import { MaintenanceAutoRoutingModule } from './maintenance-auto-routing.module';
// import { AngularMaterialModule } from "src/app/angular-material/angular-material.module";
import { AngularMaterialModule } from "./../../../../../src/app/angular-material/angular-material.module";

// Components
import { AutomotiveMaintenanceComponent } from './components/automotive-maintenance/automotive-maintenance.component';
import { AutomotiveComponent } from './components/automotive/automotive.component';


@NgModule({
  declarations: [
    AutomotiveMaintenanceComponent,
    AutomotiveComponent
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaintenanceAutoRoutingModule
  ]
})
export class MaintenanceAutoModule { }
