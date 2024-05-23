import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { AppraiserDashboardComponent } from './pages/appraiser-dashboard/appraiser-dashboard.component';
import { AppraiserDatatableComponent } from './pages/appraiser-datatable/appraiser-datatable.component';

const routes: Routes = [
  { path: '', component: AppraiserDashboardComponent },
  { path: 'valuaciones', component: AppraiserDatatableComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppraiserRoutingModule { }
