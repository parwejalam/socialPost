import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatCardModule, RouterModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'socialPost';
  year = new Date().getFullYear();
  private themeSubscription?: Subscription;

  constructor(private authService: AuthService, private themeService: ThemeService) { }

  ngOnInit() {
    this.authService.autoAuthUser();

    // Subscribe to theme changes to apply any additional logic if needed
    this.themeSubscription = this.themeService.getTheme().subscribe(theme => {
      // Theme is automatically applied by the service
      console.log('Theme changed to:', theme);
    });
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }
}
