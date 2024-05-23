import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { ExternalBuyYourCarComponent } from './pages/external-buy-your-car/external-buy-your-car.component';
import { PrivacyOfUseComponent } from './pages/privacy-of-use/privacy-of-use.component';
import { TermsConditionsComponent } from './pages/terms-conditions/terms-conditions.component';
import { HypComponent } from './pages/hyp/hyp.component';

const routes: Routes = [
  { path: 'compra-tu-auto', component: ExternalBuyYourCarComponent },
  { path: 'compra-tu-auto/:marca/:modelo/:anio/:precio/:carroceria/:estado/:busqueda/:pagina', component: ExternalBuyYourCarComponent },
  { path: 'privacidad-de-uso', component: PrivacyOfUseComponent },
  { path: 'terminos-y-condiciones', component: TermsConditionsComponent },
  { path: 'hyp', component: HypComponent },
  { path: 'full', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ExternalsRoutingModule { }
