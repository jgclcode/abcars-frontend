import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { DeveloperDashboardComponent } from './pages/developer-dashboard/developer-dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { RolesComponent } from './pages/roles/roles.component';
import { BrandsComponent } from './pages/brands/brands.component';
import { BrandsCreateComponent } from './pages/brands/brands-create.component';
import { ModelsComponent } from './pages/models/models.component';
import { ModelsCreateComponent } from './pages/models/models-create.component';
import { BranchesComponent } from './pages/branches/branches.component';
import { BranchesCreateComponent } from './pages/branches/branches-create.component';
import { UsersCreateComponent } from './pages/users/users-create.component';
import { ClientsCreateComponent } from './pages/clients/clients-create.component';
import { RolesCreateComponent } from './pages/roles/roles-create.component';
import { RewardsComponent } from './pages/rewards/rewards.component';

const routes: Routes = [
  { path: '', component: DeveloperDashboardComponent },
  { path: 'users', component: UsersComponent },
  { path: 'users/create', component: UsersCreateComponent },
  { path: 'users/update/:user_id', component: UsersCreateComponent },
  { path: 'clients', component: ClientsComponent },
  { path: 'clients/create', component: ClientsCreateComponent },
  { path: 'clients/update/:client_id', component: ClientsCreateComponent },
  { path: 'roles', component: RolesComponent },
  { path: 'roles/create', component: RolesCreateComponent },
  { path: 'roles/update/:role_id', component: RolesCreateComponent },
  { path: 'brands', component: BrandsComponent },
  { path: 'brands/create', component: BrandsCreateComponent },
  { path: 'brands/update/:brand_id', component: BrandsCreateComponent },
  { path: 'models', component: ModelsComponent },
  { path: 'models/create', component: ModelsCreateComponent },
  { path: 'models/update/:carmodel_id', component: ModelsCreateComponent },
  { path: 'branches', component: BranchesComponent },
  { path: 'branches/create', component: BranchesCreateComponent },
  { path: 'branches/update/:branch_id', component: BranchesCreateComponent },
  { path: 'rewards', component: RewardsComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DeveloperRoutingModule { }
