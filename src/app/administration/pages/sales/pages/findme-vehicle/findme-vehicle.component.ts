import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator as MatPaginator, PageEvent as PageEvent } from "@angular/material/paginator";
import { MatTableDataSource as MatTableDataSource } from "@angular/material/table";
import { MatDialog as MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

// Services
import { FindmeVehicleService } from '../../services/findme-vehicle.service';

// Animations
import Swal from 'sweetalert2';

// Interfaces
import { FindmeVehicle, UpdateFindmeVehicle } from '../../interfaces/findme-vehicle.interface';

// Components
import { ClientDialogDataComponent } from 'src/app/administration/components/client-dialog-data/client-dialog-data.component';

@Component({
  selector: 'app-findme-vehicle',
  templateUrl: './findme-vehicle.component.html'
})

export class FindmeVehicleComponent implements OnInit {

  // MatTableSource
  public displayedColumns: string[] = ['id', 'status', 'brand', 'carmodel', 'year', 'version', 'mileage', 'amount_pay', 'type_purchase', 'release', 'user', 'action'];
  public dataSource!: MatTableDataSource<any>;

  // MatPaginator 
  public length: number = 0;
  public pageIndex: number = 1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _findmeVehicleService: FindmeVehicleService, private _dialog: MatDialog) { 
    // Launch request
    this.getFindmeVehicles();
  }

  ngOnInit(): void {
    this.scrollTop();
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  } 

  /**
   * Get requets of Findme a Vehicle
   * @param page number
   */
  public getFindmeVehicles(page?: number) {
    this._findmeVehicleService.getFindmeVehicles(page)
    .subscribe({
      next: ({ code, status, request }: FindmeVehicle) => {
        if (code === 200 && status === 'success') {
          // Set Requets
          this.dataSource = new MatTableDataSource(request.data);

          // Assign the length data
          this.paginator.length = request.total;
        }
      }
    });
  }

  /**
   * changeStatus
   */
  public changeStatus(form: any, status: string) {
    Swal.fire({
      title: `¿Seguro que desea cambiar el estado a ${ status === 'active' ? 'Buscando' : 'Atendido' }?`,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      confirmButtonColor: '#EEB838',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        let updateForm = {
          ...form,
          status
        };

        this._findmeVehicleService.updateFindmeVehicle(form.id, updateForm)
        .subscribe({
          next: ({ code, status }: UpdateFindmeVehicle) => {
            if (code === '200' && status === 'success') {
              
              this.getFindmeVehicles();
              Swal.fire('Actualizado', '', 'success');
            }
          },
          error: (error) => {
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

  /**
   * Pagination Change
   * @param event PageEvent
   */
  public paginationChange(event: PageEvent) {
    this.getFindmeVehicles(event.pageIndex + 1);
    this.scrollTop();   
  }

  /**
   * Open Dialog User
   * @param client 
   */
  public openDialogUser(client: string) {
    this._dialog.open(ClientDialogDataComponent, {
      data: {
        client
      }
    });
  }

}