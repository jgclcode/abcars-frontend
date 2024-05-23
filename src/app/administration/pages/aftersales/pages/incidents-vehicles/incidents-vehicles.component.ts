import { MatPaginator as MatPaginator, PageEvent as PageEvent } from '@angular/material/paginator';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource as MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

// Animations
import Swal from 'sweetalert2';

// Interfaces
import { IncidentsVehicle, IncidentVehicleData } from '../../interfaces/incidents-vehicle.interface';
import { IncidentService } from '../../services/incident.service';
import { IncidentUpdate } from '../../interfaces/incident-update.interface';

@Component({
  selector: 'app-incidents-vehicles',
  templateUrl: './incidents-vehicles.component.html'
})

export class IncidentsVehiclesComponent implements OnInit {

  // References
  public displayedColumns: string[] = ['id', 'name', 'surname', 'email', 'status', 'title', 'description', 'vehicle_id', 'actions'];
  public dataSource!: MatTableDataSource<any>;

  // MatPaginator
  public length: number = 0;
  public pageIndex: number = 1;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _incidentsService: IncidentService, private _formBuilder: UntypedFormBuilder) {
    // Get Incidents
    this.getIncidents();
  }

  ngOnInit(): void {
    this.scrollTop();
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();
  }

  /**
   * Get Incidents
   * @param page number
   */
  private getIncidents(page?: number) {
    this._incidentsService.getIncidentsVehicle(page).subscribe(
      ({ code, status, Vehicle_incident: incidents }: IncidentsVehicle) => {
        if (code === 200 && status === 'success') {
          // Set Requets
          this.dataSource = new MatTableDataSource(incidents.data);

          // Assign the length data
          this.paginator.length = incidents.total;
        }
      }
    );
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
    this.getIncidents(event.pageIndex + 1);
    this.scrollTop();
  }

  public newStatus(status: string, incident: IncidentVehicleData): void {
    const { id } = incident;
    const form: UntypedFormGroup = this._formBuilder.group({
      ...incident,
      status
    });

    Swal.fire({
      title: '¿Estás seguro de que deseas cambiar el estatus de esta incidencia?',
      confirmButtonText: 'Actualizar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EEB838'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this._incidentsService.incidentUpdateVehicle(id, form.value)
        .subscribe({
          next: (incidentUpdate: IncidentUpdate) => {
            Swal.fire({
              icon: 'success',
              text: 'El estatus de la incidencia fue actualizada correctamente',
              showConfirmButton: true,
              confirmButtonColor: '#EEB838',
              timer: 3500
            }).then( () => {
              this.getIncidents(this.pageIndex);
            });
          }
        });
      } else if (result.isDenied) {
        Swal.fire('El estatus de la incidencia no fue actualizada', '', 'info')
        .then(() => {
          this.getIncidents(this.pageIndex);
        });
      }
    });
  }
}