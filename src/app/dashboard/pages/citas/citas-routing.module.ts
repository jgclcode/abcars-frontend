import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

// Components
import { ServicioComponent } from './pages/servicio/servicio.component';

const routes: Routes = [  
  { path: 'servicio', component: ServicioComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'servicio' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CitasRoutingModule { }
