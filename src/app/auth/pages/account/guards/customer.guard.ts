import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';

// Services
import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root'
})

export class CustomerGuard implements CanActivate, CanLoad {

  constructor(
    private _router: Router, 
    private _accountService: AccountService
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this._accountService.checkUser()) {
      return true;
    } else {
      this._router.navigateByUrl('/auth/iniciar-sesion');
      return false;
    }
  }

  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    if (this._accountService.checkUser()) {
      return true;
    } else {
      this._router.navigateByUrl('/auth/iniciar-sesion');
      return false;
    }
  }
}
