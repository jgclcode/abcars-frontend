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
      role: 'Vendedor',
      email: this.user.email,
      picturepath: ''
    },
    pages: [
      {
        title: 'Estadísticas',
        icon: 'fi fi-rr-id-badge',
        permalink: '/admin/seller/statistics'
      },
      {
        title: 'Vehículos',
        icon: 'fi fi-rr-id-badge',
        permalink: '/admin/seller/vehicle-list'
      }
    ]
  };
  constructor() { }

  ngOnInit(): void {
  }

}
