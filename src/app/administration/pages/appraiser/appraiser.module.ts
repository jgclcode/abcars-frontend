import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Modules
import { AppraiserRoutingModule } from './appraiser-routing.module';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { AdministrationModule } from '../../administration.module';

// Components
import { AppraiserDashboardComponent } from './pages/appraiser-dashboard/appraiser-dashboard.component';
import { ValuatorsComponent } from './pages/valuators/valuators.component';
import { AppraiserDatatableComponent } from './pages/appraiser-datatable/appraiser-datatable.component';
import { ChecklistFormComponent } from './components/checklist-form/checklist-form.component';


@NgModule({
  declarations: [
    AppraiserDashboardComponent,
    ValuatorsComponent,
    AppraiserDatatableComponent,
    ChecklistFormComponent
  ],
  imports: [
    CommonModule,
    AppraiserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    AdministrationModule
  ]
})
export class AppraiserModule { }
