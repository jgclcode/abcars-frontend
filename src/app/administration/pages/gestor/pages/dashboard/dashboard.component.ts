import { Component, OnInit } from '@angular/core';
import { Overview } from '../../../../interfaces/overview.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {
  // References Overview
  private user = JSON.parse(localStorage.getItem('user')!);
  public itemOverview: Overview = {
    user: {
      name: this.user.name,
      surname: this.user.surname,
      role: 'Gestor de inventario',
      email: this.user.email,
      picturepath: ''
    },
    pages: [
      {
        title: 'Garantias',
        icon: 'fi fi-rr-id-badge',
        permalink: '/admin/gestor/shields'
      },
      {
        title: 'Gestionar vehiculos',
        icon: 'fi fi-rr-id-badge',
        permalink: '/admin/gestor/promotions'
      },
      // {
      //   title: 'Polizas de garantia',
      //   icon: 'fi fi-rr-book-alt',
      //   permalink: '/admin/gestor/insurance-policies/1008'
      // }
      {
        title: 'Citas valuación',
        icon: 'fi fi-rr-book-alt',
        permalink: '/admin/gestor/valuation-quotes'
      }
    ]
  };
  constructor() { }

  ngOnInit(): void {
  }

}
