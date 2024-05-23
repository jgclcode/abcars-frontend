import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutomotiveComponent } from 'src/app/dashboard/pages/maintenance-auto/components/automotive/automotive.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IndexComponent } from './index/index.component';
import { InicioComponent } from './inicio/inicio.component';
import { ReportesComponent } from './reportes/reportes.component';
import { PhotoComponent } from './photo/photo.component';
import { ReportPhotoComponent } from './report-photo/report-photo.component';
import { ReportdetailsComponent } from './report-photo/reportdetails/reportdetails.component';
import { LoginComponent } from './login/login.component';
import { DetailsComponent } from './reportes/details/details.component';

const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'formulario_inspeccion', component: IndexComponent },
    { path: 'design', component: PhotoComponent},
    { path: 'reportPhoto', component: ReportPhotoComponent },
    { path: ':id/reportDetails', component: ReportdetailsComponent },
    { path: 'search_vin', component: LoginComponent },
    { path: 'reportes', component: ReportesComponent },
    { path: ':id/details', component: DetailsComponent },
    { path: 'detalles', component: InicioComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
