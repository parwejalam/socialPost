import { Routes } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { LoginComponent } from './auth/login/login.component';
import { SingupComponent } from './auth/singnup/signup.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
    { path: '', component: PostListComponent },
    { path: 'createPost', component: PostCreateComponent, canActivate: [AuthGuard] },
    { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
    { path: 'auth', loadChildren: () =>import( './module/auth-module/auth.module').then(m => m.AuthModule)}
];
