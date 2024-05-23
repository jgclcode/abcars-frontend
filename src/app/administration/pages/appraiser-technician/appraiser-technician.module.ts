import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { AppraiserTechnicianRoutingModule } from './appraiser-technician-routing.module';
import { AdministrationModule } from '../../administration.module';
import { DataTablesModule } from 'angular-datatables';

// Components
import { AppraiserTechnicianDashboardComponent } from './pages/appraiser-technician-dashboard/appraiser-technician-dashboard.component';
import { RevisionExternalPictureComponent } from './components/revision-external-picture/revision-external-picture.component';
import { InternalReviewPictureComponent } from './components/internal-review-picture/internal-review-picture.component';
import { SparePartsComponent } from './components/spare-parts/spare-parts.component';
import { TecvalComponent } from './pages/tecval/tecval.component';
import { RevisionInternalPictureComponent } from './components/revision-internal-picture/revision-internal-picture.component';

@NgModule({
  declarations: [
    AppraiserTechnicianDashboardComponent,
    RevisionExternalPictureComponent,
    InternalReviewPictureComponent,
    SparePartsComponent,
    TecvalComponent,
    RevisionInternalPictureComponent,
  ],
  imports: [
    CommonModule,
    AppraiserTechnicianRoutingModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AdministrationModule,
    DataTablesModule
  ]
})

export class AppraiserTechnicianModule { }