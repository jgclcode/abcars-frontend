import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { SandboxService } from "src/app/shared/sandbox.service";
import { LoginComponent } from "../../login/login.component";
import { Observable } from "rxjs";
import { Result } from "../../shared/models/result";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { FormBuilder, FormGroup } from "@angular/forms";
import Swal from "sweetalert2";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-inicio",
  templateUrl: "./inicio.component.html",
  styleUrls: ["./inicio.component.css"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class InicioComponent implements AfterViewInit {
  id: string;
  nombre: string;
  vin: string;
  comentario!: string;
  category: string;

  selectedFiles?: FileList;
  selectedFileNames: string[] = [];

  progressInfos: any[] = [];
  message: string[] = [];

  previews: string[] = [];
  imageInfos?: Observable<any>;
  file: any;
  result: Result = new Result();
  searchInterior!: string;
  searchBodyWork!: string;
  searchElectronic!: string;
  searchTransmision!: string;
  searchMotor!: string;
  listData: any[] = [];
  displayedColumns: string[] = ["category", "comment", "image"];
  isButtonDisabled = false;

  //validacion de campos
  //vertial Stepper
  isInterior: boolean = false;
  isBodyWork: boolean = false;
  isElectric: boolean = false;
  isTransmission: boolean = false;
  isMotor: boolean = false;

  dataBodywork = new MatTableDataSource();
  dataElectric = new MatTableDataSource();
  dataInterior = new MatTableDataSource();
  dataTransmission = new MatTableDataSource();
  dataMotor = new MatTableDataSource();
  @ViewChild("paginaInterior", { static: true }) paginator1: MatPaginator;
  @ViewChild("paginaBodywork", { static: true }) paginator2: MatPaginator;
  @ViewChild("paginaElectric", { static: true }) paginator3: MatPaginator;
  @ViewChild("paginaTransmission", { static: true }) paginator4: MatPaginator;
  @ViewChild("paginaMotor", { static: true }) paginator5: MatPaginator;

  //horizontal Stepper
  isInteriorHorizontal: boolean = false;
  isBodyWorkHorizontal: boolean = false;
  isElectricHorizontal: boolean = false;
  isTransmissionHorizontal: boolean = false;
  isMotorHorizontal: boolean = false;

  dataBodyworkHorizontal = new MatTableDataSource();
  dataElectricHorizontal = new MatTableDataSource();
  dataInteriorHorizontal = new MatTableDataSource();
  dataTransmissionHorizontal = new MatTableDataSource();
  dataMotorHorizontal = new MatTableDataSource();
  @ViewChild("paginaInteriorHorizontal", { static: true })
  paginator1Horizontal: MatPaginator;
  @ViewChild("paginaBodyworkHorizontal", { static: true })
  paginator2Horizontal: MatPaginator;
  @ViewChild("paginaElectricHorizontal", { static: true })
  paginator3Horizontal: MatPaginator;
  @ViewChild("paginaTransmissionHorizontal", { static: true })
  paginator4Horizontal: MatPaginator;
  @ViewChild("paginaMotorHorizontal", { static: true })
  paginator5Horizontal: MatPaginator;
  @Input() data: LoginComponent | undefined;
  constructor(
    private sandboxService: SandboxService,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    const data = JSON.parse(localStorage.getItem("data") || "{}");
    console.log(data);
    this.id = data.id;
    this.nombre = data.name;
    this.vin = data.vin;
    this.category = data.category;
  }
  firstFormGroup: FormGroup = this._formBuilder.group({ firstCtrl: [""] });
  secondFormGroup: FormGroup = this._formBuilder.group({ secondCtrl: [""] });
  selectFiles(event: any): void {
    this.selectedFileNames = [];
    this.selectedFiles = event.target.files;
    this.file = event.target.files[0];

    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.previews.push(e.target.result);
        };

        reader.readAsDataURL(this.selectedFiles[i]);

        this.selectedFileNames.push(this.selectedFiles[i].name);
      }
    }
  }

  onGuardarCambios(category: string): void {
    //  this.dataSource = new MatTableDataSource();
    if (this.file && this.comentario) {
      this.isButtonDisabled = true;

      const data = new FormData();
      data.append("vehicle_id", this.id);
      data.append("category", category);
      data.append("comment", this.comentario);
      data.append("path", this.file);
      this.sandboxService.postAbcars(data).subscribe({
        next: (res: any) => {
          console.log(res);
          if (res.errors != null || res.errors != undefined) {
            this.result.message = res.errors.join(",");
          } else {
            Swal.fire({
              icon: "success",
              title: "Guardado",
              text: "Se guardo correctamente!",
            });
            this.result = res;
            this.isButtonDisabled = false;
          }
          this.category = "";
          this.comentario = "";
          this.file = [];
          this.selectedFileNames = [];
          this.selectedFiles = undefined;
          this.previews = [];
          if (category == "interior") {
            this.isInterior = true;
          } else if (category == "bodywork") {
            this.isBodyWork = true;
          } else if (category == "electric") {
            this.isElectric = true;
          } else if (category == "transmission") {
            this.isTransmission = true;
          } else if (category == "motor") {
            this.isMotor = true;
          }

          this.loadData();
        },
        error: (err) => {
          console.log(err);
          this.result.message = err;
        },
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Debe seleccionar un imagen y un comentario!",
      });
      this.isButtonDisabled = false;

    }
  }
  limpiar() {
    this.result = new Result();
    this.previews = [];
  }
  loadData() {
    this.sandboxService.getcheckByVehicleDetails(this.id).subscribe({
      next: (res: any) => {
        console.log(res.data);
        this.dataInterior = new MatTableDataSource(res.data.interior);
        this.dataInterior.paginator = this.paginator1;

        this.dataBodywork = new MatTableDataSource(res.data.bodywork);
        this.dataBodywork.paginator = this.paginator2;

        this.dataElectric = new MatTableDataSource(res.data.electric);
        this.dataElectric.paginator = this.paginator3;

        this.dataTransmission = new MatTableDataSource(res.data.transmission);
        this.dataTransmission.paginator = this.paginator4;

        this.dataMotor = new MatTableDataSource(res.data.motor);
        this.dataMotor.paginator = this.paginator5;

        ///

        this.dataInteriorHorizontal = new MatTableDataSource(res.data.interior);
        this.dataInteriorHorizontal.paginator = this.paginator1Horizontal;

        this.dataBodyworkHorizontal = new MatTableDataSource(res.data.bodywork);
        this.dataBodyworkHorizontal.paginator = this.paginator2Horizontal;

        this.dataElectricHorizontal = new MatTableDataSource(res.data.electric);
        this.dataElectricHorizontal.paginator = this.paginator3Horizontal;

        this.dataTransmissionHorizontal = new MatTableDataSource(
          res.data.transmission
        );
        this.dataTransmissionHorizontal.paginator = this.paginator4Horizontal;

        this.dataMotorHorizontal = new MatTableDataSource(res.data.motor);
        this.dataMotorHorizontal.paginator = this.paginator5Horizontal;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  ngAfterViewInit() {
    this.dataInterior.paginator = this.paginator1;
    this.dataBodywork.paginator = this.paginator2;
    this.dataElectric.paginator = this.paginator3;
    this.dataTransmission.paginator = this.paginator4;
    this.dataMotor.paginator = this.paginator5;

    this.dataInteriorHorizontal.paginator = this.paginator1Horizontal;
    this.dataBodyworkHorizontal.paginator = this.paginator2Horizontal;
    this.dataElectricHorizontal.paginator = this.paginator3Horizontal;
    this.dataTransmissionHorizontal.paginator = this.paginator4Horizontal;
    this.dataMotorHorizontal.paginator = this.paginator5Horizontal;
  }
  applyFilter(event: Event, seachrKey: string) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (seachrKey == "interior") {
      this.dataInterior.filter = filterValue.trim().toLowerCase();
      this.dataInteriorHorizontal.filter = filterValue.trim().toLowerCase();
    } else if (seachrKey == "bodywork") {
      this.dataBodywork.filter = filterValue.trim().toLowerCase();
      this.dataBodyworkHorizontal.filter = filterValue.trim().toLowerCase();
    } else if (seachrKey == "electric") {
      this.dataElectric.filter = filterValue.trim().toLowerCase();
      this.dataElectricHorizontal.filter = filterValue.trim().toLowerCase();
    } else if (seachrKey == "transmission") {
      this.dataTransmission.filter = filterValue.trim().toLowerCase();
      this.dataTransmissionHorizontal.filter = filterValue.trim().toLowerCase();
    } else if (seachrKey == "motor") {
      this.dataMotor.filter = filterValue.trim().toLowerCase();
      this.dataMotorHorizontal.filter = filterValue.trim().toLowerCase();
    }
  }
  cleanData(seachrKey: string) {
    if (seachrKey == "interior") {
      this.searchInterior = "";
    } else if (seachrKey == "bodywork") {
      this.searchBodyWork = "";
    } else if (seachrKey == "electric") {
      this.searchElectronic = "";
    } else if (seachrKey == "transmission") {
      this.searchTransmision = "";
    } else if (seachrKey == "motor") {
      this.searchMotor = "";
    }
    this.loadData();
  }

  onModalInterior() {
    Swal.fire({
      title: "Información",
      html:
        "Punto a revizar: <br/>" +
        "1. Alfonfra <br/>" +
        "2. Asientos <br/>" +
        "3. Bandeja trasera <br/>" +
        "4. Consola central <br/>" +
        "5. Cielo cinturones <br/>" +
        "6. Freno de mano <br/>" +
        "7. Guantera <br/>" +
        "8. Quemacocos <br/>" +
        "9. Marcos de puerta <br/>" +
        "10. Manijas Palanca de valocidades <br/>" +
        "11. Panel puerta <br/>" +
        "12. Pedales <br/>" +
        "13. Retrovisor <br/>" +
        "14. Radio <br/>" +
        "15. Luces interiores <br/>" +
        "16. Tablero <br/>" +
        "17. Tapetes <br/>" +
        "18. Volante Viseras <br/>",
      icon: "info", 
      confirmButtonColor: "#3085d6",
    
    });
  }
  onModalCarroceria() {
    Swal.fire({
      title: "Información",
      html:
        "Punto a revizar: <br/>" +
        "1. Cofre <br/>" +
        "2. Cajuela <br/>" +
        "3. Escape <br/>" +
        "4. Faros" +
        "5. Gomas  <br/>" +
        "6. Llantas <br/>" +
        "8.Puertas <br/>" +
        "9. Rines <br/>" +
        "10. Parabrisas <br/>" +
        "11. Ventanas <br/>" +
        "12. Panel <br/>" +
        "13. Parrilla <br/>" +
        "14. Piso <br/>" +
        "15. Medallon <br/>" +
        "16. Manijas <br/>" +
        "17. Techo <br/>",
      icon: "info", 
      confirmButtonColor: "#3085d6", 
    });
  }
  onModalElectricos() {
    Swal.fire({
      title: "Información",
      html:
        "Punto a revizar: <br/>" +
        "1. Aire acondicionado <br/>" +
        "2. Camara de reversa <br/>" +
        "3. Batería <br/>" +
        "4. Direccionales <br/>" +
        "5. Intermitentes <br/>" +
        "6. Limpiaparabrisas <br/>" +
        "7. Luces delanteras <br/>" +
        "8. Luces traseras <br/>" +
        "9. Luz de alto <br/>" +
        "10. Panel de instrumentos <br/>" +
        "11. Retrovisores eléctricos <br/>" +
        "12. Seguros Eléctricos <br/>" +
        "13. Sensores <br/>" +
        "14. Ventanas Eléctrica <br/>" ,
       icon: "info",
      confirmButtonColor: "#3085d6",
    })
  }
  onModalTransmision() {
    Swal.fire({
      title: "Información",
      html:
        "Punto a revizar: <br/>" +
        "1. Dirección <br/>" +
        "2. Volante <br/>" +
        "3. Caja de cambios <br/>" +
        "4. Palanca de cambios <br/>" +
        "5. Pedal acelerador <br/>" +
        "6. Frenos <br/>" ,
      icon: "info",
      confirmButtonColor: "#3085d6",
    })
  }
  onModalMotor() {
    Swal.fire({
      title: "Información",
      html:
        "Punto a revizar: <br/>" +
        "1. Suspención <br/>" +
        "2. Embrague <br/>" +
        "3. Motor <br/>" +
        "4. Combustible <br/>" +
        "5. Refrigerente de motor <br/>" +
        "6. Radiador <br/>" ,       
      icon: "info",
      confirmButtonColor: "#3085d6",

    })
  }
  ngOnInit(): void {
    this.loadData();
  }
}