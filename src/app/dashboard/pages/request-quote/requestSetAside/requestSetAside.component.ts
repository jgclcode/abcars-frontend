import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DetailService } from '../../comprar-autos/services/detail/detail.service';
import { Vehicle, VehicleData } from '../../comprar-autos/interfaces/detail/vehicle_data.interface';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/auth/interfaces/register.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Register, Client } from '../../../../auth/interfaces/register.interface';
import { Login } from '../../../../auth/interfaces/login.interface';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-request-set-aside',
    standalone: false,
    // imports: [
    //     CommonModule,
    // ],
    templateUrl: './requestSetAside.component.html',
    styleUrls: ['./requestSetAside.component.css'],
})
export class RequestSetAsideComponent implements OnInit { 
    public disabled = true;
    isLinear = true;
    mercadoPago = true;
    activo = false;
    stripe = false;
    public spinner: boolean = false;
    public follow: boolean = true;

    public vin: string;
    public vehicle: Vehicle;
    public image: string;
    public baseUrl: string = environment.baseUrl;

    public user: User;
    public rewards: string = '';

    // References Form
    public form: UntypedFormGroup;
    public primeForm: UntypedFormGroup;
    public auth: UntypedFormGroup;
    public formClient: UntypedFormGroup;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _detailService: DetailService,
        private _formBuilder: UntypedFormBuilder,
        private _authService: AuthService
    ) {
        this._createForm();
        if (localStorage.getItem('user')) {
            this.user = JSON.parse(localStorage.getItem('user')!);
            this.form.clearValidators();
            this.form.patchValue({
                name: [this.user.name],
                surname: [this.user.surname],
                email: [this.user.email],
                curp: ['******************']
            });

            for (const key in this.form.controls){
                this.form.get(key)?.clearValidators();
                this.form.get(key)?.updateValueAndValidity();
                this.form.controls['name'].disable();
                this.form.controls['surname'].disable();
                this.form.controls['phoneOne'].disable();
                this.form.controls['phoneTwo'].disable();
                this.form.controls['email'].disable();
                this.form.controls['gender'].disable();
                this.form.controls['curp'].disable();
            }
        }
    }

    ngOnInit(): void {
        this._activatedRoute.params
            .subscribe({
                next: (params) => {
                    this.vin = params['vin'];
                }
            });
        
        // this._vehicleGetInformation(this.vin);
        this.scrollTop();
    }

    public isMercadoPago(){
        this.mercadoPago = true;
        this.stripe = false;
        this._vehicleGetInformation(this.vin);
    }

    public isStripe(){
        this.stripe = true;
        this.mercadoPago = false;
    }

    scrollTop(){
        var scrollElem = document.querySelector('#moveTop');
        scrollElem!.scrollIntoView(); 
    }

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

    get emailInvalid() {
        return this.form.get('email')!.invalid && (this.form.get('email')!.dirty || this.form.get('email')!.touched);
    }

    get genderInvalid() {
        return this.form.get('gender')!.invalid && (this.form.get('gender')!.dirty || this.form.get('gender')!.touched);
    }

    get curpInvalid() {
        return this.form.get('curp')!.invalid && (this.form.get('curp')!.dirty || this.form.get('curp')!.touched);
      }

    private _createForm(){
        this.form = this._formBuilder.group({
            name: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
            surname: ['', [Validators.required, Validators.pattern("[a-zA-Z ]+")]],
            phoneOne: ['', [Validators.required, Validators.pattern("[0-9]+"), Validators.minLength(10), Validators.maxLength(10)]],
            phoneTwo: ['', [Validators.required, Validators.pattern("[0-9]+"), Validators.minLength(10), Validators.maxLength(10)]],
            email: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
            gender: ['', [Validators.required]],
            curp: ['', [Validators.required, Validators.pattern("[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}" +
                "(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])" +
                "[HM]{1}" +
                "(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)" +
                "[B-DF-HJ-NP-TV-Z]{3}" +
                "[0-9A-Z]{1}[0-9]{1}$"), Validators.minLength(18), Validators.maxLength(18)]],
            checkbox: [{value: false, disabled: false}, Validators.required],
            password: ['Abcars@@']
        });
    }

    private _vehicleGetInformation(vin: string){
        this._detailService.getVehicleByVin(vin)
        .subscribe({
            next: (veh: VehicleData) => {
                this.vehicle = veh.vehicle;
                if (this.vehicle.vehicle_images.length == 0) {
                    this.image = this.baseUrl + '/api/image_vehicle/vacio';
                } else {
                    this.vehicle.vehicle_images.map((imagen, idx) => {
                        if (idx === 0) {
                            this.image = imagen.path;
                        }
                    });
                }
            }
        });
    }

    public onSubmit(){
        this.spinner = false;
        this.follow = false;
        this.form.get('checkbox')?.disable();
        // console.log(localStorage.getItem('user'));
        // if (this.mercadoPago) this.activo = true;
        if (this.mercadoPago && localStorage.getItem('user')){
            this.activo = true;
        } else {
            // console.log('No es mercado o no user localStorage');
            this._authService.register(this.form.value)
            .subscribe({
                next: ({code, user}: Register) => {
                    if (code === '200') {
                        if (user) {
                            this.auth = this._formBuilder.group({
                                email: [user.email],
                                password: [this.form.controls['password'].value],
                                gettoken: [true]
                            });

                            this._authService.login(this.auth.value)
                            .subscribe(({code, token}: Login) => {
                                if (code === 200) {
                                    if (token.length > 0) {
                                        localStorage.setItem('user_token', token);

                                        this.formClient = this._formBuilder.group({
                                            phone1: [this.form.controls.phoneOne.value],
                                            phone2: [this.form.controls.phoneTwo.value],
                                            curp: [this.form.controls.curp.value],
                                            points: [0],
                                            user_id: [user.id],
                                            source_id: [1]
                                        });

                                        this._authService.registerClient(this.formClient.value)
                                        .subscribe({
                                            next: ({code, status}: Client) => {
                                                if (code === '200' && status === 'success') {
                                                    localStorage.setItem('user', JSON.stringify({
                                                        'id': user.id,
                                                        'name': user.name,
                                                        'surname': user.surname,
                                                        'email': user.email
                                                    }));
                                                    this.user = JSON.parse(localStorage.getItem('user')!);
                                                    this.activo = true;
                                                } else {
                                                    Swal.fire({
                                                        icon: 'error',
                                                        title: 'Ooopppps!',
                                                        text: 'Al parecer ocurrió un error al registrar su cuenta.',
                                                        showConfirmButton: true,
                                                        confirmButtonColor: '#EEB838',
                                                        timer: 3500
                                                    });
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Ooopppps!',
                                text: 'Al parecer la información ingresada ya ha sido utilizada por otro cliente, verifique e intente nuevamente.',
                                showConfirmButton: true,
                                confirmButtonColor: '#EEB838',
                            });
                        }
                    }
                },
                error: (error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Ooopppps!',
                        text: 'Al parecer ocurrió un error al registrar su cuenta, verifique y vuelva a interntarlo.',
                        showConfirmButton: true,
                        confirmButtonColor: '#EEB838',
                        timer: 3500
                    });
                }
            });
        }
    }

    public convertMayus(event: any): string {
        return event.target.value = event.target.value.toUpperCase();
    }

    public maxLengthCheck(object: any) {   
        if (object.value.length > object.maxLength) {
          object.value = object.value.slice(0, object.maxLength)
        }
    }

    public getUrl(){
        return `${this.baseUrl}/api/payment/${this.vin}/${this.user.id}`;
    }

}
