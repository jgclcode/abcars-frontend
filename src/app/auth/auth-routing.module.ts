import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { LoginComponent } from './pages/login/login.component';
import { PasswordResetComponent } from './pages/password-reset/password-reset.component';
import { RegisterComponent } from './pages/register/register.component';
import { RecoverAccountComponent } from './pages/recover-account/recover-account.component';

// Guards
import { CustomerGuard } from './pages/account/guards/customer.guard';

const routes: Routes = [  
  { path: 'iniciar-sesion', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'recuperar-cuenta', component: RecoverAccountComponent },
  { path: 'restablecer-password/:token', component: PasswordResetComponent },
  { path: 'mi-cuenta', loadChildren: () => import('./pages/account/account.module').then(m => m.AccountModule), canActivate: [CustomerGuard], canLoad: [CustomerGuard] },
  { path: '**', redirectTo: 'iniciar-sesion' }    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AuthRoutingModule { }
