import { Component, Input, OnInit } from '@angular/core';

// Interfaces
import { Blog } from '../../interfaces/blog/blog.interface';

@Component({
  selector: 'post-blog',
  templateUrl: './post-blog.component.html',
  styleUrls: ['../../pages/abc-blog/abc-blog.component.css']
})

export class PostBlogComponent implements OnInit {
  
  // Input data post
  @Input('post') post?: Blog;

  constructor() { }
  
  ngOnInit(): void {    
    this.scrollTop();
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();  
  }

}
