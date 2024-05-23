import { Component, Input, OnInit } from '@angular/core';
import { UserSettings } from 'src/app/auth/pages/account/interfaces/settings.interface';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';

// Services
import { AccountService } from 'src/app/auth/pages/account/services/account.service';

// Interfaces
import { Overview } from '../../interfaces/overview.interface';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})

export class OverviewComponent implements OnInit {

  // Input get information overview
  @Input() overview?: Overview;

  // References
  private url: string = environment.baseUrl;
  public pathname: string = '';

  constructor(private _accountService: AccountService, private titleService: Title) {}

  ngOnInit(): void {
    if (this.overview?.user.role) {
      // Set Title View
      this.titleService.setTitle(`ABCars | ${ (this.overview?.user.role) ? this.overview?.user.role : '' }`);
    }

    this.getPicture();
    this.scrollTop();
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();
  }

  /**
   * Get picture user
   */
  private getPicture() {
    // Get information user in session storage
    const user = JSON.parse(localStorage.getItem('user')!);

    // Launch request
    this._accountService.getUser(user.id)
    .subscribe({
      next: ({ code, user }: UserSettings) => {
        if (code === 200) {
          this.pathname = (user.picture == null) ? `./assets/icons/profile.svg` : `${ this.url }/api/user/image/${ user.picture }`;
        } else {
          this.pathname = '/assets/icons/profile.svg';
        }
      },
      error: (error) => {
        this.pathname = '/assets/icons/profile.svg';
      }
    });
  }

}