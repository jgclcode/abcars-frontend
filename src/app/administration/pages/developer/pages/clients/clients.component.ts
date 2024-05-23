import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource as MatTableDataSource } from '@angular/material/table';
import { MatPaginator as MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

// Animations
import Swal from "sweetalert2";

// Services
import { ClientService } from './services/client.service';

// Interfaces
import { Client } from './interfaces/client-data.interface';
import { ClientDelete } from './interfaces/client-delete.interface';

export interface UserData {
  id: string;
  phoneOne: string;
  phoneTwo: string;
  points: string;
  user_id: string;
  source_id: string;
}

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html'
})

export class ClientsComponent implements AfterViewInit {

  // Refereces Datatable
  public displayedColumns: string[] = ['id', 'phoneOne', 'phoneTwo', 'points', 'user_id', 'source_id', 'actions'];
  public dataSource!: MatTableDataSource<Client>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  clients:Client[] = [];

  constructor(private _clientService:ClientService) {
    this.getClients();
    this.scrollTop();
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();
  }

  public getClients(){
    this._clientService.getClients( 9999 )
    .subscribe({
      next: ( clientData ) => {
        this.clients = clientData.clients.data;
        this.dataSource = new MatTableDataSource(this.clients);
      }
    });
  }

  public deleteClient( client_id: number ): void{
    //
    Swal.fire({
      title: '¿Estás seguro de que deseas eliminar este cliente?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar cliente',
      confirmButtonColor: '#EEB838',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this._clientService.deleteClient( client_id )
        .subscribe({
          next: ( clientDelete:ClientDelete ) => {
            if( clientDelete.status == "success" ){
              Swal.fire({
                icon: 'success',
                text: clientDelete.message,
                showConfirmButton: true,
                confirmButtonColor: '#EEB838',
                timer: 3500
              }).then( () => {
                this.clients = [];
                this.getClients();
              });
            }
          }
        })
      } else if (result.isDenied) {
        Swal.fire('Cliente no eliminado', '', 'info')
      }
    })
  }

  ngAfterViewInit(): void {
    setTimeout( () => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 1000 );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}

/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
  return {
    id: id.toString(),
    phoneOne: Math.round(Math.random() * 100).toString(),
    phoneTwo: Math.round(Math.random() * 100).toString(),
    points: Math.round(Math.random() * 100).toString(),
    user_id: Math.round(Math.random() * 100).toString(),
    source_id: Math.round(Math.random() * 100).toString()
  };
}

