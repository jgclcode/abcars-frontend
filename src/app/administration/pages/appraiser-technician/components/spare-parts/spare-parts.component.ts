import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

// Animations
import Swal from "sweetalert2";

// Services
import { SparePartsService } from '../../services/spare-parts.service';

// Interfaces
import { SpareParts, PostSparePart, GetSpareParts, SparePart } from '../../interfaces/spare_parts.interface';

@Component({
  selector: 'app-spare-parts',
  templateUrl: './spare-parts.component.html',
  styles: [`
    .add-button {
      background-color: #08AEEA;
      background-image: linear-gradient(0deg, #08AEEA 0%, #2AF598 100%);
      transition: 0.5s;
      background-size: 200% auto;
      box-shadow: 0 0 20px #eee;
      border-radius: 10px;
    }

    .add-button:hover {
      background-position: right center; /* change the direction of the change here */
      color: #fff;
      text-decoration: none;
    }
  `]
})

export class SparePartsComponent implements OnInit {

  // References
  public form!: UntypedFormGroup;
  public spinner: boolean = false;
  public spare_parts_quote: SpareParts[] = [];
  public spare_parts: SparePart[] = [];
  public checked = false;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomsheet: MatBottomSheetRef,
    private _formBuilder: UntypedFormBuilder,
    private _sparePartService: SparePartsService
  ) {
    // Create Form
    this.createForm();
  }

  ngOnInit(): void {
    // Get parts of vehicle
    this.getSpareParts();
  }

  get nameInvalid() {
    return this.form.get('name')!.invalid && (this.form.get('name')!.dirty || this.form.get('name')!.touched);
  }

  get amountInvalid() {
    return this.form.get('amount')!.invalid && (this.form.get('amount')!.dirty || this.form.get('amount')!.touched);
  }

  get hoursInvalid() {
    return this.form.get('hours')!.invalid && (this.form.get('hours')!.dirty || this.form.get('hours')!.touched);
  }

  /**
   * Create Form Sparte Parts
   */
  public createForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(80)]],
      amount: ['', [Validators.required, Validators.pattern("[0-9]{1,2}"), Validators.min(1)]],
      hours: ['', [Validators.required, Validators.max(24)]],
      sell_your_car_id: [''],
    });
  }

  /**
   * Get spare parts of sell your car
   */
  private getSpareParts() {
    this._sparePartService.getSpareParts(this.data.sell_your_car_id)
    .subscribe({
      next: ({ code, status, spare_parts }: GetSpareParts) => {
        if (code === 200 && status === 'success') {
          this.spare_parts = spare_parts;
        } else {
          this.spare_parts = [];
        }
      },
      error: (error) => {
        this.spare_parts = [];
      }
    });
  }

  /**
   * Launch Form
  */
  public onSubmit() {
    this.spinner = true;
    const totalParts = this.spare_parts_quote.length;

    this.spare_parts_quote.forEach((spare_part, index) => {
      const { name, amount, hours } = spare_part;
      const is_last = index === totalParts - 1;
      // Create spare_part form
      let spareForm = this._formBuilder.group({ name, amount, hours, sell_your_car_id: this.data.sell_your_car_id, is_last });

      // Launch form
      this._sparePartService.postSparePart(spareForm.value)
      .subscribe({
        next: ({ code, status, message }: PostSparePart) => {
          if (code === '200' && status === 'success') {
            if (is_last) {
              // Print Alert
              Swal.fire({
                icon: 'success',                
                text: String(message),
                showConfirmButton: true,
                confirmButtonColor: '#EEB838',
                timer: 3500         
              });
  
              this.spinner = false;
              this.getSpareParts();
            }
          } else {
            // Print Alert
            Swal.fire({
              icon: 'error',                
              text: 'No ha sido posible enviar la solicitud de refacciones con exito.',
              showConfirmButton: true,
              confirmButtonColor: '#EEB838',
              timer: 3500         
            });

            this.spinner = false;
          }
        },
        error: (error) => {
          // Print Alert
          Swal.fire({
            icon: 'error',
            text: 'Ha ocurrido un error al enviar las refacciones solicitadas, vuelva a intentarlo.',
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });

          this.spinner = false;
        }
      });

    });

    this.spare_parts_quote = [];
  }

  /**
   * Set elements into array of spare parts
   */
  public addSparePart() {
    
    if (this.form.valid) {
      // Push element in array
      this.spare_parts_quote.push(this.form.value);
      // Reset form & Clean controls
      this.createForm();
      this.form.get('name')?.clearValidators();
      this.form.get('name')?.updateValueAndValidity();
      this.form.get('amount')?.clearValidators();
      this.form.get('amount')?.updateValueAndValidity();
      this.form.get('hours')?.clearValidators();
      this.form.get('hours')?.updateValueAndValidity();
    }else{
      this.createForm();
      this.form.patchValue({
        name: 'Sin Reacondicionamiento',
        amount: 0,
        hours: 0,
        sell_your_car_id: this.data.sell_your_car_id
      });
      // Push element in array
      this.spare_parts_quote.push(this.form.value);
      this.form.patchValue({
        name: '',
        amount: '',
        hours: ''
      });
      this.onSubmit();
    }

  }

  /**
   * Delete spare part in position of array
   * @param index Number
   */
  public deletePart(index: number) {
    this.spare_parts_quote.splice(index, 1);
  }

  /**
   * Checking length input
   * @param object any input
   */
  public maxLengthCheck(object: any) {
    if (object.value.length > object.maxLength) {
      object.value = object.value.slice(0, object.maxLength);
    }
  }

  /**
   * Close Bottom Sheet
   */
  public closeBottomSheet() {
    this.bottomsheet.dismiss();
  }

  public noReconditioning(){
    if (this.checked) {
      Swal.fire({
        icon: 'warning',
        title: '¿Proceder sin agregar refacciones?',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Si',
        confirmButtonColor: '#eeb838',
      }).then((result) => {
        if (result.isConfirmed) {
          this.addSparePart();
        } else if (result.isDismissed) {
          this.checked = false;
        }
      });
    }
  }
}