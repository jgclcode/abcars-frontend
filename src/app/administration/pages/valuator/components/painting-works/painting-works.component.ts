import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

// Animations
import Swal from "sweetalert2";

// Services
import { PaintingWorksService } from '../../services/painting-works.service';

// Interfaces
import { PaintingWorks, PostPaintingWorks, ImgDamagePaintingWorks, PaintingWork } from '../../interfaces/painting_works.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-painting-works',
  templateUrl: './painting-works.component.html'
})
export class PaintingWorksComponent implements OnInit {

  // References
  public formPaintingWorks!: UntypedFormGroup;
  public _paintingWorksGeneral!: UntypedFormGroup;
  public spinner: boolean = false;
  public painting_works_elements: PaintingWorks[] = [];
  public damage_image_file:any;
  public painting_works: PaintingWork[] = [];
  public url: string = environment.baseUrl;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data:any,
    private bottomsheet: MatBottomSheetRef,
    private _formBuilder: UntypedFormBuilder,
    private _paintingWorksService: PaintingWorksService
  ) { 
    // Create Painting Works Form
    this.createPaintingWorksForm();
    this.initImgDamagePaintingWorks();
  }

  ngOnInit(): void {
  }

  get nameDescriptionInvalid() {
    return this.formPaintingWorks.get('name')!.invalid && (this.formPaintingWorks.get('name')!.dirty || this.formPaintingWorks.get('name')!.touched);
  }

  get amountInvalid(){
    return this.formPaintingWorks.get('amount')!.invalid && (this.formPaintingWorks.get('amount')!.dirty || this.formPaintingWorks.get('amount')!.touched);
  }

  get imgDamageInvalid(){
    return this.formPaintingWorks.get('picture')?.value === null;
  }

  public createPaintingWorksForm(){
    this.formPaintingWorks = this._formBuilder.group({
      name:       ['', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      amount:     [0, Validators.required],
      picture:    [null, [Validators.required]]
    });
  }

  public initImgDamagePaintingWorks(){
    this._paintingWorksService.getPaintingWorks(this.data.sell_your_car_id)
    .subscribe({
      next: ({ code, status, painting_works}: ImgDamagePaintingWorks) => {
        if (code === 200 && status === 'success') {
          this.painting_works = painting_works;
        }
      },
      error: (error) => {
        this.painting_works = [];
      }
    });
  }

  public damageImage(file: any){
    this.damage_image_file = file.target.files[0];
  }

  /* Launch Form */
  
  public onSubmit(){
    this.spinner = true;

    this.addPaintingWorks();

    this.painting_works_elements.forEach(painting_works => {
      const { name, amount, picture } = painting_works; 

      // Launch form
      this._paintingWorksService.postPaintingWorks(name, amount, this.damage_image_file, this.data.sell_your_car_id, )
      .subscribe({
        next: ({ code, status, message }: PostPaintingWorks ) => {
          if (code === '200' && status === 'success') {
            Swal.fire({
              icon: 'success',
              text: String(message),
              showConfirmButton: true,
              confirmButtonColor: '#EEB838',
              timer: 3500
            });

            this.spinner = false;
            this.initImgDamagePaintingWorks();
          }else {
            Swal.fire({
              icon: 'error',
              text: 'No ha sido posible enviar la solicitud HyP con éxito.',
              showConfirmButton: true,
              confirmButtonColor: '#EEB838',
              timer: 3500
            });

            this.spinner = false;
          }
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            text: 'Ha ocurrido un error al enviar los conceptos solicitados, vuelva a intentarlo más tarde.',
            showConfirmButton: true,
            confirmButtonColor: '#EEB838',
            timer: 3500
          });

          this.spinner = false;
        }
      });
    });

    this.painting_works_elements = [];
  }
  /* Elements in array of painting works */

  public addPaintingWorks(){
    this._paintingWorksGeneral = {
      ...this.formPaintingWorks.value,
      'picture': this.damage_image_file
    }
    // Push element in array
    this.painting_works_elements.push(this.formPaintingWorks.value);
    // Reset form
    this.createPaintingWorksForm();
    this.formPaintingWorks.get('name')?.clearValidators();
    this.formPaintingWorks.get('name')?.updateValueAndValidity();
    this.formPaintingWorks.get('amount')?.clearValidators();
    this.formPaintingWorks.get('amount')?.updateValueAndValidity();
    this.formPaintingWorks.get('picture')?.clearValidators();
    this.formPaintingWorks.get('picture')?.updateValueAndValidity();
  }

  /* Delete painting works in array position */
  public deletePaintingWorks(index: number){
    this.painting_works_elements.splice(index, 1);
  }

  /**
   * Close Bottom Sheet
   */
  public closeBottomSheet() {
    this.bottomsheet.dismiss();
  }

}
