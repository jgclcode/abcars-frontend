import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Utils
import Swal from 'sweetalert2';
import { MatTableDataSource as MatTableDataSource } from '@angular/material/table';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

// Services
import { SparePartsService } from '../../../spare-parts/services/spare-parts.service';

// Interfaces
import { GetSpareParts, SparePart, PaintingWorks, PaintingWork, UpdatePaintingWork } from '../../../spare-parts/interfaces/spare-parts.interface';

// Components
import { SparePartsEditManagerComponent } from '../spare-parts-edit-manager/spare-parts-edit-manager.component';

@Component({
  selector: 'app-spare-parts-edit',
  templateUrl: './spare-parts-edit.component.html'
})

export class SparePartsEditComponent implements OnInit {

  // References
  public displayedColumnsPW: string[] = ['id', 'name', 'price', 'status', 'actions'];
  public dataSourcePW!: MatTableDataSource<PaintingWork>;

  public displayedColumns: string[] = ['id', 'name', 'amount', 'hours', 'type_part', 'status', 'actions'];
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
        this.getPaintingWorkBySell(this._router.snapshot.params.id);
      }
    }, 1000);
  }

  ngOnInit(): void {
    this.scrollTop();
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }

  /**
   * GET Full painting works
   * @param sell_your_car_id Number
   */
  private getPaintingWorkBySell(sell_your_car_id: number) {
    this._sparePart.getPaintingWorks(sell_your_car_id)
    .subscribe({
      next: ({ code, status, painting_works }: PaintingWorks) => {
        if (code === 200 && status === 'success') {
          // Assign the data to the data source for the table to render
          this.dataSourcePW = new MatTableDataSource(painting_works);
        }
      }
    });
  }

  /**
   * Get spare parts
   * @param id Number
   */
  private getSparePartsBySell(id: number) {
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
    this._bottomSheet.open(SparePartsEditManagerComponent, {
      data: {
        sell_your_car_id: this._router.snapshot.params.id,
        spare
      }
    });
  }

  /**
   * UPDATE Status of painting work
   * @param painting_work_id Number
   */
  public approvedHYP(painting_work_id: number, status: string) {
    this._sparePart.updatePaintingWork(painting_work_id, status)
    .subscribe({
      next: ({ code, status, message }: UpdatePaintingWork) => {
        if (code === '200' && status === 'success') {
          // Alert
          Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: message,
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });
        } else {
          // Alert
          Swal.fire({
            icon: 'error',
            title: 'Opps',
            text: 'No se pudo actualizar correctamente, intente nuevamente.',
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });
        }

        this.getPaintingWorkBySell(this._router.snapshot.params.id);
      }
    })
  }

}