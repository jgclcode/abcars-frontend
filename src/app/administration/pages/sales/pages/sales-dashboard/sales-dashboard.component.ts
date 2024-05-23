import { Component, OnInit } from '@angular/core';

// Interfaces
import { Overview } from 'src/app/administration/interfaces/overview.interface';

@Component({
  selector: 'app-sales-dashboard',
  templateUrl: './sales-dashboard.component.html'
})

export class SalesDashboardComponent implements OnInit {

  // References Overview
  private user = JSON.parse(localStorage.getItem('user')!); 
  public itemOverview: Overview = {
    user: {
      name: this.user.name,
      surname: this.user.surname,
      role: 'Sales',
      email: this.user.email,
      picturepath: ''
    },
    pages: [
      {
        title: 'Buscame un auto',
        icon: 'fi fi-rr-search',
        permalink: '/admin/sales/buscame-un-auto'
      },
      {
        title: 'Reservados',
        icon: 'fi fi-rr-label',
        permalink: '/admin/sales/reservados'
      },
      {
        title: 'Financiamientos',
        icon: 'fi fi-rr-bank',
        permalink: '/admin/sales/financiamiento'
      }
    ]
  };

  constructor() { }

  ngOnInit(): void { }

}
