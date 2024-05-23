import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['profile.component.css']
})

export class ProfileComponent implements OnInit {

  // Information User
  public name: string = '';

  constructor(private titleService: Title) { 
    // Set Title View
    this.titleService.setTitle('ABCars | Mi Cuenta');
  }

  ngOnInit(): void {
    // Get user in session storage
    this.userSessionStorage();
    this.scrollTop();
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }

  /**
   * Get information user in session storage 
   */
  private userSessionStorage() {
    const user = JSON.parse(localStorage.getItem('user')!);  
    this.name = user.name;   
  }

}
