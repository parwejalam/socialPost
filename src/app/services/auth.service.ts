import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthUser } from '../model/auth-user.model';
import { Router } from "@angular/router";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = "http://localhost:3000/api/user";
    private token: string | undefined;
    private tokenTimer: any;
    private isAuthenticated = false;
    private authStatusLitener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) { }

    getToken() {
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getAuthStatusListener() {
        return this.authStatusLitener.asObservable();
    }
    // Method to create a new user
    createUser(authData: AuthUser) {
        // const authData = { email: email, password: password }
        this.http.post(this.apiUrl + '/signup', authData).subscribe({
            next: (response) => {
                console.log("response from backend", response);
                this.router.navigate(["/"]);
            },
            error: (err) => {
                console.error("Error during signup:", err.error);
                // Handle error here, e.g., show an error message to the user
            }
        });
    }


    // Method to login a user
    login(authData: AuthUser) {
        this.http.post<{ token: any, expiresIn: number }>(this.apiUrl + '/login', authData).subscribe({
            next: (response) => {
                // console.log("response from backend", response);
                this.token = response.token;
                if (this.token) {
                    const expiresInDuration = response.expiresIn;
                    this.setAuthTimer(expiresInDuration);
                    // console.log("Token expires in:", expiresInDuration);
                    this.isAuthenticated = true;
                    this.authStatusLitener.next(true);
                    this.saveAuthData(this.token, new Date(new Date().getTime() + expiresInDuration * 1000));
                }
                console.log("Token received:", this.token);
                this.router.navigate(["/"]);
            },
            error: (err) => {
                console.error("Error during login:", err.error);
                // Handle error here, e.g., show an error message to the user
            }
        })
    }

    autoAuthUser() {
        const authInformation = this.getAuthData();
        if (!authInformation) {
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.authStatusLitener.next(true);
            this.setAuthTimer(expiresIn / 1000); // Convert milliseconds to seconds
        }
    }

    logOut() {
        this.token = undefined;
        this.isAuthenticated = false;
        this.authStatusLitener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(["/"]);
    }

    setAuthTimer(duration: number) {
        console.log("Setting timer for: " + duration + " seconds");
        this.tokenTimer = setTimeout(() => {
            this.logOut();
        }, duration * 1000); // Convert seconds to milliseconds
    }

    private saveAuthData(token: string, expirationDate: Date) {
        localStorage.setItem("token", token);
        localStorage.setItem("expiration", expirationDate.toISOString());
    }

    private clearAuthData() {
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
    }

    getAuthData() {
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expiration");
        if (!token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate)
        };
    }
}
