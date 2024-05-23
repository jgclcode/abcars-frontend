import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource as MatTableDataSource } from '@angular/material/table';
import { PageEvent as PageEvent, MatPaginator as MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from "sweetalert2";

// Services
import { IncidentService } from '../../services/incident.service';

// Interfaces
import { Incident, GetIncidents } from '../../interfaces/get-incidents.interface';
import { IncidentUpdate } from '../../interfaces/incident-update.interface';

@Component({
  selector: 'app-incidents',
  templateUrl: './incidents.component.html'
})

export class IncidentsComponent implements OnInit {
  // References
  public displayedColumns: string[] = ['id', 'name', 'description', 'user_name', 'user_surname', 'user_email', 'status', 'service', 'date', 'actions'];
  public dataSource!: MatTableDataSource<Incident>;

  // MatPaginator
  public length: number = 0;
  public pageIndex: number = 1;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public incidents:Incident[] = [];

  public lista_status:string[]=['success','close','progress'];
  public word = '';

  constructor(
    private _incidentService:IncidentService
  ) { }

  ngOnInit(): void {
    this.scrollTop();
    this.getIncidents();
  }

  public getIncidents( page?: number ):void{
    this._incidentService.getIncidents( page, this.word )
        .subscribe(
          ( response: GetIncidents ) => {
            this.incidents = response.incidents.data;
            this.dataSource = new MatTableDataSource(this.incidents);

            // Assign the length data
            this.paginator.length = response.incidents.total;
          }
        )
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();
  }

  public paginationChange(event: PageEvent) {
    this.pageIndex = event.pageIndex + 1;
    this.getIncidents(event.pageIndex + 1);
    this.scrollTop();
  }

  public newStatus( status:string, id:number ): void{
    Swal.fire({
      title: '¿Estás seguro de que deseas cambiar el estatus de esta incidencia?',
      confirmButtonText: 'Actualizar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EEB838'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this._incidentService.incidentUpdate( status, id )
            .subscribe(
              ( incidentUpdate: IncidentUpdate ) => {
                Swal.fire({
                  icon: 'success',
                  text: incidentUpdate.message,
                  showConfirmButton: true,
                  confirmButtonColor: '#EEB838',
                  timer: 3500
                }).then( () => {
                  this.incidents = [];
                  this.getIncidents( this.pageIndex );
                });
              }
            );
      } else if (result.isDenied) {
        Swal.fire('El estatus de la incidencia no fue actualizada', '', 'info')
          .then( () => {
            this.incidents = [];
            this.getIncidents( this.pageIndex );
        });
      }
    });
  }

  // Apply Filter
  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.word = filterValue;
    this.getIncidents();
    this.scrollTop();
  }

}