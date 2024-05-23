import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

// Services
import { FinancingsService } from '../../services/financings.service';

// Animations
import Swal from 'sweetalert2';

// Interfaces
import { DataFinancing, Financings } from '../../interfaces/financings.interface';
import { SearchFinancing } from '../../interfaces/search_financing';

// Components
import { ClientDialogDataComponent } from 'src/app/administration/components/client-dialog-data/client-dialog-data.component';
import { FinancingDialogDataComponent } from '../../components/financing-dialog-data/financing-dialog-data.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-financings',
  templateUrl: './financings.component.html'
})

export class FinancingsComponent implements OnInit {

  // MatTableSource
  public displayedColumns: string[] = ['id', 'status', 'brand', 'carmodel', 'year', 'price', 'hitch', 'monthly_fees', 'financing_date', 'financing', 'user', 'action'];
  public dataSource!: MatTableDataSource<any>;

  public prueba: DataFinancing[] = [];

  // MatPaginator 
  public length: number = 0;
  public pageIndex: number = 1;

  public pageSize: number = 10;
  public flag_pag: boolean = true;
  public valor: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _financingsService: FinancingsService, private _bottomSheet: MatBottomSheet, public dialog: MatDialog) { 
    // Launch request
    this.getFinancings();
  }

  ngOnInit(): void {
    this.scrollTop();
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }

  /**
   * Get financings
   * @param page number
   */
  public getFinancings(page?: number) {
    this._financingsService.getFinancings(page)
    .subscribe({
      next: ({ code, status, financing }: Financings) => {
        if (code === 200 && status === 'success') {
          // Set Requets
          this.dataSource = new MatTableDataSource(financing.data);

          // Assign the length data
          this.paginator.length = financing.total;
        }
      }
    });
  }

  /**
   * Change Status Financing
   */
  public changeStatus(form: any, status: string) {
    Swal.fire({
      title: `¿Desea cambiar el estado a 
        ${ 
          (status === 'approved') ? 'Aprobado' :  
          (status === 'qualified') ? 'Calificado' :
          (status === 'denied') ? 'Denegado' : 'Activo'
        }
      ?`,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EEB838'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let updateForm = {
          ...form,
          status
        };

        this._financingsService.updateFinancing(form.id, updateForm)
        .subscribe({
          next: ( { code, status }: Financings ) => {
            if (code === 200 && status === 'success') {
              this.getFinancings();
              Swal.fire({
                title: 'Actualizado',
                confirmButtonColor: '#EEB838'
              });
            }
          },
          error: (err: Error) =>{
            Swal.fire('Los cambios no se guardaron', '', 'info');
          }
        });
      } else if (result.isDenied) {
        Swal.fire('Los cambios no se guardaron', '', 'info');
      }
    });
  }

  /**
   * Filter data
   * @param event Event
   */
  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild('txtBuscar') txtBuscar!:ElementRef<HTMLInputElement>;
  buscar(page?: number){
    if (this.txtBuscar.nativeElement.value) {
      this.valor = this.txtBuscar.nativeElement.value;

      this._financingsService.buscarSolicitudes(this.valor, this.pageSize, page).subscribe(
        ({ code, status, financings }: SearchFinancing) => {
          if (code === 200 && status === 'success') {
            this.dataSource = new MatTableDataSource(financings.data);
            // Assign the length data
            this.paginator.length = financings.total;
          }
        }
      );
      
      this.flag_pag = false;

    }else{
      this.valor = '';
      this.getFinancings();
      this.flag_pag = true;
    }
  }

  /**
   * Pagination Change
   * @param event PageEvent
   */
  public paginationChange(event: PageEvent) {
    if (this.flag_pag) {
      this.getFinancings(event.pageIndex + 1);
      this.scrollTop();   
    }else{
      this.buscar(event.pageIndex + 1);
      this.scrollTop();
    }
  }
  
  /**
   * Open Dialog Financing
   * @param client 
   */
   public openBottomSheetFinancing(financing: DataFinancing) {
    this._bottomSheet.open(FinancingDialogDataComponent, {
      data: {
        financing
      }
    });
  }

  /**
   * Open Dialog User
   * @param client 
   */
  public openDialogUser(client: string) {
    this.dialog.open(ClientDialogDataComponent, {
      data: {
        client
      }
    });
  }

}