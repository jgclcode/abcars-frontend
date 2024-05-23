import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { SparePartsDashboardComponent } from './pages/spare-parts-dashboard/spare-parts-dashboard.component';
import { SparePartsAdministrationComponent } from './pages/spare-parts-administration/spare-parts-administration.component';
import { SparePartsEditComponent } from './components/spare-parts-edit/spare-parts-edit.component';

const routes: Routes = [
  { path: '', component: SparePartsDashboardComponent },
  { path: 'vehicles', component: SparePartsAdministrationComponent },
  { path: 'vehicles/edit/:id', component: SparePartsEditComponent },
  { path: '', pathMatch: 'full', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SparePartsRoutingModule { }