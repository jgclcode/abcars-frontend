import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styles: [`
    .card  {     
      border-radius: 30px !important;   
      border: none;  
    }

    .btn-action {
      background: #F5C451;
    }
  `]
})

export class ContactComponent implements OnInit {

  constructor(private titleService: Title) {   
    // Set Title View
    this.titleService.setTitle('Contáctanos'); 
  }

  ngOnInit(): void {
    this.scrollTop();
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }
}
