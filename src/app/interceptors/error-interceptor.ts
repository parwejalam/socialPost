import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from '../error/error.component';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {

    const dialog = inject(MatDialog);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An Unknown Error Occured!'
            if (error.error.message || error.error.error) {
                errorMessage = error.error.message? error.error.message : error.error.error
            }
            dialog.open(ErrorComponent, { data: { message: errorMessage } })
            return throwError(() => error)
        })
    );
};