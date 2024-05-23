import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ShieldComponent } from './pages/shield/shield.component';
import { ShieldCreateComponent } from './pages/shield/shield-create.component';
import { PromotionComponent } from './pages/promotion/promotion.component';
import { AddComponent } from './pages/promotion/add/add.component';
import { SetShieldComponent } from './pages/promotion/set-shield/set-shield.component';
import { EditComponent } from './pages/promotion/edit/edit.component';
import { InsurancePoliciesComponent } from './pages/insurance-policies/insurance-policies.component';
import { GenerateInsurancePolicieComponent } from './pages/generate-insurance-policie/generate-insurance-policie.component';
import { RegisterUserComponent } from './pages/register-user/register-user.component';
import { PubliserComponent } from './pages/publiser/publiser.component';
import { ValuationQuotesComponent } from './pages/valuationQuotes/valuationQuotes.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'shields', component: ShieldComponent },  
  { path: 'shields/create', component: ShieldCreateComponent },
  { path: 'shields/update/:shield_id', component: ShieldCreateComponent },
  { path: 'promotions', component: PromotionComponent }, 
  { path: 'promotions/add/:vin', component: AddComponent }, 
  { path: 'promotions/set-shield/:vin', component: SetShieldComponent },
  { path: 'promotions/edit/:vin', component: EditComponent },  
  // { path: 'insurance-policies', component: InsurancePoliciesComponent },
  { path: 'valuation-quotes', component: ValuationQuotesComponent },
  { path: 'publisher/:vehicle_id', component: PubliserComponent }, 
  { path: 'generate-insurance-policie/:client_id/:vehicle_id', component: GenerateInsurancePolicieComponent }, 
  { path: 'register-user', component: RegisterUserComponent }, 
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestorRoutingModule { }
