import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { AppraiserTechnicianDashboardComponent } from './pages/appraiser-technician-dashboard/appraiser-technician-dashboard.component';
import { TecvalComponent } from './pages/tecval/tecval.component';

const routes: Routes = [
  { path: '', component: AppraiserTechnicianDashboardComponent }, 
  { path: 'sell_your_cars', component: TecvalComponent }, 
  { path: '**', pathMatch: 'full', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AppraiserTechnicianRoutingModule { }
