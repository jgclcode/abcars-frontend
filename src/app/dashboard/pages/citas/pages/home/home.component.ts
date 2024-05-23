import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [`
    .card {     
      border-radius: 30px !important;     
    }
  `]
})

export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
