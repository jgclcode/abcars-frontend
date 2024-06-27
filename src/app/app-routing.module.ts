import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { ContactComponent } from './dashboard/pages/contact/contact.component';
import { ErrorProcessComponent } from './dashboard/components/error-process/error-process.component';
import { FindmeVehicleComponent } from './dashboard/pages/findme-vehicle/findme-vehicle.component';
// import { HomeComponent } from './dashboard/pages/home/home.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { SavedProcessComponent } from './dashboard/components/saved-process/saved-process.component';
import { InventoryComponent } from './dashboard/pages/inventory/inventory.component';
import { AutosEnOfertaComponent } from './dashboard/pages/comprar-autos/pages/autos-en-oferta/autos-en-oferta.component';
import { CompraTuAutoComponent } from './dashboard/pages/comprar-autos/pages/compra-tu-auto/compra-tu-auto.component';
import { IndexComponent } from './administration/pages/form_check/index/index.component';
import { LoginComponent } from './administration/pages/form_check/login/login.component';
import { ReportesComponent } from './administration/pages/form_check/reportes/reportes.component';
import { DetailsComponent } from './administration/pages/form_check/reportes/details/details.component';
import { PhotoComponent } from './administration/pages/form_check/photo/photo.component';
import { ReportPhotoComponent } from './administration/pages/form_check/report-photo/report-photo.component';
import { ReportdetailsComponent } from './administration/pages/form_check/report-photo/reportdetails/reportdetails.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { RequestOfferComponent } from './dashboard/pages/request-quote/components/requestOffer/requestOffer.component';
import { RequestSetAsideComponent } from './dashboard/pages/request-quote/requestSetAside/requestSetAside.component';
import { SuccesfulPaymentComponent } from './dashboard/components/succesful-payment/succesfulPayment.component';
import { SuccessfulPendingPaymentComponent } from './dashboard/components/successful-pending-payment/successful-pending-payment.component';
import { QuoteRequestComponent } from './dashboard/pages/request-quote/components/quote-request/quote-request.component';
import { QuoteRequestChevroletComponent } from './dashboard/pages/request-quote/components/quote-request-chevrolet/quote-request-chevrolet.component';


const routes: Routes = [
  // { path: '', component: HomeComponent },  
  { path: '', component: CompraTuAutoComponent },  
  { path: 'landing-page', component: LandingPageComponent },    
  { path: '404', component: NotFoundComponent },  
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'admin', loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule) },
  { path: 'compra-tu-auto', loadChildren: () => import('./dashboard/pages/comprar-autos/comprar-autos.module').then(m => m.ComprarAutosModule) },
  { path: 'autos-en-oferta', component: AutosEnOfertaComponent },
  { path: 'vende-tu-auto', loadChildren: () => import('./dashboard/pages/vender-autos/vender-autos.module').then(m => m.VenderAutosModule) },
  { path: 'citas', loadChildren: () => import('./dashboard/pages/citas/citas.module').then(m => m.CitasModule) },
  { path: 'asistencia-vial', loadChildren: () => import('./dashboard/pages/asistencias/asistencias.module').then(m => m.AsistenciasModule) },
  { path: 'externals', loadChildren: () => import('./externals/externals.module').then(m => m.ExternalsModule) },
  { path: 'abc', loadChildren: () => import('./dashboard/pages/abc/abc.module').then(m => m.AbcModule) },
  { path: 'contacto', component: ContactComponent },
  { path: 'buscame-un-auto', component: FindmeVehicleComponent },
  { path: 'mantenimiento', loadChildren: () => import('./dashboard/pages/maintenance-auto/maintenance-auto.module').then(m => m.MaintenanceAutoModule) },
  { path: 'solicitud-cotizacion', loadChildren: () => import('./dashboard/pages/request-quote/request-quote.module').then(m => m.RequestQuoteModule) },
  { path: 'solicitud-offer/:vin', component: RequestOfferComponent },
  { path: 'solicitud-cotiza', component: QuoteRequestComponent },
  { path: 'form-prospection-chevrolet', component: QuoteRequestChevroletComponent },
  { path: 'solicitud-set-aside/:vin', component: RequestSetAsideComponent },
  { path: 'saved-process', component: SavedProcessComponent },
  { path: 'success-payment/:id/:title/:totalPay/:status/:status_detail', component: SuccesfulPaymentComponent },
  { path: 'success-pending-payment/:id/:title/:totalPay/:status/:status_detail/:redirect_url', component: SuccessfulPendingPaymentComponent },
  { path: 'error-process', component: ErrorProcessComponent },
  { path: 'dashboard', loadChildren: () => import('./administration/pages/form_check/dashboard.module').then(x => x.DashboardModule) },
  /* { path: 'fuuuorm', loadChildren: () => import('./form_check/dashboard/dashboard.module').then(m => m.DashboardModule) }, */
  { path: '**', redirectTo: '404' },

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }