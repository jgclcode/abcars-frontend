import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
    name: 'safePay'
})
export class SafePayPipe implements PipeTransform {
    constructor(private _sanitizer: DomSanitizer){}
    transform(url: any): any {
        return this._sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}