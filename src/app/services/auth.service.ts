import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthUser } from '../model/auth-user.model';
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = "http://localhost:3000/api/user";
    private token: string | undefined;

    constructor(private http: HttpClient, private router: Router) { }


    getToken() {
        return this.token;
        console.log("Token from AuthService:", this.token);
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
        this.http.post<{ token: any }>(this.apiUrl + '/login', authData).subscribe({
            next: (response) => {
                console.log("response from backend", response);
                this.token = response.token;
                console.log("Token received:", this.token);
                // this.router.navigate(["/"]);
            },
            error: (err) => {
                console.error("Error during login:", err.error);
                // Handle error here, e.g., show an error message to the user
            }
        })
    }

}
