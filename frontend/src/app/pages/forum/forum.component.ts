import { Component, HostListener, OnInit } from '@angular/core';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../../services/api.service';
import { ChangeableComponent, checkSaveChangesBeforeLeave } from '../../guards/changes-made.guard';
import { UserDataService } from 'src/app/services/user-data.service';

export interface Post {
  _id: any;
  title: string;
  description: string;
  onAccept: string;
  posted: number;
  posted_by: any;
  posted_by_name: string;
  posted_by_pic: string;
  accepted: any[];
  awarded: any;
}

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit, ChangeableComponent {

  constructor(private api: ApiService, public user: UserDataService) { }
  changesMade: boolean = false;

  newPost: boolean = false;

  title: string = "";
  description: string = "";
  onAccept: string = "";

  faPlus = faPlus;
  faTrash = faTrash;

  private _page: number = 0;
  get page() {
    return this._page;
  }

  set page(x: number) {
    if (x !== this._page) {
      this._page = x;
      this.fetchPosts();
    }
  }

  posts: Post[] = [];

  canBeSubmitted(): boolean {
    return !!this.title && !!this.description && !!this.onAccept;
  }

  async fetchPosts() {
    const response: any = await this.api.get("forum/allposts", {page: this.page});
    if (response.err) {
      console.error(response.err);
    } else {
      this.posts = response;
    }
  }

  ngOnInit(): void{
    this.fetchPosts();
  }

  async post(): Promise<void> {
    if (!this.canBeSubmitted) {
      return;
    }
    const response: any = await this.api.post("forum/post", {title: this.title, description: this.description, onAccept: this.onAccept});
    if (response.err) {
      console.error(response.err);
    } else {
      if (this.page === 0) {
        this.posts = [response.post, ...this.posts];
      }
      this.title = "";
      this.description = "";
      this.onAccept = "";
      this.newPost = false;
      this.changesMade = false;
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
      this.posts = this.posts.filter(x => x !== post);
    }
  }

  haveIAccepted(post: Post): boolean {
    return !!this.user.sub && post.accepted && post.accepted.map(x => x.userid).includes(this.user.sub);
  }

  async acceptPost(post: Post) {
    if (this.haveIAccepted(post)) {
      return;
    }
    if (!confirm("Are you sure you want to accept this post?")) {
      return;
    }
    const response: any = await this.api.get("forum/acceptpost", {id: post._id});
    if (response.err) {
      console.error(response.err);
    } else {
      post.accepted.push({userid: this.user.sub ?? ''});
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  onbeforeunload(event: Event) {
    if (this.changesMade && !checkSaveChangesBeforeLeave()) {
      event.preventDefault();
      event.returnValue = false;
    }
  }

}
