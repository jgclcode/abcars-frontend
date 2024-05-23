import { Component } from "@angular/core";
import { SandboxService } from "src/app/shared/sandbox.service";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";

@Component({
  selector: "app-photo",
  templateUrl: "./photo.component.html",
  styleUrls: ["./photo.component.css"],
})
export class PhotoComponent {
  public baseUrl: string = environment.baseUrl;
  selectedFiles?: FileList;
  selectedFileNames: string[] = [];
  file: any;
  previews: string[] = [];
  images: any;
  data2: any;
  constructor(private api:SandboxService) {
    this.data2 = JSON.parse(localStorage.getItem("data") || "{}");
    this.getImages();   
  }
  selectFiles(event: any): void {
    this.selectedFileNames = [];
    this.selectedFiles = event.target.files;
    this.file = event.target.files;

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
  subirFotos() {
    console.log("subir fotos");
    console.log(this.file);
    console.log(this.selectedFileNames);

    if (this.file && this.file.length > 0) { 
      for(let i=0;i < this.file.length ;i++){
        const data = new FormData();
        data.append("vehicle_id", this.data2.id);
        data.append("pictures[]", this.file[i]);

        this.api.postSetImages(data).subscribe(
          (res: any) => {
            console.log(res);
            this.getImages();
            Swal.fire({
              icon: "success",
              title: "Success",
              text: res.message,
              confirmButtonText: "Aceptar",
            });
            this.previews.splice(0, this.previews.length);
          },
          (err) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: err.message,
            });
          }
        );

      }
      this.previews=[];
      this.selectedFileNames = [];
      this.file = null;

    } else {
      console.log("No se seleccionaron archivos para subir.");
    }
  }
  getImages() {
   
    this.api.GetImagesAll(this.data2.vin).subscribe({
      next: (res: any) => {
        console.log(res);
        this.images = res.images;
      },
      error: (err) => {
      }

    });
  }
}