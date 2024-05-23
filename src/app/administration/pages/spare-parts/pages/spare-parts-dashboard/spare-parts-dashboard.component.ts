import { Component } from '@angular/core';

// Interfaces
import { Overview } from 'src/app/administration/interfaces/overview.interface';

@Component({
  selector: 'app-spare-parts-dashboard',
  templateUrl: './spare-parts-dashboard.component.html'
})

export class SparePartsDashboardComponent {

  private user = JSON.parse(localStorage.getItem('user')!); 
  public itemOverview: Overview = {
    user: {
      name: this.user.name,
      surname: this.user.surname,
      role: 'Refacciones',
      email: this.user.email,
      picturepath: ''
    },
    pages: [
      {
        title: 'Refacciones Vehículos',
        icon: 'fi fi-rr-id-badge',
        permalink: '/admin/parts/vehicles'
      }
    ]
  };

}
