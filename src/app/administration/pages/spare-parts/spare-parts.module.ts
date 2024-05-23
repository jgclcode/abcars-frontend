import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { SparePartsRoutingModule } from './spare-parts-routing.module';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdministrationModule } from '../../administration.module';
import { DataTablesModule } from 'angular-datatables';

// Components
import { SparePartsDashboardComponent } from './pages/spare-parts-dashboard/spare-parts-dashboard.component';
import { SparePartsAdministrationComponent } from './pages/spare-parts-administration/spare-parts-administration.component';
import { SparePartsEditComponent } from './components/spare-parts-edit/spare-parts-edit.component';
import { EditSparePartComponent } from './components/edit-spare-part/edit-spare-part.component';

@NgModule({
  declarations: [
    SparePartsDashboardComponent,
    SparePartsAdministrationComponent,
    SparePartsEditComponent,
    EditSparePartComponent
  ],
  imports: [
    CommonModule,
    SparePartsRoutingModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AdministrationModule,
    DataTablesModule
  ]
})

export class SparePartsModule { }
