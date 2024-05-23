import { Component, OnInit } from '@angular/core';

// Interfaces
import { Overview } from 'src/app/administration/interfaces/overview.interface';

@Component({
  selector: 'app-appraiser-dashboard',
  templateUrl: './appraiser-dashboard.component.html'
})

export class AppraiserDashboardComponent implements OnInit {

  // References Overview
  private user = JSON.parse(localStorage.getItem('user')!); 
  public itemOverview: Overview = {
    user: {
      name: this.user.name,
      surname: this.user.surname,
      role: 'Técnico',
      email: this.user.email,
      picturepath: ''
    },
    pages: [
      {
        title: 'Valuaciones',
        icon: 'fi fi-rr-settings-sliders',
        permalink: '/admin/appraiser/valuaciones'
      },
    ]
  };

  constructor() { }

  ngOnInit(): void { }

}
