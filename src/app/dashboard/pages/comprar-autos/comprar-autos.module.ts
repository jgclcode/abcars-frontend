import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


// Modules
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { ComprarAutosRoutingModule } from './comprar-autos-routing.module';

// Components
import { AcquisitionFormComponent } from './pages/acquisition-form/acquisition-form.component';
import { CompraTuAutoComponent } from './pages/compra-tu-auto/compra-tu-auto.component';
// import { AutosEnOfertaComponent } from "./pages/autos-en-oferta/autos-en-oferta.component";
import { DetailComponent } from './pages/detail/detail.component';
import { MethodsAcquiringComponent } from './components/methods-acquiring/methods-acquiring.component';
import { NotificationReservedComponent } from './components/notification-reserved/notification-reserved.component';
import { VehicleComponent } from './components/vehicle/vehicle.component';
import { AskInformationComponent } from './components/ask-information/ask-information.component';
import { VehiclePanoramaViewerComponent } from './components/vehicle-panorama-viewer/vehicle-panorama-viewer.component';
import { ModalComponent } from './components/modal/modal.component';
import { StickyWhatsappComponent } from 'src/app/shared/sticky-whatsapp/sticky-whatsapp.component';
import { StickyWhatsappDetailComponent } from 'src/app/shared/sticky-whatsapp-detail/sticky-whatsapp-detail/sticky-whatsapp-detail.component';

@NgModule({
  declarations: [    
    CompraTuAutoComponent, 
    VehicleComponent, 
    VehiclePanoramaViewerComponent,
    DetailComponent, 
    MethodsAcquiringComponent, 
    AcquisitionFormComponent, 
    NotificationReservedComponent, AskInformationComponent, ModalComponent,
    StickyWhatsappComponent,
    StickyWhatsappDetailComponent
  ],
  imports: [
    CommonModule,
    ComprarAutosRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    AngularMaterialModule
  ],
  exports: [
    VehicleComponent
  ]
})

export class ComprarAutosModule { }
