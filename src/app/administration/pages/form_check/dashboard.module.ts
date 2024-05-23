import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { InicioComponent } from "./inicio/inicio.component";
import { ReportesComponent } from "./reportes/reportes.component";
import { IndexComponent } from "./index/index.component";
import { AdministrationRoutingModule } from "src/app/administration/administration-routing.module";
import { AngularMaterialModule } from "src/app/angular-material/angular-material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { NgxSpinnerModule } from "ngx-spinner";
import { MatDialogModule } from "@angular/material/dialog";
import { PhotoComponent } from './photo/photo.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { ReportPhotoComponent } from './report-photo/report-photo.component';
import { AdministrationModule } from "src/app/administration/administration.module";
@NgModule({
  declarations: [
    DashboardComponent,
    InicioComponent,
    ReportesComponent,
    IndexComponent,
    PhotoComponent,
    ReportPhotoComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    CommonModule,
    AdministrationRoutingModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    NgxSpinnerModule,
    MatDialogModule,
    MatProgressBarModule,
    AdministrationModule
  ],
})
export class DashboardModule {}