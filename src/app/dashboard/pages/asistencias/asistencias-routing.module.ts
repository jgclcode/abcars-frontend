import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { AsistenciaVialComponent } from './pages/asistencia-vial/asistencia-vial.component';
import { PaymentsComponent } from './pages/payments/payments.component';

const routes: Routes = [
  { path: '', component: AsistenciaVialComponent },
  { path: 'payments', component: PaymentsComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AsistenciasRoutingModule { }
