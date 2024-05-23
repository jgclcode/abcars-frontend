import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
// Animations
import Swal from "sweetalert2";

// Services
import { UserService } from './services/user.service';
import { RoleService } from '../roles/services/role.service';

// Interfaces
import { UserByIDData, User } from './interfaces/user-by-id-data.interface';
import { UserUpdate } from './interfaces/user-update.interface';
import { UserCreate } from './interfaces/user-create.interface';
import { RoleData, Role } from '../roles/interfaces/role-data.interface';

@Component({
  selector: 'app-users-create',
  templateUrl: './users-create.component.html'
})

export class UsersCreateComponent implements OnInit {

  // References of Help
  public spinner: boolean = false;
  public hide: boolean = true;
  public showForm: boolean = false;

  // Form References
  public form!: UntypedFormGroup;
  public update_user: boolean = false;
  public user_id!:number;
  public user: User|undefined = undefined;
  public roles!: Role[];

  constructor(
    private _router: Router,
    private _formBuilder: UntypedFormBuilder,
    private _userService: UserService,
    private _activatedRoute: ActivatedRoute,
    private _roleService: RoleService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.scrollTop();
    this.getRoles();

    this._activatedRoute.params
    .subscribe({
      next:(params) => {
        if( params['user_id'] != undefined ){
          this.update_user = true;
          this.user_id = params['user_id'];
          this.getUser();
        }else{
          this.showForm = true;
          this.createForm();
        }
      }
    });
  }

  public getUser(){
    this._userService.getUserById( this.user_id )
    .subscribe({
      next: ( userData:UserByIDData ) => {
        this.user = userData.user;
        this.showForm = true;
        // Create form
        this.createForm();
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

  get surnameInvalid() {
    return this.form.get('surname')!.invalid && (this.form.get('surname')!.dirty || this.form.get('surname')!.touched);
  }

  get phoneOneInvalid() {
    return this.form.get('phoneOne')!.invalid && (this.form.get('phoneOne')!.dirty || this.form.get('phoneOne')!.touched);
  }

  get phoneTwoInvalid() {
    return this.form.get('phoneTwo')!.invalid && (this.form.get('phoneTwo')!.dirty || this.form.get('phoneTwo')!.touched);
  }

  get genderInvalid() {
    return this.form.get('gender')!.invalid && (this.form.get('gender')!.dirty || this.form.get('gender')!.touched);
  }

  get curp() {
    return this.form.get('curp')!.invalid && (this.form.get('curp')!.dirty || this.form.get('curp')!.touched);
  }

  get emailInvalid() {
    return this.form.get('email')!.invalid && (this.form.get('email')!.dirty || this.form.get('email')!.touched);
  }

  get passwordInvalid() {
    return this.form.get('password')!.invalid && (this.form.get('password')!.dirty || this.form.get('password')!.touched);
  }

  get passwordEquals() {
    let password = this.form.get('password')?.value;
    let cpassword = this.form.get('cpassword')?.value;

    return password != cpassword;
  }

  get roleInvalid() {
    return this.form.get('role_name')!.invalid && (this.form.get('role_name')!.dirty || this.form.get('role_name')!.touched);
  }

  /**
   * Form Initialization
   */
  public createForm() {
    this.form = this._formBuilder.group({
      name: [this.user != undefined ? this.user?.name : '', [Validators.required, Validators.pattern("[a-zA-Z ]+") ]],
      surname: [this.user != undefined ? this.user?.surname : '', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
      email: [this.user != undefined ? this.user?.email : '', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      gender: [this.user != undefined ? this.user?.gender : '', [Validators.required]],
      phoneOne: [this.user != undefined ? this.user?.clients.length > 0 ? this.user?.clients[0].phone1 : '' : '', [Validators.required, Validators.pattern("[0-9]{10}"), Validators.minLength(10), Validators.maxLength(10)]],
      phoneTwo: [this.user != undefined ? this.user?.clients.length > 0 ? this.user?.clients[0].phone2 : '' : '', [Validators.required, Validators.pattern("[0-9]{10}"), Validators.minLength(10), Validators.maxLength(10)]],
      curp: [this.user != undefined ? this.user?.clients.length > 0 ? this.user?.clients[0].curp : '' : '', [Validators.required, Validators.pattern("[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}" +
        "(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])" +
        "[HM]{1}" +
        "(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)" +
        "[B-DF-HJ-NP-TV-Z]{3}" +
        "[0-9A-Z]{1}[0-9]{1}$"), Validators.minLength(18), Validators.maxLength(18)]],
      password: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9@%#]+"), Validators.minLength(8), Validators.maxLength(32)]],
      cpassword: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9@%#]+"), Validators.minLength(8), Validators.maxLength(32)]],
      role_name: [this.user != undefined ? this.user?.roles[0]?.name : '', [Validators.required]],
    });
  }

  /**
   * Form Client Information
   */
  public onSubmit() {
    // Change spinner
    this.spinner = true;

    if( !this.update_user ) {
      this._userService.createUser( this.form.value )
      .subscribe({
        next: ( userCreate: UserCreate ) => {
          if( userCreate.status == "success" ){
            Swal.fire({
              icon: 'success',                
              text: userCreate.message,
              showConfirmButton: true,
              confirmButtonColor: '#EEB838',
              timer: 3500         
            }).then( () => {
              this.spinner = false;
              this._router.navigateByUrl('/admin/developer/users');                         
            }); 
          }else{
            Swal.fire({
              icon: 'error',
              title: 'Ooopppps!',
              text: userCreate.errors[0],
              showConfirmButton: true,
              confirmButtonColor: '#EEB838',
              timer: 3500
            }).then(()=>{
              this.spinner = false;
            });
          }
        }
      });
    } else {
      this._userService.updateUser( this.form.value, this.user_id )
      .subscribe({
        next: ( userUpdate:UserUpdate ) => {
          if( userUpdate.status == "success" ){
            Swal.fire({
              icon: 'success',
              text: userUpdate.message,
              showConfirmButton: true,
              confirmButtonColor: '#EEB838',
              timer: 3500
            }).then( () => {
              this.spinner = false;
              this._router.navigateByUrl('/admin/developer/users');
            });
          }else{
            Swal.fire({
              icon: 'error',
              title: 'Ooopppps!',
              text: userUpdate.errors[0],
              showConfirmButton: true,
              confirmButtonColor: '#EEB838',
              timer: 3500
            }).then(()=>{
              this.spinner = false;
            });
          }
        }
      });
    }
  }

  /**
   * Get Roles
   */
  public getRoles() {
    this._roleService.getRoles(9999)
    .subscribe({
      next: ({ code, status, roles }: RoleData) => {
        if (code === '200' && status === 'success') {
          this.roles = roles.data;
        }
      }
    });
  }

  /**
   * Checking length input
   * @param object any input
   */
  public maxLengthCheck(object: any) {
    if (object.value.length > object.maxLength) {
      object.value = object.value.slice(0, object.maxLength)
    }
  }

  /**
   * Helper function to convert text String to Uppercase
   * @param event keyup
   * @returns string
   */
  public convertMayus(event: any): string {
    return event.target.value = event.target.value.toUpperCase();
  }

}
