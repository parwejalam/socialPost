import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  navLinks = [
    { routeraLink: '/', Label: 'Home' },
    { routeraLink: '/createPost', Label: 'Add Post' },
    { routeraLink: '/login', Label: 'Login' },
    { routeraLink: '/signup', Label: 'SignUp' }
  ]
}
