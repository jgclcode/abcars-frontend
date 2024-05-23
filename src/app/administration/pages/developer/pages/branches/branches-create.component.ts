import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// Animations
import Swal, { SweetAlertIcon } from "sweetalert2";

// Services
import { BranchService } from './services/branch.service';

// Interfaces
import { BranchByID, UpdateBranch } from './interfaces/branch-by-id.interface';
import { State, StatesData } from './interfaces/states-data.interface';
import { BranchCreate } from './interfaces/branch-create.interface';

@Component({
  selector: 'app-branches-create',
  templateUrl: './branches-create.component.html'
})

export class BranchesCreateComponent implements OnInit {

  // References of Help
  private _branch_id: number = 0;
  public activeBranch: boolean = false;
  public spinner: boolean = false;  

  // Form References
  public states:State[] = [];
  public form!: UntypedFormGroup;

  constructor(
    private _router: Router,
    private _formBuilder: UntypedFormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _branchService: BranchService
  ) {
    // Create form
    this.createForm();
  }

  ngOnInit(): void {
    this.scrollTop();

    // Get states
    this.getStates();

    this._activatedRoute.params
    .subscribe({
      next: (params) => {
        if (params['branch_id'] != undefined) {
          this.activeBranch = true;
          this._branch_id = params['branch_id'];
          this.getBranch(params['branch_id']);
        }
      }
    });
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();
  }

  get nameInvalid() {
    return this.form.get('name')!.invalid && (this.form.get('name')!.dirty || this.form.get('name')!.touched);
  }

  get stateInvalid() {
    return this.form.get('state_id')!.invalid && (this.form.get('state_id')!.dirty || this.form.get('state_id')!.touched);
  }

  /**
   * Form Initialization
   */
  public createForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9- ]+")]],
      state_id: ['', [Validators.required]]
    });
  }

  /**
   * Get all States
   */
  public getStates(): void {
    this._branchService.getStates()
    .subscribe({
      next: ({ states }: StatesData) => this.states = states
    });
  }

  /**
   * Create Method
   */
  public createBranch() {
    this._branchService.setBranch(this.form.value)
    .subscribe({
      next: ({ code, status }: BranchCreate) => {
        if (code === '200' && status == "success") {
          this.printAlert('La sucursal se creo exitosamente', 'success');
          this._router.navigateByUrl('/admin/developer/branches');
        } else {
          this.printAlert('Error al registrar la sucursal, verifique y vuelva a intentarlo', 'error');
        }
      },
      error: (error) => this.printAlert(error?.message, 'error')
    });
  }

  /**
   * Update Method
   */
  public updateBranch() {
    this._branchService.updateBranch(this._branch_id, this.form.value)
    .subscribe({
      next: ({ code, status }: UpdateBranch) => {
        if (code === '200' && status === 'success') {
          this.printAlert('La sucursal se actualizo correctamente', 'success');
          this._router.navigateByUrl('/admin/developer/branches');
        } else {
          this.printAlert('No se pudo actualizar la sucursal, verifique y vuelva a intentarlo', 'error');
        }
      },
      error: (error) => this.printAlert(error?.message, 'error')
    });
  }

  /**
   * Get branch
   */
  public getBranch(branch_id: number) {
    this._branchService.getBranchById(branch_id)
    .subscribe({
      next: ({ code, status, branch }: BranchByID) => {
        if (code === 200 && status == 'success') {
          this.form.reset({
            name: branch.name,
            state_id: branch.state.id
          });
        }
      }
    });
  }

  /**
   * Launch Form
   */
  public onSubmit() {
    this.spinner = true;

    if (this.activeBranch) {
      // Update
      this.updateBranch();
      return;
    } else {
      // Create
      this.createBranch();
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
