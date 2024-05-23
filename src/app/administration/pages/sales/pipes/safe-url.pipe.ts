import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeURL'
})

export class SafeURLPipe implements PipeTransform {

  constructor(private _domSanitizer: DomSanitizer) { }

  transform(url: string): unknown {
    return this._domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
