import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { AutomotiveMaintenanceComponent } from './components/automotive-maintenance/automotive-maintenance.component';
import { AutomotiveComponent } from './components/automotive/automotive.component';

const routes: Routes = [
  { path: '', component: AutomotiveComponent},
  { path: 'automotriz', component: AutomotiveMaintenanceComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceAutoRoutingModule { }
