import { Component, OnInit } from '@angular/core';

import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { AutomotiveMaintenanceComponent } from '../automotive-maintenance/automotive-maintenance.component';

@Component({
  selector: 'app-automotive',
  templateUrl: './automotive.component.html',
  styleUrls: ['./automotive.component.css']
})
export class AutomotiveComponent implements OnInit {

  constructor(
    private _bottomSheet: MatBottomSheet
  ) { }

  ngOnInit(): void {
  }

  public automotiveForm(){
    this._bottomSheet.open(AutomotiveMaintenanceComponent);
  }

}
