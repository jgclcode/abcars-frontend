import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-extended-warranty',
  templateUrl: './extended-warranty.component.html',
  styles: [`
    .card {     
      border-radius: 30px !important;     
    }
  `]
})

export class ExtendedWarrantyComponent implements OnInit {

  constructor(private titleService: Title) { 
    // Set Title View
    this.titleService.setTitle('Garantía Extendida'); 
  }

  ngOnInit(): void {
    this.scrollTop();
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }

}
