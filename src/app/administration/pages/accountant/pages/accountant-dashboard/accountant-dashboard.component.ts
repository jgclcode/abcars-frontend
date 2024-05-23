import { Component } from '@angular/core';

// Interfaces
import { Overview } from 'src/app/administration/interfaces/overview.interface';

@Component({
  selector: 'app-accountant-dashboard',
  templateUrl: './accountant-dashboard.component.html'
})

export class AccountantDashboardComponent {

  // References Overview
  private user = JSON.parse(localStorage.getItem('user')!); 
  public itemOverview: Overview = {
    user: {
      name: this.user.name,
      surname: this.user.surname,
      role: 'Contadora',
      email: this.user.email,
      picturepath: ''
    },
    pages: [
      {
        title: 'Comprar Vehiculos',
        icon: 'fi fi-rr-id-badge',
        permalink: '/admin/contadora/vehicles'
      }
    ]
  };

}
