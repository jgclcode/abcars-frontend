import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource as MatTableDataSource } from '@angular/material/table';
import { MatPaginator as MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

// Services
import { RoleService } from './services/role.service';

// Animations
import Swal from "sweetalert2";

// Interfaces
import { RoleData, Role, RoleDelete } from './interfaces/role-data.interface';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html'
})

export class RolesComponent implements AfterViewInit {

  // Refereces
  public displayedColumns: string[] = ['id', 'name', 'actions'];
  public dataSource!: MatTableDataSource<Role>;
  public roles!: Role[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _roleService:RoleService) { 
    this.getRoles();
    this.scrollTop();
  }

  public getRoles() {
    this._roleService.getRoles(9999)
    .subscribe({
      next: (role: RoleData) => {
        this.roles = role.roles.data;
        this.dataSource = new MatTableDataSource(this.roles);
      }
    });
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }

  ngAfterViewInit(): void {
    setTimeout( () =>{
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },1000);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Delete Role
   * @param role_id 
   */
  public deleteRole(role_id: number): void { 
    Swal.fire({
      title: '¿Estás seguro de que deseas eliminar este role?',      
      showCancelButton: true,
      confirmButtonText: 'Eliminar role',
      confirmButtonColor: '#EEB838',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this._roleService.deleteRole(role_id)
        .subscribe({
          next: ({ code, status, message }: RoleDelete) => {
            if (code === '200' && status === 'success') {
              this.launchAlert(message, 'success');
            } else {
              this.launchAlert(message, 'error');
            }
          }
        });
      } else if (result.isDenied) {
        Swal.fire('Role no eliminado', '', 'info');
      }
    });
  }

  /**
   * Function Show Alert
   * @param message String
   * @param type String
   */
  public launchAlert(message: string, type: any) {
    Swal.fire({
      icon: type,
      text: message,
      showConfirmButton: true,
      confirmButtonColor: '#EEB838',
      timer: 3500
    }).then(() => {
      this.getRoles();
    });
  }

}