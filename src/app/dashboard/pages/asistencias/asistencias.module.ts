import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { AsistenciasRoutingModule } from './asistencias-routing.module';

// Components
import { AsistenciaVialComponent } from './pages/asistencia-vial/asistencia-vial.component';
import { PaymentsComponent } from './pages/payments/payments.component';

@NgModule({
  declarations: [
    AsistenciaVialComponent,
    PaymentsComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    AsistenciasRoutingModule
  ]
})

export class AsistenciasModule { }
