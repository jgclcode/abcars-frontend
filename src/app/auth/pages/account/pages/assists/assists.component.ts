import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assists',
  templateUrl: './assists.component.html',
  styleUrls: ['./assists.components.css']
})

export class AssistsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.scrollTop();
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }

}
