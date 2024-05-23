import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

// Services
import { RoleService } from './services/role.service';

// Interfaces
import { RoleByID } from './interfaces/role-by-id.interface';
import { RoleCreate } from './interfaces/role-create.interface';

// Animations
import Swal from "sweetalert2";
import { RoleUpdate } from './interfaces/role-data.interface';

@Component({
  selector: 'app-roles-create',
  templateUrl: './roles-create.component.html'
})

export class RolesCreateComponent implements OnInit {

  // References
  public form!: UntypedFormGroup;
  public hide: boolean = true;  
  public spinner: boolean = false;

  public update_role: boolean = false;
  public role_id!: number;
  public formData: boolean = false;

  constructor(
    private _router: Router,
    private _formBuilder: UntypedFormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _roleService:RoleService
  ) { 
    // Create form
    this.createForm();
  }

  ngOnInit(): void {
    this._activatedRoute.params
    .subscribe({
      next: (params) => {
        if (params['role_id'] != undefined) {
          this.update_role = true;
          this.role_id = params['role_id'];
          this.getRoleById();
        } else {
          this.formData = true;
          this.createForm();
        }
      }
    });

    this.scrollTop();
  }

  public getRoleById() {
    this._roleService.getRolById(this.role_id)
    .subscribe({
      next: ({ role }: RoleByID) => {
        this.form.reset({
          name: role.name
        });
      }
    });
  }

  public createRole() {
    this._roleService.CreateRole(this.form.value)
    .subscribe({
      next: (role: RoleCreate) => {
        if (role.status == "success") {
          this.alertaSuccess(role);
        } else {
          this.alertaError(role);
        }
      }
    });
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();
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
      this._router.navigateByUrl('/admin/developer/roles');
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

  /**
   * Getters Inputs Check
   */
  get nameInvalid() {
    return this.form.get('name')!.invalid && (this.form.get('name')!.dirty || this.form.get('name')!.touched);
  }

  /**
   * Form Initialization
   */
  public createForm() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9- ]+")]],
      guard_name: ['web']
    });
  }

  /**
   * Form Client Information
   */
  public onSubmit() {
    // Change spinner
    this.spinner = true;

    if (this.update_role) {
      // Update role
      this._roleService.updateRole(this.role_id, this.form.value)
      .subscribe({
        next: (roleUpdate: RoleUpdate) => {
          if (roleUpdate.code === '200' && roleUpdate.status === 'success') {
            this.alertaSuccess(roleUpdate);
          } else {
            this.alertaError(roleUpdate);
          }
        }
      });
    } else {
      this.createRole();
    }
  }

}
