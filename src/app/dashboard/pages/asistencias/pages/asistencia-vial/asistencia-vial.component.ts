import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-asistencia-vial',
  templateUrl: './asistencia-vial.component.html',
  styles: [`
    .card {
      border: 0px;
    }

    .zoom-element {
      transition: transform 0.2s ease;
    }

    .zoom-element:hover {
      transform: scale(1.02);
    }
  `]
})

export class AsistenciaVialComponent implements OnInit {
  
  constructor(private titleService: Title) {
    // Set Title View
    this.titleService.setTitle('Asistencia Vial'); 
  }

  ngOnInit(): void {
    this.scrollTop();
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }

}
