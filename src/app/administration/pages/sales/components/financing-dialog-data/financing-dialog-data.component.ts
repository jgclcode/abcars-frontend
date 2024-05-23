import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Observable, Subject } from 'rxjs';
import { environment } from "src/environments/environment";

// Change location app
import localeESMX from "@angular/common/locales/es-MX";
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeESMX);

// Interfaces
import { DataFinancing, FilesPreview } from '../../interfaces/financings.interface';
import { FinancingsService } from '../../services/financings.service';

@Component({
  selector: 'app-financing-dialog-data',
  templateUrl: './financing-dialog-data.component.html',
  providers: [
    { provide: LOCALE_ID, useValue: 'es-MX' }
  ]
})

export class FinancingDialogDataComponent implements OnInit {

  // References
  public financing!: DataFinancing;
  public step!: number;
  public fileFront: string = '';
  public fileBack: string = '';
  public url: string = environment.baseUrl;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any, 
    private _bottomSheetRef: MatBottomSheetRef<FinancingDialogDataComponent>,
    private _financingService: FinancingsService
  ) { }

  ngOnInit(): void {    
    this.financing = this.data.financing;

    // Get file front financing
    this.getFilesFinancing(this.data.financing.id, { type: 'front' }).subscribe({next: (response) => this.fileFront = response}); 

    // Get file back financing
    this.getFilesFinancing(this.data.financing.id, { type: 'back' }).subscribe({next: (response) => this.fileBack = response});
  }

  public closeSheet(): void {
    this._bottomSheetRef.dismiss();    
  }

  /**
   * Set index Step
   * @param index Number
   */
  public setStep(index: number) {
    this.step = index;
  }

  /**
   * Next Step
   */
  public nextStep() {
    this.step++;
  }

  /**
   * Prevent Step
   */
  public prevStep() {
    this.step--;
  }

  /**
   * Get files Financing
   */
  public getFilesFinancing(financing_id: number, type: Object): Observable<string> {
    const subject = new Subject<string>();

    this._financingService.getFilesFinancing(financing_id, type)
    .subscribe({
      next: ({ code, status, encode_picture }: FilesPreview) => {
        if (code === 200 && status === 'success') {
          subject.next(`data:image/png;base64, ${ encode_picture }`);
        } else {
          subject.next('assets/images/abcars-images/ine-front.png');
        }
      },
      error: (error) => {
        subject.next('assets/images/abcars-images/ine-front.png');
      }
    });

    return subject.asObservable();
  }

}