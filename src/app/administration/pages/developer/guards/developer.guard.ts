import { CanActivate, CanLoad, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// Services
import { AccountService } from '../../../../auth/pages/account/services/account.service';

@Injectable({
  providedIn: 'root'
})
export class DeveloperGuard implements CanActivate, CanLoad {

  constructor(
    private _router: Router, 
    private _accountService: AccountService
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    var subject = new Subject<boolean>();
    this._accountService.checkUserWithRol('developer')
        .subscribe({
          next: (data) => {
            if ( data.rol != null ) {
              subject.next(true);
            } else {
              this._router.navigateByUrl('/auth/iniciar-sesion');
              subject.next(false);
            }
          }
        });
    return subject.asObservable();
  }
  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    var subject = new Subject<boolean>();
    this._accountService.checkUserWithRol('developer')
        .subscribe({
          next: (data) => {
            if ( data.rol != null ) {
              subject.next(true);
            } else {
              this._router.navigateByUrl('/auth/iniciar-sesion');
              subject.next(false);
            }
          }
        });
    return subject.asObservable();
  }
}
