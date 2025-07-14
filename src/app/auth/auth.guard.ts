import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";
import {  Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const isAuthenticated = this.authService.getIsAuth();
        if (!isAuthenticated) {
            this.router.navigate(['/login']);
        }
        return isAuthenticated;
    }
}    