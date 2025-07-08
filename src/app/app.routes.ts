import { Routes } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { LoginComponent } from './auth/login/login.component';
import { SingupComponent } from './auth/singnup/signup.component';

export const routes: Routes = [
    { path: '', component: PostListComponent },
    { path: 'createPost', component: PostCreateComponent },
    { path: 'edit/:postId', component: PostCreateComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SingupComponent }
];
