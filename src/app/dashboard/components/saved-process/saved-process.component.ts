import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-saved-process',
  templateUrl: './saved-process.component.html'
})

export class SavedProcessComponent implements OnInit {

  constructor(private _router: Router) { }

  ngOnInit(): void {
    this.scrollTop();

    setTimeout(() => {
      this._router.navigate(['']);
    }, 2000);
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }

}
