import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from "./posts/post-list/post-list.component";
import { MatCardModule } from '@angular/material/card';

interface post {
  title: string;
  content?: string;
  imagePath?: string;
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PostCreateComponent, PostListComponent,MatCardModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'socialPost';
  year = new Date().getFullYear();
  posts: post[] = [];
  onPostCreated(post:post){
    this.posts.push(post);
    console.log(this.posts);
  }
}
