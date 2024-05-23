import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource as MatTableDataSource } from '@angular/material/table';
import { MatPaginator as MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

// Services
import { UserService } from './services/user.service';

// Animations
import Swal from "sweetalert2";

// Interfaces
import { User } from './interfaces/user-data.interface';
import { UserDelete } from './interfaces/user-delete.interface';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})

export class UsersComponent implements AfterViewInit {

  // Refereces Datatable
  public users: User[] = [];
  public dataSource!: MatTableDataSource<User>;
  public displayedColumns: string[] = ['id', 'name', 'surname', 'email', 'gender', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _userService:UserService) {
    // Get users
    this.getUsers();
    this.scrollTop();
  }

  ngAfterViewInit() {
    setTimeout(() => { 
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 1000);        
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }

  public getUsers() {
    this._userService.getUsers(9999)
    .subscribe({
      next: (userData) => {
        this.users = userData.users.data;
        this.dataSource = new MatTableDataSource(this.users);
      }
    });
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public deleteUser(user_id: number) {
    Swal.fire({
      title: '¿Estás seguro de que deseas eliminar este usuario?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar usuario',
      confirmButtonColor: '#EEB838',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this._userService.deleteUser(user_id)
        .subscribe({
          next: (userDelete: UserDelete) => {
            if (userDelete.status == "success") {
              Swal.fire({
                icon: 'success',
                text: userDelete.message,
                showConfirmButton: true,
                confirmButtonColor: '#EEB838',
                timer: 3500
              }).then( () => {
                this.users = [];
                this.getUsers();
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
          }
        });
      } else if (result.isDenied) {
        Swal.fire('Usuario no eliminado', '', 'info')
      }
    });
  }

}