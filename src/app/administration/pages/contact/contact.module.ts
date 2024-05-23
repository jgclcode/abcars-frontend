import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { ContactRoutingModule } from './contact-routing.module';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { AdministrationModule } from '../../administration.module';

// Components
import { ContactDashboardComponent } from './pages/contact-dashboard/contact-dashboard.component';
import { SellYourCarContactComponent } from './pages/sell-your-car-contact/sell-your-car-contact.component';

@NgModule({
  declarations: [
    ContactDashboardComponent,
    SellYourCarContactComponent
  ],
  imports: [
    CommonModule,
    ContactRoutingModule,
    AngularMaterialModule,
    AdministrationModule
  ]
})
export class ContactModule { }
