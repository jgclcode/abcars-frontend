import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Components
import { CheckRoleComponent } from './components/check-role/check-role.component';
import { OverviewComponent } from './components/overview/overview.component';
import { ClientDialogDataComponent } from './components/client-dialog-data/client-dialog-data.component';
import { ChecklistGerericComponent } from './components/checklist-gereric/checklist-gereric.component';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { SparePartsManagerRoutingModule } from './pages/spare-parts-manager/spare-parts-manager-routing.module';

// Modules
import { AdministrationRoutingModule } from './administration-routing.module';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { DeveloperRoutingModule } from './pages/developer/developer-routing.module';
import { MarketingRoutingModule } from './pages/marketing/marketing-routing.module';
import { AppraiserRoutingModule } from './pages/appraiser/appraiser-routing.module';
import { ValuatorRoutingModule } from './pages/valuator/valuator-routing.module';
import { SalesRoutingModule } from './pages/sales/sales-routing.module';
import { AftersalesRoutingModule } from './pages/aftersales/aftersales-routing.module';
import { GestorRoutingModule } from './pages/gestor/gestor-routing.module';
import { AppraiserTechnicianRoutingModule } from './pages/appraiser-technician/appraiser-technician-routing.module';
import { SparePartsRoutingModule } from './pages/spare-parts/spare-parts-routing.module';
import { ContactRoutingModule } from './pages/contact/contact-routing.module';
import { AccountantRoutingModule } from './pages/accountant/accountant-routing.module';
import { SellerRoutingModule } from './pages/seller/seller-routing.module'
// import { PinturesComponent } from './pages/pintures/pintures.component';
// import { DashboardRoutingModule } from './pages/form_check/dashboard-routing.module';
import { SparePartsOverviewComponent } from './components/spare-parts-overview/spare-parts-overview.component';

@NgModule({
  declarations: [    
    CheckRoleComponent,
    OverviewComponent,
    ClientDialogDataComponent,
    ChecklistGerericComponent,
    NotAuthorizedComponent,
    // PinturesComponent,
    SparePartsOverviewComponent,

  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,   
    AngularMaterialModule, 
    FormsModule,
    ReactiveFormsModule,
    DeveloperRoutingModule,    
    MarketingRoutingModule,    
    AppraiserRoutingModule,
    ValuatorRoutingModule,
    SalesRoutingModule,
    AftersalesRoutingModule,
    GestorRoutingModule,
    AppraiserTechnicianRoutingModule,
    SparePartsRoutingModule,
    SparePartsManagerRoutingModule,
    ContactRoutingModule,
    AccountantRoutingModule,
    SellerRoutingModule,
    // DashboardRoutingModule,
  
  ],
  exports: [
    OverviewComponent,
    ClientDialogDataComponent
  ]
})

export class AdministrationModule { }
