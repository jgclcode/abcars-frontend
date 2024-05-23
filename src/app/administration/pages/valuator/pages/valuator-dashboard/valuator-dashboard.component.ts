import { Component, OnInit } from '@angular/core';

// Interfaces
import { Overview } from 'src/app/administration/interfaces/overview.interface';

@Component({
  selector: 'app-valuator-dashboard',
  templateUrl: './valuator-dashboard.component.html'
})

export class ValuatorDashboardComponent implements OnInit {

  // References Overview
  private user = JSON.parse(localStorage.getItem('user')!); 
  public itemOverview: Overview = {
    user: {
      name: this.user.name,
      surname: this.user.surname,
      role: 'Propietario',
      email: this.user.email,
      picturepath: ''
    },
    pages: [
      {
        title: 'Vende tu Auto',
        icon: 'fi fi-rr-car',
        permalink: '/admin/valuator/vende-tu-auto'
      }
    ]
  };

  constructor() { }

  ngOnInit(): void { }

}