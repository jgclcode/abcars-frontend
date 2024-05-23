import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

// Services
import { AccountService } from 'src/app/auth/pages/account/services/account.service';

@Injectable({
  providedIn: 'root'
})

export class AftersaleGuard implements CanActivate, CanLoad {

  constructor(
    private _router: Router,
    private _accountService: AccountService
  ) { }

  canActivate(): Observable<boolean> | boolean {
    var subject = new Subject<boolean>();

    this._accountService.checkUserWithRol('aftersales')
    .subscribe({
      next: (data) => {
        if (data.rol != null) {
          subject.next(true);
        } else {
          this._router.navigateByUrl('/auth/iniciar-sesion');
          subject.next(false);
        }
      }
    });

    return subject.asObservable();
  }

  canLoad(): Observable<boolean> | boolean {
    var subject = new Subject<boolean>();

    this._accountService.checkUserWithRol('aftersales')
    .subscribe({
      next: (data) => {
        if (data.rol != null) {
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
