import { Component } from "@angular/core";
import { LoaderComponent } from "../../loader/loader.component";
import { MaterialModule } from "../../module/material/material.module";
import { NgForm } from "@angular/forms";
import { AuthService } from "../../services/auth.service";

@Component({
    standalone: true,
    imports: [LoaderComponent,MaterialModule],
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})

export class LoginComponent {
    constructor(private authUser: AuthService) { }
    isLoading = false;


    onLogin(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.isLoading = true;
        // console.log(form.value);
        this.authUser.login(form.value);
        setTimeout(() => {
            this.isLoading = false;
            form.reset();
        }, 2000);
    }
}