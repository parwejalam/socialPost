import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isuserAuthenticated: boolean = false;
  private authListenerSub?: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.isuserAuthenticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.isuserAuthenticated = isAuthenticated;
    });
  }



  onLogout() {
    this.authService.logOut();
    console.log('User logged out');
  }

  ngOnDestroy(): void {
    // Cleanup logic if needed 
    if (this.authListenerSub) {
      this.authListenerSub.unsubscribe();
    }
  }

  navLinks = [
    { Label: 'Add Post', routeraLink: '/createPost', showWhenAuthenticated: true },
    { Label: 'Login', routeraLink: '/login', showWhenAuthenticated: false },
    { Label: 'SignUp', routeraLink: '/signup', showWhenAuthenticated: false },
  ]
}
