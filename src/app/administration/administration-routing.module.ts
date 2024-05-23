import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { CheckRoleComponent } from './components/check-role/check-role.component';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { ChecklistGerericComponent } from './components/checklist-gereric/checklist-gereric.component';

// Guards
import { DeveloperGuard } from './pages/developer/guards/developer.guard';
import { MarketingGuard } from './pages/marketing/guards/marketing.guard';
import { AppraiserGuard } from './pages/appraiser/guards/appraiser.guard';
import { ValuatorGuard } from './pages/valuator/guards/valuator.guard';
import { AftersaleGuard } from './pages/aftersales/guards/aftersale.guard';
import { SalesGuard } from './pages/sales/guards/sales.guard';
import { GestorGuard } from './pages/gestor/guards/gestor.guard';
import { TecvalGuard } from './pages/appraiser-technician/guards/tecval.guard';
import { SparePartsGuard } from './pages/spare-parts/guards/spare-parts.guard';
import { SparePartsManagerGuard } from './pages/spare-parts-manager/guards/spare-parts-manager.guard';
import { ContactGuard } from './pages/contact/guards/contact.guard';
import { SellerGuard } from './pages/seller/guards/seller.guard';
import { PicturesGuard } from './pages/form_check/guards/pictures.guard';

const routes: Routes = [
  { path: '', component: CheckRoleComponent },
  { path: 'developer', loadChildren: () => import('./pages/developer/developer.module').then(m => m.DeveloperModule), canActivate: [DeveloperGuard], canLoad: [DeveloperGuard] },
  { path: 'marketing', loadChildren: () => import('./pages/marketing/marketing.module').then(m => m.MarketingModule), canActivate: [MarketingGuard], canLoad: [MarketingGuard] },
  { path: 'appraiser', loadChildren: () => import('./pages/appraiser/appraiser.module').then(m => m.AppraiserModule), canActivate: [AppraiserGuard], canLoad: [AppraiserGuard] },
  { path: 'valuator', loadChildren: () => import('./pages/valuator/valuator.module').then(m => m.ValuatorModule), canActivate: [ValuatorGuard], canLoad: [ValuatorGuard] },
  { path: 'sales', loadChildren: () => import('./pages/sales/sales.module').then(m => m.SalesModule), canActivate: [SalesGuard], canLoad: [SalesGuard] },
  { path: 'aftersales', loadChildren: () => import('./pages/aftersales/aftersales.module').then(m => m.AftersalesModule), canActivate: [AftersaleGuard], canLoad: [AftersaleGuard] },
  { path: 'gestor', loadChildren: () => import('./pages/gestor/gestor.module').then(m => m.GestorModule), canActivate: [GestorGuard], canLoad: [GestorGuard] },
  { path: 'tecval', loadChildren: () => import('./pages/appraiser-technician/appraiser-technician.module').then(m => m.AppraiserTechnicianModule), canActivate: [TecvalGuard], canLoad: [TecvalGuard] },
  { path: 'parts', loadChildren: () => import('./pages/spare-parts/spare-parts.module').then(m => m.SparePartsModule), canActivate: [SparePartsGuard], canLoad: [SparePartsGuard] },
  { path: 'pmanager', loadChildren: () => import('./pages/spare-parts-manager/spare-parts-manager.module').then(m => m.SparePartsManagerModule), canActivate: [SparePartsManagerGuard], canLoad: [SparePartsManagerGuard] },
  { path: 'contact', loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactModule), canActivate: [ContactGuard], canLoad: [ContactGuard] },
  { path: 'pictures', loadChildren: () => import('./pages/form_check/dashboard.module').then(m => m.DashboardModule), canActivate: [PicturesGuard], canLoad: [PicturesGuard] },
  { path: 'contadora', loadChildren: () => import('./pages/accountant/accountant.module').then(m => m.AccountantModule) },
  { path: 'seller', loadChildren: () => import('./pages/seller/seller.module').then(m => m.SellerModule), canActivate: [SellerGuard], canLoad: [SellerGuard] },
  
  // Other routes
  { path: 'not-authorized', component: NotAuthorizedComponent },
  { path: 'general/checklist/:sell_your_car_id', component: ChecklistGerericComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdministrationRoutingModule { }
