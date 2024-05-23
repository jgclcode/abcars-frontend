import { Component, OnInit } from '@angular/core';

// Interfaces
import { Overview } from 'src/app/administration/interfaces/overview.interface';

@Component({
  selector: 'app-marketing-dashboard',
  templateUrl: './marketing-dashboard.component.html'
})

export class MarketingDashboardComponent implements OnInit {

  // References Overview
  private user = JSON.parse(localStorage.getItem('user')!);
  public itemOverview: Overview = {
    user: {
      name: this.user.name,
      surname: this.user.surname,
      role: 'Marketing',
      email: this.user.email,
      picturepath: ''
    },
    pages: [
      {
        title: 'Vehículos',
        icon: 'fi fi-rr-car',
        permalink: '/admin/marketing/vehiculos'
      },
    ]
  };

  constructor() { }

  ngOnInit(): void { }

}