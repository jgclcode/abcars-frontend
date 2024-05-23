import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BrandService } from './services/brand.service';
import { BrandByID } from './interfaces/brand-by-id.interface';
import { BrandCreate } from './interfaces/brand-create.interface';

// Animations
import Swal from "sweetalert2";
import { BrandUpdate } from './interfaces/brand-update.interface';
@Component({
  selector: 'app-brands-create',
  templateUrl: './brands-create.component.html'
})

export class BrandsCreateComponent implements OnInit {

  // References of Help
  public spinner: boolean = false;
  public hide: boolean = true;

  // Form References
  public form!: UntypedFormGroup;
  public update_brand: boolean = false;
  public brand_id!:number;
  public formData:boolean = false;
  public file!: File;

  constructor(
    private _router: Router,
    private _formBuilder: UntypedFormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _brandService: BrandService
  ) { 
    // Create form
    this.createForm();
  }

  ngOnInit(): void {
    this.scrollTop();
    this.createForm();

    this._activatedRoute.params.subscribe(params => {      
      if (params['brand_id'] != undefined) {        
        this.update_brand = true;        
        this.brand_id = params['brand_id'];             
        this.getBrandById();                           
      } else {
        this.formData = true;        
      }    
    });
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }

  onChange(event: any): void {
    this.file = event.target.files[0];    
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

  get locationInvalid() {
    return this.form.get('location')!.invalid && (this.form.get('location')!.dirty || this.form.get('location')!.touched);
  }

  get contactInvalid() {
    return this.form.get('contact')!.invalid && (this.form.get('contact')!.dirty || this.form.get('contact')!.touched);
  }

  get pictureInvalid() {
    return this.form.get('picture')!.invalid && (this.form.get('picture')!.dirty || this.form.get('picture')!.touched);
  }

  /**
   * Form Initialization
   */
  public createForm() {
    this.form = this._formBuilder.group({      
      name: ['ABCars', [Validators.required, Validators.pattern("[a-zA-Z0-9- ]+")]],      
      description: ['ABCars', [Validators.required]],
      location: ['Puebla', [Validators.required]],
      contact: ['1234567890', [Validators.required]],
      picture: [null, [Validators.required]],
    });
  }

  /**
   * Form Client Information
   */
  public onSubmit() {
    this.spinner = true;
    
    if (this.update_brand) {
      this.updateBrand();
    } else {      
      this.setBrand();
    }
  }

  public getBrandById(): void {
    this._brandService.getBrandById(this.brand_id).subscribe(
      (brandByID:BrandByID) => {                       
        this.form.reset({
          name: brandByID.brand.name,
          description: brandByID.brand.description,
          location: brandByID.brand.location,
          contact: brandByID.brand.contact
        });
      }
    );
  }

  public setBrand(): void {
    this._brandService.setBrand( 
      this.form.get('name')?.value, 
      this.form.get('description')?.value, 
      this.form.get('location')?.value, 
      this.form.get('contact')?.value, 
      this.file 
    ).subscribe(
      (brandCreate: BrandCreate) => {
        if (brandCreate.status == "success") {
          this.alertaSuccess(brandCreate);
        } else {
          this.alertaError(brandCreate);
        } 
      }
    );
  }

  public updateBrand(): void {
    this._brandService.updateBrand( 
      this.brand_id,
      this.form.get('name')?.value, 
      this.form.get('description')?.value, 
      this.form.get('location')?.value, 
      this.form.get('contact')?.value, 
      this.file 
    ).subscribe(
      (brandUpdate: BrandUpdate) => {
        if (brandUpdate.status == "success") {
          this.alertaSuccess(brandUpdate);
        } else {              
          this.alertaError(brandUpdate);
        } 
      }
    );
  }

  public alertaSuccess(elemento: any) {
    Swal.fire({
      icon: 'success',
      text: elemento.message,
      showConfirmButton: true,
      confirmButtonColor: '#EEB838',
      timer: 3500         
    }).then(() => {
      this.spinner = false;
      this._router.navigateByUrl('/admin/developer/brands');                         
    }); 
  }

  public alertaError(elemento: any) {
    Swal.fire({
      icon: 'error',
      title: 'Ooopppps!',
      text: elemento.errors[0],
      showConfirmButton: true,
      confirmButtonColor: '#EEB838',
      timer: 3500
    }).then(() => {
      this.spinner = false;
    });
  }

}
