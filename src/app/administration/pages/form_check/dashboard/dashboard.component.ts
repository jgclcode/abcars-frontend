import { Component, OnInit } from '@angular/core';
import { Overview } from 'src/app/administration/interfaces/overview.interface';

// Interfaces


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  // References Overview
  private user = JSON.parse(localStorage.getItem('user')!);
  public itemOverview: Overview = {
    user: {
      name: this.user.name,
      surname: this.user.surname,
      role: 'pictures',
      email: this.user.email,
      picturepath: ''
    },
    pages: [
      {
        title: 'Revisar vehículo',
        icon: 'fi fi-rr-car',
        permalink:'/admin/pictures/search_vin'
      },
      {
        title: 'Vehículos con detalles',
        icon: 'fi fi-rr-list-check',
        permalink: '/admin/pictures/reportes'
      },
      {
        title: 'Vehículos con fotografías',
        icon: 'fi fi-rr-picture',
        permalink: '/admin/pictures/reportPhoto'
      },
    ]
  };

  constructor() { }

  ngOnInit(): void { }

}