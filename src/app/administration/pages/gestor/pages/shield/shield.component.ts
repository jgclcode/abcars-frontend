import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource as MatTableDataSource } from '@angular/material/table';
import { MatPaginator as MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

// Animations
import Swal from "sweetalert2";
// Services
import { ShieldService } from './services/shield.service';
// Interfaces
import { Shield, ShieldData } from './interfaces/shield-data.interface';
import { environment } from 'src/environments/environment';
import { DeleteShield } from './interfaces/delete-shield.interface';

@Component({
  selector: 'app-shield',
  templateUrl: './shield.component.html',
  styles: [
  ]
})
export class ShieldComponent implements AfterViewInit {

  public displayedColumns: string[] = ['id', 'name', 'imagen', 'actions'];
  public dataSource!: MatTableDataSource<Shield>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  garantias: Shield[] = [];

  baseUrl:string = environment.baseUrl;

  constructor(
    private _shieldService:ShieldService
  ) { 
    // Get users
    this.getShields();

    this.scrollTop();
  }

  ngAfterViewInit() {
    setTimeout( () => { 
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 1000 );
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();
  }

  getShields(){
    this._shieldService.getShields( 9999 )
        .subscribe(
          ( shieldData: ShieldData ) => {
            this.garantias = shieldData.shields.data;
            this.dataSource = new MatTableDataSource(this.garantias);
          }
        );
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public delete( id:number ){
    Swal.fire({
      title: '¿Estas seguro de querer eliminar esta garantía?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.deleteShield( id );
      }
    })
  }

  public deleteShield( id:number ){
    this._shieldService.deleteShield( id )
    .subscribe({
      next: ( deleteShield:DeleteShield ) => {
        if( deleteShield.status == 'success' ){
          Swal.fire(deleteShield.message, '', 'success');
          this.garantias = [];
          this.getShields();
        }else{
          Swal.fire( deleteShield.message , '', 'error');
        }
      }
    });
  }

}
