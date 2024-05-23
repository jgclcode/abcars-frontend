import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

// Modules
import { AuthRoutingModule } from './auth-routing.module';
import { AccountRoutingModule } from './pages/account/account-routing.module';
import { AccountModule } from './pages/account/account.module';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RecoverAccountComponent } from './pages/recover-account/recover-account.component';
import { PasswordResetComponent } from './pages/password-reset/password-reset.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    RecoverAccountComponent,
    PasswordResetComponent    
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    AngularMaterialModule,
    AccountRoutingModule,
    AccountModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})

export class AuthModule { }
