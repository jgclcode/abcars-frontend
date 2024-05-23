import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

// Animation
import Swal from 'sweetalert2';

// Services
import { ModelsService } from '../../services/models.service';

// Interfaces
import { Carmodel, CarmodelDelete, ModelsInterface } from '../../interfaces/models.interface';
import { SearchModel } from '../../interfaces/search_model.interface';

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html'
})

export class ModelsComponent implements OnInit {

  // Refereces Datatable
  public displayedColumns: string[] = ['id', 'name', 'description', 'brand_id', 'actions'];
  public dataSource!: MatTableDataSource<any>;

  // MatPaginator 
  public length: number = 0;
  public pageIndex: number = 1;

  public valor: string = '';
  public pageSize: number = 10;
  public flag_pag: boolean = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public carmodels: Carmodel[] = [];

  constructor(private _modelsService: ModelsService) { 
    // Get Carmodels
    this.getCarmodels();
  }

  ngOnInit(): void {
    this.scrollTop();
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();
  }

  /**
   * Get Carmodels
   */
  public getCarmodels(page?: number) {
    this._modelsService.getCarmodels(page)
    .subscribe({
      next: ({ status, code, carmodel }: ModelsInterface) => {
        if (code === 200 && status === 'success') {
          // Set Requets
          this.dataSource = new MatTableDataSource(carmodel.data);
          // Assign the length data
          this.paginator.length = carmodel.total;
        }
      }
    });
  }

  /**
   * Delete Carmodel
   * @param carmodel_id number
   */
  public deleteCarmodel(carmodel_id: number) {
    Swal.fire({
      title: '¿Estás seguro de que deseas eliminar este modelo?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar modelo',
      confirmButtonColor: '#EEB838',
    }).then((result) => {
      // Read more about isConfirmed, isDenied below
      if (result.isConfirmed) {
        this._modelsService.deleteModel(carmodel_id)
        .subscribe({
          next: (userDelete: CarmodelDelete) => {
            if (userDelete.status == "success") {
              Swal.fire({
                icon: 'success',
                text: userDelete.message,
                showConfirmButton: true,
                confirmButtonColor: '#EEB838',
                timer: 3500
              }).then( () => {
                this.getCarmodels();
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Ooopppps!',
                text: userDelete.message,
                showConfirmButton: true,
                confirmButtonColor: '#EEB838',
                timer: 3500
              });
            }
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Ooopppps!',
              text: 'No se puede eliminar el modelo ya que existen registros que dependen de el',
              showConfirmButton: true,
              confirmButtonColor: '#EEB838',
              timer: 3500
            });
          }
        });
      } else if (result.isDenied) {
        Swal.fire('Modelo no eliminado', '', 'info')
      }
    });
  }

  /**
   * Search in datatable
   * @param event Event
   */
  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  @ViewChild('txtFilter') txtFilter!:ElementRef<HTMLInputElement>;
  filter(page?: number){
    if (this.txtFilter.nativeElement.value) {
      this.valor = this.txtFilter.nativeElement.value;

      this._modelsService.searchModels(this.valor, this.pageSize, page).subscribe(
        // (resp => {
        //   console.log(resp.models.data);
          
        // })
        ({ code, status, models }: SearchModel) => {
          if (code === 200 && status === 'success') {
            this.dataSource = new MatTableDataSource(models.data);
            // Assingn the length data
            this.paginator.length = models.total;
          }
        }
      );

      this.flag_pag = false;
    }else{
      this.valor = '';
      this.getCarmodels();
      this.flag_pag = true;
    }
    
  }
  /**
   * Pagination Change
   * @param event PageEvent
   */
  public paginationChange(event: PageEvent) {
    if (this.flag_pag) {
      this.getCarmodels(event.pageIndex + 1);
      this.scrollTop();   
    }else{
      this.filter(event.pageIndex + 1);
      this.scrollTop();
    }
  }

}
