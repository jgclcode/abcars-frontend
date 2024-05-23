import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Interfaces
import { Blog, FeaturedMedia } from '../interfaces/blog/blog.interface';

@Injectable({
  providedIn: 'root'
})

export class BlogService {

  // References
  private _api: string = 'https://abcars.mx/blog/wp-json/wp/v2';  

  constructor(private _http: HttpClient) { }

  /**
   * Get Posts
   */
  public getPosts(): Observable<Blog> {
    return this._http.get<Blog>(`${ this._api }/posts?order=desc`);
  }
  
  /**
   * Find Post
   */
  public findPost(post_id: number): Observable<Blog> {
    return this._http.get<Blog>(`${ this._api }/posts/${ post_id }`);
  }

  /**
   * Get Background Post
   */
  public backgroundPost(featured_media: number): Observable<FeaturedMedia> {
    return this._http.get<FeaturedMedia>(`https://abcars.mx/blog/wp-json/wp/v2/media/${ featured_media }`);
  }
  
}
