import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Modules
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { CitasRoutingModule } from './citas-routing.module';

// Components
import { HomeComponent } from './pages/home/home.component';
import { ServicioComponent } from './pages/servicio/servicio.component';

@NgModule({
  declarations: [
    HomeComponent,
    ServicioComponent,
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CitasRoutingModule,
  ]
})

export class CitasModule { }
