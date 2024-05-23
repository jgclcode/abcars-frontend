import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Animation
import Swal, { SweetAlertIcon } from 'sweetalert2';

// Services
import { ModelsService } from '../../services/models.service';

// Interfaces
import { CarmodelCreate, CarmodelUpdate, GetCarmodel } from '../../interfaces/models.interface';
import { Brand, GetAllBrands } from '../brands/interfaces/brand-by-id.interface';

@Component({
  selector: 'app-models-create',
  templateUrl: './models-create.component.html'
})

export class ModelsCreateComponent implements OnInit {

  // References
  private _carmodel_id: number = 0;
  public activeCarmodel: boolean = false;
  public spinner: boolean = false;  
  public brands: Brand[] =[]; 
  public form!: UntypedFormGroup;
  
  constructor(
    private _router: Router,
    private _formBuilder: UntypedFormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _modelsService: ModelsService
  ) {
    // Create form
    this.createForm();
  }

  ngOnInit(): void {
    this.scrollTop();

    // Get brands
    this.getAllBrands();

    this._activatedRoute.params
    .subscribe({
      next: (params) => {
        if (params['carmodel_id'] != undefined) {
          this.activeCarmodel = true;
          this._carmodel_id = params['carmodel_id']
          this.getCarmodel(params['carmodel_id']);
        }
      }
    });
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();
  }

  /**
   * Getters Inputs Check
   */
  get nameInvalid() {
    return this.form.get('name')!.invalid && (this.form.get('name')!.dirty || this.form.get('name')!.touched);
  }

  get descriptionInvalid() {
    return this.form.get('description')!.invalid && (this.form.get('description')!.dirty || this.form.get('description')!.touched);
  }

  get brandInvalid() {
    return this.form.get('brand_id')!.invalid && (this.form.get('brand_id')!.dirty || this.form.get('brand_id')!.touched);
  }

  /**
   * Form Initialization
   */
  public createForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9- ]+")]],
      description: ['', [Validators.required]],
      brand_id: ['', [Validators.required]],
    });
  }

  /**
   * Get all Brands
   */
  private getAllBrands() {
    this._modelsService.getAllBrands()
    .subscribe({
      next: ({ brands }: GetAllBrands) => this.brands = brands
    });
  }

  /**
   * Create Method
   */
  public createCarmodel() {
    this._modelsService.createCarmodel(this.form.value)
    .subscribe({
      next: ({ code, status, message }: CarmodelCreate) => {
        if (code === '200' && status === 'success') {
          this.printAlert(message, 'success');
          this._router.navigateByUrl('/admin/developer/models');
        } else {
          this.printAlert('No se pudo crear el carmodel, verifique y vuelva a intentarlo', 'error');
        }
      }, 
      error: (error) => this.printAlert(error?.message, 'error')
    });
  }

  /**
   * Update Method
   */
  public updateCarmodel() {
    this._modelsService.updateCarmodel(this._carmodel_id, this.form.value)
    .subscribe({
      next: ({ code, status, message }: CarmodelUpdate) => {
        if (code === '200' && status === 'success') {
          this.printAlert(message, 'success');
          this._router.navigateByUrl('/admin/developer/models');
        } else {
          this.printAlert('No se pudo actualizar el carmodel, verifique y vuelva a intentarlo', 'error');
        }
      },
      error: (error) => this.printAlert(error?.message, 'error')
    });
  }

  /**
   * Get carmodel
   */
  public getCarmodel(carmodel_id: number) {
    this._modelsService.getCarmodel(carmodel_id)
    .subscribe({
      next: ({ code, status, carmodel }: GetCarmodel) => {
        if (code === 200 && status === 'success') {
          this.form.patchValue({
            name: carmodel.name,
            description: carmodel.description,
            brand_id: carmodel.brand_id,
          })
        }
      }
    });
  }

  /**
   * Launch Form
   */
  public onSubmit() {
    this.spinner = true;

    if (this.activeCarmodel) {
      // Update
      this.updateCarmodel();
      return;
    } else {
      // Create
      this.createCarmodel();
    }
  }

  /**
   * Print Alert
   * @param message String
   * @param type SweetAlertIcon | String
   */
  public printAlert(message: string, type: SweetAlertIcon) {
    Swal.fire({
      icon: type,
      text: message,
      showConfirmButton: true,
      confirmButtonColor: '#EEB838',
      timer: 3500
    }).then(() => {
      this.spinner = false;
    });
  }

}