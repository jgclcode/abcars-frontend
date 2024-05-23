import { Component, OnInit } from '@angular/core';
import { SparePartsService } from '../../pages/spare-parts/services/spare-parts.service';

@Component({
  selector: 'spare-parts-overview',
  templateUrl: './spare-parts-overview.component.html',
  styleUrls: ['./spare-parts-overview.component.css']
})
export class SparePartsOverviewComponent implements OnInit {

  // References
  public currentMonth: string | undefined;
  public countStandBy: number = 0;
  public countToValued: number = 0;
  public countValued: number = 0;

  constructor(
    private _sparePartsService: SparePartsService
  ) { }

  ngOnInit(): void {
    this.getStatusCount();
    const currentDate = new Date();
    this.currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  }

  public getStatusCount(){
    this._sparePartsService.getValuationsCount()
      .subscribe( resp => {
        // console.log(resp.count_total);
        this.countStandBy = resp.count_standBy;
        this.countToValued = resp.count_to_valued;
        this.countValued = resp.count_valued;
      })
  }

}
