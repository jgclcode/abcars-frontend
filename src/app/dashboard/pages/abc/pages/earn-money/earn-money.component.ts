import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-earn-money',
  templateUrl: './earn-money.component.html',
  styles: [`
    .card {
      border-radius: 20px !important;
      border: 0px;
    }

    .icon-cashback {
      background-image: url('/assets/icons/cashback.png');
      background-repeat: no-repeat;
      background-position: right;
    }
  `]
})

export class EarnMoneyComponent implements OnInit {

  constructor(private titleService: Title) {   
    // Set Title View
    this.titleService.setTitle('Gana dinero en Efectivo'); 
  }

  ngOnInit(): void {
    this.scrollTop();
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }
  
}
