import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {

  constructor(private spinner: LoaderService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinner.show();
    return next.handle(req).pipe(
      finalize(() => {
        this.spinner.hide();
      })
    );
  }
}
