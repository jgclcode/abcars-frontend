import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { environment } from 'src/environments/environment';
import { SparePartsService } from '../../../spare-parts/services/spare-parts.service';
import { Valuators, Valuator } from './../../../spare-parts/interfaces/valuators.interface';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { SpareValuator, Valuatores } from '../../../spare-parts/interfaces/spare-valuators.interface';

@Component({
  selector: 'app-spare-parts-manager-print-valuation',
  templateUrl: './spare-parts-manager-print-valuation.component.html',
  styleUrls: ['./spare-parts-manager-print-valuation.component.css']
})
export class SparePartsManagerPrintValuationComponent implements OnInit {
  @ViewChild('dateValuation') dateValuation: ElementRef<HTMLInputElement>;
  @ViewChild('dateEndValuation') dateEndValuation: ElementRef<HTMLInputElement>;

  public url: string = environment.baseUrl;
  public valuators: Valuators[] = [];
  public valuatores: Valuatores[] = [];
  public iduservaluator: number | null = 0;
  public inputDateValuation: string;
  public inputDateEndValuation: string;

  constructor(
    private _spartePartsService: SparePartsService
  ) { }

  ngOnInit(): void {
    this.getValuators();
  }

  private getValuators(){
    this._spartePartsService.getValuators()
      .subscribe(
        ({ code, valuators }: Valuator ) => {
          // console.log(valuators);
          this.valuators = code === '200' ? valuators : []
        }
      );
  }

  public onChange(valuatorId: number){
      this.iduservaluator = valuatorId;
  }

  public getDateValuation(event: MatDatepickerInputEvent<Date>){
    let date = new Date(`${event.value}`);
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    let year = date.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    let dateV = [year, month, day].join('-');
    // let inputDate = dateV.split("-").reverse().join("-");
    this.dateValuation.nativeElement.value = dateV;
    this.inputDateValuation = dateV;
  }

  public getDateEndValuation(event: MatDatepickerInputEvent<Date>){
    let date = new Date(`${event.value}`);
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    let year = date.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    let dateV = [year, month, day].join('-');
    // let inputDate = dateV.split("-").reverse().join("-");
    this.dateEndValuation.nativeElement.value = dateV;
    this.inputDateEndValuation = dateV;

    this._spartePartsService.getSparePartsByValuators(this.inputDateValuation, this.inputDateEndValuation)
      .subscribe(
        ({code, valuators}: SpareValuator ) => {
          this.valuatores = code === 200 ? valuators : [];
          this.valuators = this.valuatores;
        }
      );
  }

}
