import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// Components
import { AppComponent } from './app.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { HomeComponent } from './dashboard/pages/home/home.component';
import { FooterComponent } from './shared/footer/footer.component';
import { SavedProcessComponent } from './dashboard/components/saved-process/saved-process.component';
import { FindmeVehicleComponent } from './dashboard/pages/findme-vehicle/findme-vehicle.component';
import { ErrorProcessComponent } from './dashboard/components/error-process/error-process.component';
// import { ContactComponent } from './dashboard/pages/contact/contact.component';
import { SuccessfulPendingPaymentComponent } from './dashboard/components/successful-pending-payment/successful-pending-payment.component';

// Angular Material & Flex Layout
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { AuthModule } from './auth/auth.module';
import { ComprarAutosRoutingModule } from './dashboard/pages/comprar-autos/comprar-autos-routing.module';
import { ComprarAutosModule } from './dashboard/pages/comprar-autos/comprar-autos.module';
import { VenderAutosRoutingModule } from './dashboard/pages/vender-autos/vender-autos-routing.module';
import { VenderAutosModule } from './dashboard/pages/vender-autos/vender-autos.module';
import { CitasRoutingModule } from './dashboard/pages/citas/citas-routing.module';
import { CitasModule } from './dashboard/pages/citas/citas.module';
import { AdministrationRoutingModule } from './administration/administration-routing.module';
import { AdministrationModule } from './administration/administration.module';
import { AbcModule } from './dashboard/pages/abc/abc.module';
import { AbcRoutingModule } from './dashboard/pages/abc/abc-routing.module';
import { InventoryComponent } from './dashboard/pages/inventory/inventory.component';

import { MatSliderModule } from '@angular/material/slider';
// import { LoginComponent } from './administration/pages/form_check/login/login.component';
// import { SharedModule } from './administration/pages/form_check/shared/shared.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
// import { DetailsComponent } from './administration/pages/form_check/reportes/details/details.component';
import { InterceptorService } from './shared/interceptor.service';
// import { ReportdetailsComponent } from './administration/pages/form_check/report-photo/reportdetails/reportdetails.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

// Pipes
import { SafePayPipe } from './dashboard/components/successful-pending-payment/pipes/safePay.pipe';
//import { InterceptorService } from './shared/interceptor.service'; 
 

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    FooterComponent,
    HomeComponent,
    FindmeVehicleComponent,
    SavedProcessComponent,
    ErrorProcessComponent,
    // ContactComponent,
    InventoryComponent,
    // LoginComponent,
    // DetailsComponent,
    // ReportdetailsComponent,
    LandingPageComponent,
    SuccessfulPendingPaymentComponent,
    SafePayPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    AuthRoutingModule,
    AuthModule,
    ComprarAutosRoutingModule,  
    ComprarAutosModule ,
    VenderAutosRoutingModule,
    VenderAutosModule,
    CitasRoutingModule,
    CitasModule,
    BrowserAnimationsModule,
    AdministrationModule,
    AdministrationRoutingModule,
    AbcModule,
    AbcRoutingModule,
    MatSliderModule,
    // SharedModule,   
    HttpClientModule,
  ],
  providers: [Title,{ provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }], 
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class AppModule { }