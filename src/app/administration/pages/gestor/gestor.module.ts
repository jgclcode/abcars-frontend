import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestorRoutingModule } from './gestor-routing.module';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdministrationModule } from '../../administration.module';

// Components
import { ShieldComponent } from './pages/shield/shield.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ShieldCreateComponent } from './pages/shield/shield-create.component';
import { PromotionComponent } from './pages/promotion/promotion.component';
import { AddComponent } from './pages/promotion/add/add.component';
import { SetShieldComponent } from './pages/promotion/set-shield/set-shield.component';
import { UploadPromotionsComponent } from './components/upload-promotions/upload-promotions.component';
import { InsurancePoliciesComponent } from './pages/insurance-policies/insurance-policies.component';
import { GenerateInsurancePolicieComponent } from './pages/generate-insurance-policie/generate-insurance-policie.component';
import { RegisterUserComponent } from './pages/register-user/register-user.component';
import { EditComponent } from './pages/promotion/edit/edit.component';
import { OrderShieldImagesComponent } from './components/order-shield-images/order-shield-images.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PubliserComponent } from './pages/publiser/publiser.component';
import { ValuationQuotesComponent } from './pages/valuationQuotes/valuationQuotes.component';


@NgModule({
  declarations: [
    ShieldComponent,
    DashboardComponent,
    ShieldCreateComponent,
    PromotionComponent,
    AddComponent,
    SetShieldComponent,
    UploadPromotionsComponent,
    InsurancePoliciesComponent,
    GenerateInsurancePolicieComponent,
    RegisterUserComponent,
    EditComponent,
    OrderShieldImagesComponent,
    PubliserComponent,
    ValuationQuotesComponent
  ],
  imports: [
    CommonModule,
    GestorRoutingModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AdministrationModule,
    DragDropModule
  ]
})
export class GestorModule { }
