import { Component } from '@angular/core';

// Interfaces
import { Overview } from 'src/app/administration/interfaces/overview.interface';

@Component({
  selector: 'app-developer-dashboard',
  templateUrl: './developer-dashboard.component.html'
})

export class DeveloperDashboardComponent {

  // References Overview
  private user = JSON.parse(localStorage.getItem('user')!); 
  public itemOverview: Overview = {
    user: {
      name: this.user.name,
      surname: this.user.surname,
      role: 'Developer',
      email: this.user.email,
      picturepath: ''
    },
    pages: [
      {
        title: 'Usuarios',
        icon: 'fi fi-rr-id-badge',
        permalink: '/admin/developer/users'
      },
      {
        title: 'Clientes',
        icon: 'fi fi-rr-address-book',
        permalink: '/admin/developer/clients'
      },
      {
        title: 'Roles',
        icon: 'fi fi-rr-shield-check',
        permalink: '/admin/developer/roles'
      },
      {
        title: 'Marcas',
        icon: 'fi fi-rr-car',
        permalink: '/admin/developer/brands'
      },
      {
        title: 'Modelos',
        icon: 'fi fi-rr-chart-tree',
        permalink: '/admin/developer/models'
      },
      {
        title: 'Sucursales',
        icon: 'fi fi-rr-map-marker',
        permalink: '/admin/developer/branches'
      },
      {
        title: 'Rewards',
        icon: 'fi fi-rr-trophy',
        permalink: '/admin/developer/rewards'
      }
    ]
  };

}