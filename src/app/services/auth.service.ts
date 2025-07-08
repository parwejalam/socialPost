import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthUser } from '../model/auth-user.model';
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class AuthService {
    apiUrl = "http://localhost:3000/api/user";

    constructor(private http: HttpClient, private router: Router) { }


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
        this.http.post(this.apiUrl + '/login', authData).subscribe({
            next: (response) => {
                console.log("response from backend", response);
                // this.router.navigate(["/"]);
            },
            error: (err) => {
                console.error("Error during login:", err.error);
                // Handle error here, e.g., show an error message to the user
            }
        })
    }

}
