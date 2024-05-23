import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Components
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-check-role',
  template: ``,
})

export class CheckRoleComponent {

  constructor(private _appComponent: AppComponent, private _router: Router) { 
    // Set url for dashboard    
    this._router.navigate([this._appComponent.get_url_dashboard()]);        
  }

}
