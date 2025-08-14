import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isuserAuthenticated: boolean = false;
  isMobileMenuOpen: boolean = false;
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

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  getNavIcon(label: string): string {
    const iconMap: { [key: string]: string } = {
      'Add Post': 'add_circle',
      'Login': 'login',
      'SignUp': 'person_add',
      'Posts': 'article',
      'Home': 'home'
    };
    return iconMap[label] || 'circle';
  }

  ngOnDestroy(): void {
    // Cleanup logic if needed 
    if (this.authListenerSub) {
      this.authListenerSub.unsubscribe();
    }
  }

  navLinks = [
    { Label: 'Add Post', routeraLink: '/createPost', showWhenAuthenticated: true },
    { Label: 'Login', routeraLink: '/auth/login', showWhenAuthenticated: false },
    { Label: 'SignUp', routeraLink: '/auth/signup', showWhenAuthenticated: false },
  ]
}
