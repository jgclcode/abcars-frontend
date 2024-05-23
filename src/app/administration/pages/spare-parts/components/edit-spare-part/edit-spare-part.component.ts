import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

// Utils
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

// Interfaces
import { UpdateSparePart } from '../../interfaces/spare-parts.interface';

// Services
import { SparePartsService } from '../../services/spare-parts.service';

// Components
import { SparePartsEditComponent } from '../spare-parts-edit/spare-parts-edit.component';

// Animations
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-spare-part',
  templateUrl: './edit-spare-part.component.html',
  providers: [
    DatePipe
  ]
})

export class EditSparePartComponent implements OnInit {

  // References
  public form!: UntypedFormGroup;
  public date = new Date();
  public spare_part: any;
  public spinner: boolean = false;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _formBuilder: UntypedFormBuilder,
    private _bottomSheetRef: MatBottomSheetRef<SparePartsEditComponent>, 
    private _router: Router,
    private _datePipe: DatePipe,
    private _sparePart: SparePartsService,
  ) { 
    // Create form
    this.createForm();
  }

  ngOnInit(): void {
    // Fill form with data
    if (this.data.spare) {
      const { 
        priceOriginal,
        timeOriginal,
        priceGeneric,
        timeGeneric,
        priceUsed,
        timeUsed
      } = this.data.spare;

      // Set values of spare part
      this.form.patchValue({
        priceOriginal,
        timeOriginal,
        priceGeneric,
        timeGeneric,
        priceUsed,
        timeUsed,
      });
    }
  }

  // Getters
  get invalidPriceOriginal() {
    return this.form.get('priceOriginal')!.invalid && (this.form.get('priceOriginal')!.dirty || this.form.get('priceOriginal')!.touched);
  }

  get invalidTimeOriginal() {
    return this.form.get('timeOriginal')!.invalid && (this.form.get('timeOriginal')!.dirty || this.form.get('timeOriginal')!.touched);
  }

  get invalidPriceGeneric() {
    return this.form.get('priceGeneric')!.invalid && (this.form.get('priceGeneric')!.dirty || this.form.get('priceGeneric')!.touched);
  }

  get invalidTimeGeneric() {
    return this.form.get('timeGeneric')!.invalid && (this.form.get('timeGeneric')!.dirty || this.form.get('timeGeneric')!.touched);
  }

  get invalidPriceUsed() {
    return this.form.get('priceUsed')!.invalid && (this.form.get('priceUsed')!.dirty || this.form.get('priceUsed')!.touched);
  }

  get invalidTimeUsed() {
    return this.form.get('timeUsed')!.invalid && (this.form.get('timeUsed')!.dirty || this.form.get('timeUsed')!.touched);
  }

  /**
   * Create Form
   */
  public createForm() {
    this.form = this._formBuilder.group({
      priceOriginal: ['', [Validators.required, Validators.min(0), Validators.max(1000000), Validators.pattern('[0-9]{1,7}')]],
      timeOriginal: ['', [Validators.required]],
      priceGeneric: ['', [Validators.required, Validators.min(0), Validators.max(1000000), Validators.pattern('[0-9]{1,7}')]],
      timeGeneric: ['', [Validators.required]],
      priceUsed: ['', [Validators.required, Validators.min(0), Validators.max(1000000), Validators.pattern('[0-9]{1,7}')]],
      timeUsed: ['', [Validators.required]],
    })
  }

  /**
   * Launch form
   */
  public submit() {
    // Change flag
    this.spinner = true;    

    // Time Transform at correct format
    this.form.patchValue({
      timeOriginal: this._datePipe.transform(this.form.get('timeOriginal')?.value, 'yyyy-MM-dd'),
      timeGeneric: this._datePipe.transform(this.form.get('timeGeneric')?.value, 'yyyy-MM-dd'),
      timeUsed: this._datePipe.transform(this.form.get('timeUsed')?.value, 'yyyy-MM-dd')
    });

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
          this._router.navigate([`/admin/parts/vehicles/edit/${ this.data.sell_your_car_id }`]);
        } else {
          // Alert
          Swal.fire({
            icon: 'error',
            title: 'Ooppps!',
            text: message,
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3000
          });

          this.spinner = false;
          this.closeSheet();
        }
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