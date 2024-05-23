import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

// Enviroment
import { environment } from 'src/environments/environment';

// Services
import { BrandService } from './services/brand.service';

// Animations
import Swal from "sweetalert2";

// Interfaces
import { BrandData, Brand } from './interfaces/brand-data.interface';
import { BrandDelete } from './interfaces/brand-delete.interface';
import { SearchBrand } from './interfaces/search_brand.interface';
@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styles: [`
    svg {
      width: 25% !important;
      border-radius: 0.25rem !important;
    }
  `]
})

export class BrandsComponent {

  // Refereces Datatable
  public displayedColumns: string[] = ['id', 'name', 'description', 'location', 'contact', 'picture', 'actions'];
  public dataSource!: MatTableDataSource<Brand>;

  // MatPaginator 
  public length: number = 0;
  public pageIndex: number = 1;

  public pageSize: number = 10;
  public flag_pag: boolean = true;
  public valor: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  brands!:Brand[];
  public urlImagen: string = environment.baseUrl;

  constructor(private _brandService:BrandService) {
    this.scrollTop();
    this.getBrands();
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();
  }

  /**
   * Get Brands
   */
  public getBrands(page?: number):void {
    this._brandService.getBrands(page)
    .subscribe({
      next: ({ code, status, brands }: BrandData) => {
        if (code === 200 && status === 'success') {
          // Set Requets
          this.dataSource = new MatTableDataSource(brands.data);
          // Assign the length data
          this.paginator.length = brands.total;
        }
      }
    });
  }

  public deleteBrand( brand_id:number ): void {
    Swal.fire({
      title: '¿Estás seguro de que deseas eliminar este marca?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar Marca',
      confirmButtonColor: '#EEB838',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this._brandService.deleteBrand( brand_id )
        .subscribe({
          next: ( brandDelete:BrandDelete ) => {
            if( brandDelete.status == "success" ){
              Swal.fire({
                icon: 'success',
                text: brandDelete.message,
                showConfirmButton: true,
                confirmButtonColor: '#EEB838',
                timer: 3500
              }).then( () => {
                this.brands = [];
                this.getBrands();
              });
            }
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              text: 'La marca no puede ser eliminada ya que existen registros que dependen de ella.',
              showConfirmButton: true,
              confirmButtonColor: '#EEB838',
              timer: 3500
            });
          }
        });
      } else if (result.isDenied) {
        Swal.fire('Marca no eliminada', '', 'info')
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
      
      this._brandService.searchBrands(this.valor, this.pageSize, page).subscribe(
        // (resp => {
        //   console.log(resp.brands.total);
          
        // })
        ({ code, status, brands }: SearchBrand) => {
          if (code === 200 && status === 'success') {
            this.dataSource = new MatTableDataSource(brands.data);
            // Assingn the length data
            this.paginator.length = brands.total;
          }
        }
      );

      this.flag_pag = false;

    }else{
      this.valor = '';
      this.getBrands();
      this.flag_pag = true;
    }
    
  }

  /**
   * Pagination Change
   * @param event PageEvent
   */
  public paginationChange(event: PageEvent) {
    if (this.flag_pag) {
      this.getBrands(event.pageIndex + 1);
      this.scrollTop();   
    }else{
      this.filter(event.pageIndex + 1);
      this.scrollTop();
    }
  }

}