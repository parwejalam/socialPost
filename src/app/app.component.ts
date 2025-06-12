import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

interface post {
  title: string;
  content?: string;
  imagePath?: string;
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatCardModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'socialPost';
  year = new Date().getFullYear();
  // posts: post[] = [];
  // onPostCreated(post: post) {
  //   this.posts.push(post);
  //   console.log(this.posts);
  // }
}
