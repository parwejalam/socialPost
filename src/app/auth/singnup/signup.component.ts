import { Component } from "@angular/core";
import { LoaderComponent } from "../../loader/loader.component";
import { MaterialModule } from "../../module/material/material.module";
import { NgForm } from "@angular/forms";
import { AuthService } from '../../services/auth.service';

@Component({
    standalone: true,
    imports: [LoaderComponent, MaterialModule],
    templateUrl: "./signup.component.html",
    styleUrls: ["./signup.component.scss"],
})

export class SingupComponent {
    constructor(public authService: AuthService) { }
    isLoading = false;


    onSignup(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.isLoading = true;
        // Simulate a login request
        this.authService.createUser(form.value);
        setTimeout(() => {
            this.isLoading = false;
            form.reset();
        }, 2000);
    }
}