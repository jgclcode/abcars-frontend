import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Utils
import { MatTableDataSource as MatTableDataSource } from '@angular/material/table';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

// Components
import { EditSparePartComponent } from '../edit-spare-part/edit-spare-part.component';

// Services
import { SparePartsService } from '../../services/spare-parts.service';

// Interfaces
import { GetSpareParts, SparePart } from '../../interfaces/spare-parts.interface';

@Component({
  selector: 'app-spare-parts-edit',
  templateUrl: './spare-parts-edit.component.html'
})

export class SparePartsEditComponent implements OnInit {

  // References
  public displayedColumns: string[] = ['id', 'name', 'status', 'amount', 'hours', 'fill', 'actions'];
  public dataSource!: MatTableDataSource<SparePart>;

  constructor(
    private _router: ActivatedRoute,
    private _sparePart: SparePartsService,
    private _bottomSheet: MatBottomSheet
  ) {
    // Await id for sell your car
    setTimeout(() => {      
      if (this._router.snapshot.params.id) {
        this.getSparePartsBySell(this._router.snapshot.params.id);
      }
    }, 100);
  }

  ngOnInit(): void {
    this.scrollTop();
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  } 

  /**
   * Get spare parts
   * @param id Number
   */
  public getSparePartsBySell(id: number) {
    this._sparePart.getSparePartsBySell(id)
    .subscribe({
      next: ({ code, status, spare_parts }: GetSpareParts) => {
        if (code === 200 && status === 'success') {
          // Assign the data to the data source for the table to render
          this.dataSource = new MatTableDataSource(spare_parts);
        }
      }
    });
  }

  /**
   * Edit information of Spare Part
   * @param spare SparePart
   */
  public openEditSparePart(spare: SparePart) {
    this._bottomSheet.open(EditSparePartComponent, {
      data: {
        sell_your_car_id: this._router.snapshot.params.id,
        spare
      }
    });
  }

}