import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-privacy-of-use',
  templateUrl: './privacy-of-use.component.html'
})

export class PrivacyOfUseComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.scrollTop();
  }

  scrollTop() {
    var scrollElem= document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }
}
