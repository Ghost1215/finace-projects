import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, } from '../services/user.service';
import { FollowService, } from '../services/follow.service';

import { RedditApiService } from '../services/reddit-api.service';
import { CommentsService } from '../services/comments.service';
import { BrowserModule, Title } from '@angular/platform-browser';
import { Profile } from 'selenium-webdriver/firefox';
import { Alert } from 'selenium-webdriver';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile: any; // The current profile to be loaded to view.

  currentUser: any; // The current logged in user.
  isFollowing: boolean = false; // Boolean to hold

  postsUser: any;
  commentsUser: any;
  follow_id;

  // isUser determines if the user is on their own account.
  isUser: boolean;

  constructor(private route: ActivatedRoute, private followService: FollowService, private router: Router, private userAPI: UserService, private postAPI: RedditApiService, private commentAPI: CommentsService, private titleService: Title) { }

  // Function to set the page title
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  // Runs on page call
  ngOnInit() {
    // Get profile data using page ID
    this.getProfileData(this.route.snapshot.params['id']);

    // Set title using page ID
    this.setTitle("TB: " + this.route.snapshot.params['id'] + "'s Profile");

    // Get profile data using page ID
    this.postAPI.getRecentPostsUser(this.route.snapshot.params['id'])
      .subscribe(res => {
        this.postsUser = res;
      }, err => {
        console.log(err);
        if (err.status = 401) {
          this.router.navigate(['login']);
        }
      });

    // Get comments the user made using page ID
    this.commentAPI.getCommentProfileId(this.route.snapshot.params['id'])
      .subscribe(res => {
        this.commentsUser = res;
      }, err => {
        console.log(err);
        if (err.status = 401) {
          this.router.navigate(['login']);
        }
      });

    // Check if user is loggged in
    if (this.userAPI.isLoggedIn()) {
      // Get current user.
      this.currentUser = this.userAPI.getUserPayLoad();
      // Get following data
      this.getFollowList();
    }
  }

  // Loads the profile data for the current user we want to display the profile of.
  getProfileData(id) {
    this.userAPI.getProfile(id)
      .subscribe(data => {
        this.profile = data[0];
        // Check if this is the logged in users profile
        this.isUser = (this.currentUser.id === this.profile._id);
      });
  }

  // Get the list of following
  getFollowList() {
    this.followService.getIsFollowing(this.currentUser.username)
      .subscribe((res) => {
        // If server returned 'true' state.
        if (res.state) {
          let userIsFollowing = [];
          for (let username of res.followlist) {
            userIsFollowing.push(username);

            if (username == this.profile.username) {
              this.isFollowing = true;
            }
          }
        } else {
          console.log('[INFO]: Something is wrong');
        }
      })
  }

  /**
   * Allows a user to be followed. Adds the user in the follows db table to the logged in users 'following' array.
   * Also adds the user to the following users 'followers' array. 
   */
  follow(_id) {
    var user = this.userAPI.getUserPayLoad();
    const user_id = user.id;

    // followUser is an object to be sent to the server containing a user_id and follow_id field.
    var followUser = {
      user_id: user_id,
      follow_id: _id
    };

    // Follow this user
    this.followService.followUser(followUser)
      .subscribe(res => {
        // Set isFollowing to true;
        this.isFollowing = true;
      }, (err) => {
        console.log(err);
      }
      );
  }

  /**
    * Allows a user to be unfollowed. Removes the user in the follows db table from the logged in users 'following' array.
    * Also removes the user from the following users 'followers' array. 
    */
  unFollow(_id) {
    var user = this.userAPI.getUserPayLoad();
    const user_id = user.id;

    // Folow user object
    var followUser = {
      user_id: user_id,
      follow_id: _id
    };
    // Send API data to unfollow a user
    this.followService.unFollowUser(followUser)
      .subscribe(res => {
        // Set isFollowing to false;
        this.isFollowing = false;
      }, (err) => {
        console.log(err);
      }
      );
  }
}