import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Services
import { BlogService } from '../../services/blog.service';

// Interface
import { Blog } from '../../interfaces/blog/blog.interface';

// Change location app
import localeESMX from "@angular/common/locales/es-MX";
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeESMX);

@Component({
  selector: 'app-page-blog',
  templateUrl: './page-blog.component.html',
  styleUrls: ['./page-blog.component.css'],
  styles: [`
    .card {      
      cursor: pointer;      
    }

    .text-justify {
      text-align: justify;
      text-justify: inter-word;
    }


  `],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-MX' }
  ]
})

export class PageBlogComponent implements OnInit {

  // References
  public post!: Blog; 
  public posts: any[] = []; 
  public recommendedPost: any[] = []; 

  constructor(private _activatedRoute: ActivatedRoute, private _blogService: BlogService) { }
  
  ngOnInit(): void {
    this._activatedRoute.params
    .subscribe({
      next: (param) => {
      this.getPost(param.id);
      this.scrollTop();
      }
    });

    // Get Posts
    this.getPosts();
  }
  
  public scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }

  /**
   * Get Post
   */
  public getPost(id: number) {
    this._blogService.findPost(id)
    .subscribe({
      next: (blog: Blog) => {
        this.post = blog;

        // Get picture of postMain
        this._blogService.backgroundPost(blog.featured_media)
        .subscribe({
          next: (response) => this.post.pictureMedia = response.guid.rendered
        });
      }
    });
  }

  /**
   * Get Posts
   */
  private getPosts() {
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