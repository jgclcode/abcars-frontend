import { Component } from '@angular/core';

// Interfaces
import { Overview } from 'src/app/administration/interfaces/overview.interface';

@Component({
  selector: 'app-appraiser-technician-dashboard',
  templateUrl: './appraiser-technician-dashboard.component.html'
})

export class AppraiserTechnicianDashboardComponent {

  private user = JSON.parse(localStorage.getItem('user')!); 
  public itemOverview: Overview = {
    user: {
      name: this.user.name,
      surname: this.user.surname,
      role: 'Técnico Valuador',
      email: this.user.email,
      picturepath: ''
    },
    pages: [
      {
        title: 'Vende tu Auto',
        icon: 'fi fi-rr-id-badge',
        permalink: '/admin/tecval/sell_your_cars'
      }
    ]
  };
  
}
