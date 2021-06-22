import { Component, OnInit } from '@angular/core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from 'src/app/services/api.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { Post } from '../forum/forum.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  constructor(private api: ApiService, private user: UserDataService) { }

  myPosts: Post[] = [];
  myOffered: Post[] = [];

  faTrash = faTrash;

  async ngOnInit(): Promise<void> {
    {
      const response: any = await this.api.get("forum/myposts", {});
      if (response.err) {
        console.error(response.err);
      } else {
        this.myPosts = response;
      }
    }
    {
      const response: any = await this.api.get("forum/myoffered", {});
      if (response.err) {
        console.error(response.err);
      } else {
        this.myOffered = response;
      }
    }
  }

  async deletePost(post: Post) {
    if (!confirm("Are you sure you want to delete this post? Nobody will be able to see this task anymore.")) {
      return;
    }
    const response: any = await this.api.get("forum/deletepost", {id: post._id});
    if (response.err) {
      console.error(response.err);
    } else {
      this.myPosts = this.myPosts.filter(x => x !== post);
    }
  }

  async accept(post: Post, offer: any) {
    if (!confirm("Are you sure you want to accept this person's help. They will be able to see the more detailed description of your post.")) {
      return;
    }

    const response: any = await this.api.get("forum/award", {id: post._id, offer_id: offer.userid, offer_name: offer.name, offer_pic: offer.pic});
    if (response.err) {
      console.error(response.err);
    } else {
      post.awarded = offer;
    }

  }


}
