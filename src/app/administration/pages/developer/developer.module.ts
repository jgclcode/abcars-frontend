import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { DeveloperRoutingModule } from './developer-routing.module';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdministrationModule } from '../../administration.module';
import { DataTablesModule } from 'angular-datatables';

// Components
import { DeveloperDashboardComponent } from './pages/developer-dashboard/developer-dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { UsersCreateComponent } from './pages/users/users-create.component';
import { RolesComponent } from './pages/roles/roles.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { BrandsComponent } from './pages/brands/brands.component';
import { ModelsComponent } from './pages/models/models.component';
import { BranchesComponent } from './pages/branches/branches.component';
import { BranchesCreateComponent } from './pages/branches/branches-create.component';
import { ClientsCreateComponent } from './pages/clients/clients-create.component';
import { RolesCreateComponent } from './pages/roles/roles-create.component';
import { BrandsCreateComponent } from './pages/brands/brands-create.component';
import { ModelsCreateComponent } from './pages/models/models-create.component';
import { RewardsComponent } from './pages/rewards/rewards.component';

@NgModule({
  declarations: [    
    DeveloperDashboardComponent,
    UsersComponent,
    UsersCreateComponent,
    RolesComponent,
    ClientsComponent,
    BrandsComponent,
    ModelsComponent,
    BranchesComponent,
    ClientsCreateComponent,
    RolesCreateComponent,
    BrandsCreateComponent,
    ModelsCreateComponent,
    BranchesCreateComponent,
    RewardsComponent,
  ],
  imports: [
    CommonModule,
    DeveloperRoutingModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AdministrationModule,
    DataTablesModule
  ]
})

export class DeveloperModule { }
