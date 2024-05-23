import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

// Animations
import Swal from "sweetalert2";

// Components
import { SparePartsEditComponent } from '../spare-parts-edit/spare-parts-edit.component';

// Services
import { SparePartsService } from '../../../spare-parts/services/spare-parts.service';

// Interfaces
import { UpdateSparePart } from '../../../spare-parts/interfaces/spare-parts.interface';
import { Router } from '@angular/router';

// Change location app
import localeESMX from "@angular/common/locales/es-MX";
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeESMX);

@Component({
  selector: 'app-spare-parts-edit-manager',
  templateUrl: './spare-parts-edit-manager.component.html',
  providers: [
    { provide: LOCALE_ID, useValue: 'es-MX' }
  ]
})

export class SparePartsEditManagerComponent implements OnInit {

  // References
  public form!: UntypedFormGroup;
  public spinner: boolean = false;
  public spare_part: any = {};

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<SparePartsEditComponent>, 
    private _formBuilder: UntypedFormBuilder,
    private _sparePart: SparePartsService,
    private _router: Router,
  ) { 
    // Create form
    this.createForm();
  }

  ngOnInit(): void {
    // Set values of spare parts
    if (this.data.spare) {
      const {   
        status,
        type_part,
        comments,
        priceOriginal,
        timeOriginal,
        priceGeneric,
        timeGeneric,
        priceUsed,
        timeUsed,
      } = this.data.spare;

      // Fill information static
      this.spare_part = {
        priceOriginal,
        timeOriginal,
        priceGeneric,
        timeGeneric,
        priceUsed,
        timeUsed
      };

      // Fill form with information
      this.form.patchValue({
        status: (status === 'approved' || status === 'rejected') ? status : '',
        type_part,
        priceOriginal,
        priceGeneric,
        priceUsed,
        comments
      });
    }
  }

  /* Getters Checking Inputs */
  get typeInvalid() {
    return this.form.get('type_part')!.invalid && (this.form.get('type_part')!.dirty || this.form.get('type_part')!.touched);
  }

  get statusInvalid() {
    return this.form.get('status')!.invalid && (this.form.get('status')!.dirty || this.form.get('status')!.touched);
  }

  /**
   * Create form
   */
  private createForm() {
    this.form = this._formBuilder.group({
      type_part: ['', [Validators.required]],
      status: ['', [Validators.required]],
      comments: ['']
    });
  }

  /**
   * Launch form
   */
  public submit() {
    // Change flag
    this.spinner = true; 
    
    // Get prices of spare
    const { priceOriginal, priceGeneric, priceUsed } = this.data.spare;

    // Set news controls in form
    this.form.addControl('priceOriginal', this._formBuilder.control(priceOriginal)); 
    this.form.addControl('priceGeneric', this._formBuilder.control(priceGeneric)); 
    this.form.addControl('priceUsed', this._formBuilder.control(priceUsed)); 

    // If the comments are empty fill with a text
    if (this.form.get('comments')?.value === '') {
      this.form.get('comments')?.setValue('Sin comentarios.');
    }

    // Launch
    this._sparePart.putSparePartsByID(this.form.value, this.data.spare.id)
    .subscribe({
      next: ({ code, status, message }: UpdateSparePart) => {
        if (code === '200' && status === 'success') {
          // Alert
          Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: message,
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });

          this.closeSheet();
          this.spinner = false;

          // Load again spare parts
          this._router.routeReuseStrategy.shouldReuseRoute = function () { return false; } 
          this._router.onSameUrlNavigation = 'reload'; 
          this._router.navigate([`/admin/pmanager/vehicles/edit/${ this.data.sell_your_car_id }`]);
        } else {
          this.spinner = false; 
          
          // Alert
          Swal.fire({
            icon: 'error',
            title: 'Ooppps!',
            text: message,
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3000
          });
        }
      },
      error: (error) => {
        this.spinner = false; 
      }
    });
  }

  /**
   * Close Bottom Sheet Ref
   * @param event MouseEvent
   */
   public closeSheet(): void {
    this._bottomSheetRef.dismiss();
  }

}