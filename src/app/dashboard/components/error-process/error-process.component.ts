import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-process',
  templateUrl: './error-process.component.html'
})

export class ErrorProcessComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.scrollTop();
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }

}
