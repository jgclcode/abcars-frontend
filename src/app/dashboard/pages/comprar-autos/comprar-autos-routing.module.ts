import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { CompraTuAutoComponent } from './pages/compra-tu-auto/compra-tu-auto.component';
import { DetailComponent } from './pages/detail/detail.component';
import { AcquisitionFormComponent } from './pages/acquisition-form/acquisition-form.component';

const routes: Routes = [
  { path: '', component: CompraTuAutoComponent },
  { path: 'detail/:vin', component: DetailComponent },
  { path: 'detail/:vin/:userId', component: DetailComponent },
  { path: ':marca/:modelo/:anio/:precio/:carroceria/:estado/:busqueda/:transmision/:pagina', component: CompraTuAutoComponent },  
  { path: 'acquisition/vehicle/:method/:vin', component: AcquisitionFormComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ComprarAutosRoutingModule { }
