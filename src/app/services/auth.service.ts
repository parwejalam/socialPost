import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthUser } from '../model/auth-user.model';
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class AuthService {
    apiUrl = "http://localhost:3000/api/user/signup";

    constructor(private http: HttpClient, private router: Router) { }

    createUser(authData: AuthUser) {
        // const authData = { email: email, password: password }
        this.http.post(this.apiUrl, authData).subscribe(response => {
            console.log("response form backend" + response);
            this.router.navigate(["/"]);
        });
    }
}