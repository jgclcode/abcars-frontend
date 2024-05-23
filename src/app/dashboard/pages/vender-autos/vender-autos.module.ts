import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Modules
import { VenderAutosRoutingModule } from './vender-autos-routing.module';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';

// Components
import { VenderTuAutoComponent } from './pages/vender-tu-auto/vender-tu-auto.component';
import { SellYourCarComponent } from './components/sell-your-car/sell-your-car.component';

@NgModule({
  declarations: [
    VenderTuAutoComponent,
    SellYourCarComponent
  ],
  imports: [
    CommonModule,
    VenderAutosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
  ]
})

export class VenderAutosModule { }