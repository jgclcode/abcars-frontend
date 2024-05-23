import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HypService } from '../../service/hyp.service';
import { HypData } from '../../interfaces/hyp.interface';

@Component({
  selector: 'app-hyp',
  templateUrl: './hyp.component.html',
  styleUrls: ['./hyp.component.css']
})
export class HypComponent implements OnInit{
  displayedColumns: string[] = [    
    "id_orden",
    "vehicle_type",
    "brand",
    "vin",
    "orden_date",
    "tower",
    "name",
    "plates",
    "person_1",
    "phone_1",
    "person_2",
    "delivery_promise_date",
    "delivery_promise_hour",
    "observations"
  ];
  dataSource:any;
  public ELEMENT_DATA!:HypData[];
  constructor(    
    private _hypService:HypService
  ){

  }  

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {    
    this.getHyp();
  }

  private getHyp():void{
    this._hypService.getHyp()
        .subscribe(
          (resp) => {
            this.ELEMENT_DATA = resp.data;
            this.dataSource = new MatTableDataSource<HypData>(this.ELEMENT_DATA);
            this.dataSource.paginator = this.paginator;
          }
        );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}


