import { Component, OnInit } from '@angular/core';
import { RedditApiService } from '../../services/reddit-api.service';
import { Router } from '@angular/router';
import { BrowserModule, Title }  from '@angular/platform-browser';
import {MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-post-reddit',
  templateUrl: './post-reddit.component.html',
  styleUrls: ['./post-reddit.component.css']
})
export class PostRedditComponent implements OnInit {

  posts: any;

  constructor(private api: RedditApiService, private router: Router, private titleService: Title) { }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  ngOnInit() {
    this.api.getPostsPH()
      .subscribe(res => {
        this.posts = res;
      }, err => {
        console.log(err);
        if(err.status=401){
          this.router.navigate(['login']);
        }
      });

      this.setTitle("Popular Posts");
  }
}