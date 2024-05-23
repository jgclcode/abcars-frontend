import { Component, OnInit } from '@angular/core';

// Interfaces
import { Overview } from 'src/app/administration/interfaces/overview.interface';

@Component({
  selector: 'app-spare-parts-manager-dashboard',
  templateUrl: './spare-parts-manager-dashboard.component.html'
})

export class SparePartsManagerDashboardComponent {
  private user = JSON.parse(localStorage.getItem('user')!);
  public itemOverview: Overview = {
    user: {
      name: this.user.name,
      surname: this.user.surname,
      role: 'Manager HYP y Refacciones',
      email: this.user.email,
      picturepath: ''
    },
    pages: [
      {
        title: 'Autorizar HYP y Refacciones',
        icon: 'fi fi-rr-id-badge',
        permalink: '/admin/pmanager/vehicles'
      },
      {
        title: 'Imprimir Valuaciones',
        icon: 'fi fi-rr-id-badge',
        permalink: '/admin/pmanager/print-valuation'
      },
      {
        title: 'Precio Oferta de Clientes',
        icon: 'fi fi-rr-id-badge',
        permalink: '/admin/pmanager/client-price-offer'
        // permalink: '*'
      }
    ]
  };
}