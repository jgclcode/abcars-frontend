import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { ContactDashboardComponent } from './pages/contact-dashboard/contact-dashboard.component';
import { SellYourCarContactComponent } from './pages/sell-your-car-contact/sell-your-car-contact.component';

const routes: Routes = [
  { path: '', component: ContactDashboardComponent },
  { path: 'vender-tu-auto', component: SellYourCarContactComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ContactRoutingModule { }
