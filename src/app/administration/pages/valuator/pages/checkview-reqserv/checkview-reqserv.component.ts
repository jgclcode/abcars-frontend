import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

// Services
import { AppraiserChecklistService } from '../../../appraiser/services/appraiser-checklist.service';

// Interfaces
// import { ChecklistValuation, DataChecklist } from '../../../appraiser/interfaces/checklist-valuation.interface';
import { CERT, GetChecklistForms, MecElec, RevEXT, RevInt, Checklist, User } from '../../interfaces/get-checklist-forms.interface';

@Component({
  selector: 'app-checkview-reqserv',
  templateUrl: './checkview-reqserv.component.html',
  styles: [`
    /* .a1 {
        color: violet;
    } */

    .a2 {
        color: red;
    }

    .a1 {
        color: green;
    }

    .a3 {
        color: gray;
    }
  `
  ]
})
export class CheckviewReqservComponent implements OnInit {

  public id: string = '';
  public vin: string = '';
  public checklist!: Checklist;
  public revExt!: RevEXT;
  public revInt!: RevInt;
  public mecElectric!: MecElec;
  public certification!: CERT;
  public tecValuator!: User;
  public valuator!:    User;


  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<CheckviewReqservComponent>,
    private _appraiserChecklistService: AppraiserChecklistService
  ) { }

  ngOnInit(): void {
    this.id = this.data.id;
    this.vin = this.data.vin;
    /* console.log(this.id);
    console.log(this.vin); */
    // this.getChecklistValuation(this.vin);
    this.getChecklistValuation(this.id);
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  /* public getChecklistValuation(vin: string){
    this._appraiserChecklistService.getChecklistValuation(vin).subscribe(
      ({ code, status, DataChecklist }: ChecklistValuation) => {
        this.checklist = DataChecklist;
      }
    );
  } */

  public getChecklistValuation(id: string){
    // console.log(id);
    
    this._appraiserChecklistService.getChecklistForms(id)
    .subscribe({
      next: ((resp: GetChecklistForms) => {
        // console.log(resp);
        this.revExt = resp.revExt;
        this.revInt = resp.revInt;
        this.mecElectric = resp.mecElec;
        this.certification = resp.cert;
        this.checklist = resp.checklist;
        this.tecValuator = resp.tecval;
        this.valuator = resp.valuator;

        // console.log(this.checklist.user_technician.user.name);
      })
    });
  }

}
