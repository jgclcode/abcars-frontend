import { Component, OnInit } from '@angular/core';

// Interfaces
import { Overview } from 'src/app/administration/interfaces/overview.interface';

@Component({
  selector: 'app-aftersales-dashboard',
  templateUrl: './aftersales-dashboard.component.html'
})

export class AftersalesDashboardComponent implements OnInit {

  // References Overview
  private user = JSON.parse(localStorage.getItem('user')!); 
  public itemOverview: Overview = {
    user: {
      name: this.user.name,
      surname: this.user.surname,
      role: 'Aftersales',
      email: this.user.email,
      picturepath: ''
    },
    pages: [
      {
        title: 'Citas de Servicio',
        icon: 'fi fi-rr-address-book',
        permalink: '/admin/aftersales/citas-servicio'
      },
      {
        title: 'Incidencias Servicios',
        icon: 'fi fi-rr-comment-info',
        permalink: '/admin/aftersales/incidencias/servicios'
      },
      {
        title: 'Incidencias Vehiculos',
        icon: 'fi fi-rr-comment-info',
        permalink: '/admin/aftersales/incidencias/vehiculos'
      }
    ]
  };

  constructor() { }

  ngOnInit(): void { }

}