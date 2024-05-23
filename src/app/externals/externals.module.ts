import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { ExternalsRoutingModule } from './externals-routing.module';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { ComprarAutosModule } from '../dashboard/pages/comprar-autos/comprar-autos.module';

// Components
import { PrivacyOfUseComponent } from './pages/privacy-of-use/privacy-of-use.component';
import { TermsConditionsComponent } from './pages/terms-conditions/terms-conditions.component';
import { ExternalBuyYourCarComponent } from './pages/external-buy-your-car/external-buy-your-car.component';
import { DetailComponent } from './components/detail/detail.component';
import { HypComponent } from './pages/hyp/hyp.component';

@NgModule({
  declarations: [    
    PrivacyOfUseComponent, 
    TermsConditionsComponent, 
    ExternalBuyYourCarComponent, 
    DetailComponent, HypComponent
  ],
  imports: [
    CommonModule,
    ExternalsRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    AngularMaterialModule,
    ComprarAutosModule
  ]
})

export class ExternalsModule { }