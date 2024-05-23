import { AfterViewInit, Component, DoCheck, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements DoCheck{

  // Flag change <li> in navbar
  public auth_user: boolean = false;
  public url_dashboard: string = '/auth/mi-cuenta';

  // Elements navbar and footer
  // @ViewChild('navbarPrimary') navbarPrimary!: ElementRef<HTMLElement>;
  @ViewChild('navbarSecondary') navbarSecondary!: ElementRef<HTMLElement>;
  @ViewChild('footer') footer!: ElementRef<HTMLElement>;

  constructor(private _router: Router) { }
 
  // Checking session storage for get token user
  ngDoCheck(): void {
    this.checkSessionStorageUser();
    this.url_dashboard = this.get_url_dashboard();
  }

  // Change display in navbar and footer when url is /externals/compra-tu-auto


  /**
   * Check Session Storage for get User and Token information
   */
  public checkSessionStorageUser() {
    // Get token user in session storage
    this.auth_user = (localStorage.getItem('user_token') && localStorage.getItem('user')) ? true : false;    
  }

  /**
   * Logout
   */
  public logout() {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user');
    this._router.navigate(['/auth/iniciar-sesion']);    
  }

  public get_url_dashboard() {
    let user: any = localStorage.getItem('user');
    user = user != null && user != undefined ? JSON.parse( user ) : null;
    let url = '';

    if (user != null && user != undefined) {
      switch (user.role) {
        case 'client':
          url = '/auth/mi-cuenta';     
        break;

        case 'marketing':
          url = '/admin/marketing';     
        break;

        case 'developer':
          url = '/admin/developer';     
        break;

        case 'appraiser':
          url = '/admin/appraiser';     
        break;

        case 'valuator':
          url = '/admin/valuator';     
        break;

        case 'sales':
          url = '/admin/sales';     
        break;

        case 'aftersales':
          url = '/admin/aftersales';     
        break;

        case 'gestor':
          url = '/admin/gestor';     
        break;

        case 'appraiser_technician':
          url = '/admin/tecval';     
        break;

        case 'spare_parts':
          url = '/admin/parts';     
        break;

        case 'spare_parts_manager':
          url = '/admin/pmanager';
        break;

        case 'contact':
          url = '/admin/contact';     
        break;

        case 'accountant':
          url = '/admin/contadora';
        break;

        case 'seller':
          url = 'admin/seller'
        break;
        
        case 'pictures':
          url = '/admin/pictures';
        break;

        default:
          url = '/admin/not-authorized';     
        break;
      }
    }

    return url;
  }

  deleteLS(){
    localStorage.removeItem('vehicle');
  }

  public notshow(): boolean {
    if(JSON.parse(localStorage.getItem('home')!) != null){
      return true;
    }else{
      return false;
    }  
  }
  
}