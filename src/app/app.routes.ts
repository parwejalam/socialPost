import { Routes } from '@angular/router';
import { Post } from './model/post.model';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';

export const routes: Routes = [
    { path: '', component: PostListComponent },
    { path: 'createPost', component: PostCreateComponent }
];
