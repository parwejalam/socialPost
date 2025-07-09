import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const authToken = authService.getToken(); // Get token from the injected service
    const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
    return next(authReq);
};