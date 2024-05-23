import { Component, LOCALE_ID } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Title } from '@angular/platform-browser';

// Services
import { BlogService } from '../../services/blog.service';

// Interfaces
import { Blog, FeaturedMedia } from '../../interfaces/blog/blog.interface';

// Change location app
import localeESMX from "@angular/common/locales/es-MX";
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeESMX);

@Component({
  selector: 'app-abc-blog',
  templateUrl: './abc-blog.component.html',
  styleUrls: ['./abc-blog.component.css'],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-MX' }
  ]
})

export class AbcBlogComponent {

  // References  
  public postMain!: Blog;
  public dataPosts: any[] = [];
  public posts: any[] = []; 
  public recommendedPost: any[] = []; 
  detail: any;

  constructor(private _blogService: BlogService, private titleService: Title) { 
    // Set Title View
    this.titleService.setTitle('El ABC de los Autos'); 
    
    // Get Posts
    this.getPosts();
    this.getPosts_pri()
  }
  
  /**
   * Get Posts
   */
  private getPosts() {
    this._blogService.getPosts().subscribe(
      (blog: Blog) => {
        // Set posts index
        console.log(blog);
        this.dataPosts.push(blog); 
        this.dataPosts = this.dataPosts[0];
        this.recommendedPost.push(blog);
        this.recommendedPost = this.recommendedPost[0];

        // Set post index 0
        this.postMain = this.dataPosts[0];

        // Filter elements if first element her position is 0
        this.dataPosts = this.dataPosts.filter((post, idx) => idx != 0);

        // Get picture of the posts
        this.dataPosts.forEach((post, idx) => {
          this.backgroundPost(post.featured_media)
          .subscribe({
            next: (response) => (this.dataPosts[idx] != undefined) ? this.dataPosts[idx].pictureMedia = response : 'uan'
          });                  
        });


        // Get picture of postMain
        this.backgroundPost(this.postMain.featured_media)
        .subscribe({
          next: (response) => this.postMain.pictureMedia = response
        });
      }
    );
  }

  /**
   * Get background of post
   * @param featured_media Number
   */
  public backgroundPost(featured_media: number): Observable<string> {
    const subject = new Subject<string>();
    this._blogService.backgroundPost(featured_media)
    .subscribe({
      next: (response: FeaturedMedia) => {
        if (response.guid.rendered) {
          subject.next(response.guid.rendered);
        } else {
          subject.next('assets/images/abcars-images/abcautos-default.jpg');
        }
      }, 
      error: (error) => {
        subject.next('assets/images/abcars-images/abcautos-default.jpg');
      }
    });

    return subject.asObservable();
  }

  private getPosts_pri() {
    this._blogService.getPosts().subscribe({
      next: (blog: Blog) => {
        // Set posts index
        this.recommendedPost.push(blog);
        this.recommendedPost = this.recommendedPost[0];

        // Array Numbers
        let numbers: number[] = [];

        // Repeat while length of array is smaller than four
        while (numbers.length < 4) {
          const number = Math.round(Math.random() * 9);

          // If don't include the number push into array
          if (!numbers.includes(number)) {
            numbers.push(number);
          }
        }

        // Get picture of the posts
        this.recommendedPost.forEach((post, idx) => {
          this._blogService.backgroundPost(post.featured_media).subscribe({
            next: (response) => this.recommendedPost[idx].pictureMedia = response.guid.rendered
          });
        });

        // Show five differences posts in view
        numbers.forEach(position => {
          this.posts.push(this.recommendedPost[position]);
        });
      }
    });
  }

}