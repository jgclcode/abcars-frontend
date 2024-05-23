import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-financing',
  templateUrl: './financing.component.html',
  styleUrls: ['./financing.component.css']
})

export class FinancingComponent implements OnInit {

  constructor(private titleService: Title, private metaService: Meta) { 
    // Set Title View
    this.titleService.setTitle('Precalificar para financiamiento');
    this.metaService.updateTag({ name: 'description', content: 'Financiamiento de seminuevos, solicitalo ¡Ahora!' });
  }

  ngOnInit(): void {
    this.scrollTop();
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }
  
  deleteLS(){
    localStorage.removeItem('vehicle');
  }
}
