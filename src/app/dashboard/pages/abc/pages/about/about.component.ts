import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styles: [`
    .card {     
      border-radius: 30px !important;     
    }
  `]
})

export class AboutComponent implements OnInit {

  constructor(private titleService: Title) {   
    // Set Title View
    this.titleService.setTitle('Acerca de ABcars.mx'); 
  }

  ngOnInit(): void {
    this.scrollTop();
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }
}
