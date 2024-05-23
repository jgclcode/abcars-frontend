import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource as MatTableDataSource } from '@angular/material/table';
import { PageEvent as PageEvent, MatPaginator as MatPaginator } from '@angular/material/paginator';

// Animation
import Swal from 'sweetalert2';

// Services
import { BranchService } from './services/branch.service';

// Interfaces
import { Branch, BranchData } from './interfaces/branch-data.interface';
import { DeleteBranch } from './interfaces/branch-by-id.interface';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html'
})

export class BranchesComponent implements OnInit {

  // References
  public displayedColumns: string[] = ['id', 'name', 'state', 'actions'];
  public dataSource!: MatTableDataSource<Branch>;
  public branches!: Branch[];
  public word: string = '';

  // MatPaginator 
  public length: number = 0;
  public pageIndex: number = 1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _branchService: BranchService) { 
    // Get branches
    this.getBranches();
  }

  ngOnInit(): void {
    this.scrollTop();
  }

  public getBranches():void {
    this._branchService.getBranches(this.word)
    .subscribe({
      next: ({code, status, branches}: BranchData) => {
        if (code === 200 && status === 'success') {
          this.branches = branches.data;

          // Set Requets
          this.dataSource = new MatTableDataSource(this.branches);
          // Assign the length data
          this.paginator.length = branches.total;
        }
      }
    });
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();
  }

  /**
   * Delete Branch
   * @param branch_id Number
   */
  public deleteBranch(branch_id: number): void {
    Swal.fire({
      title: '¿Estás seguro de que deseas eliminar esta sucursal?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar sucursal',
      confirmButtonColor: '#EEB838',
    }).then((result) => {
      // Read more about isConfirmed, isDenied below
      if (result.isConfirmed) {
        this._branchService.deleteBranch(branch_id)
        .subscribe({
          next: ({ code, status }: DeleteBranch) => {
            if ( code === '200' && status === 'success') {
              Swal.fire({
                icon: 'success',
                text: 'Sucursal eliminada correctamente',
                showConfirmButton: true,
                confirmButtonColor: '#EEB838',
                timer: 3500
              }).then( () => {
                this.getBranches();
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Ooopppps!',
                text: 'No se puede eliminar esta sucursal ya que existen registros que dependen de ella',
                showConfirmButton: true,
                confirmButtonColor: '#EEB838',
                timer: 3500
              });
            }
          }
        });
      } else if (result.isDenied) {
        Swal.fire('Sucursal no eliminada', '', 'info')
      }
    });
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.word = filterValue;
    this.getBranches();
    this.scrollTop();
  }

  public paginationChange(event: PageEvent) {
    this.scrollTop();
  }

}
