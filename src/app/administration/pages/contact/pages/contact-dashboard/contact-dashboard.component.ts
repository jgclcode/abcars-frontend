import { Component } from '@angular/core';

// Interfaces
import { Overview } from 'src/app/administration/interfaces/overview.interface';

@Component({
  selector: 'app-contact-dashboard',
  templateUrl: './contact-dashboard.component.html'
})

export class ContactDashboardComponent {

  // References Overview
  private user = JSON.parse(localStorage.getItem('user')!); 
  public itemOverview: Overview = {
    user: {
      name: this.user.name,
      surname: this.user.surname,
      role: 'Contact',
      email: this.user.email,
      picturepath: ''
    },
    pages: [
      {
        title: 'Vender tu Auto',
        icon: 'fi fi-rr-id-badge',
        permalink: '/admin/contact/vender-tu-auto'
      },
    ]
  };

}
