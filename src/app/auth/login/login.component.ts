import { Component, OnDestroy, OnInit } from "@angular/core";
import { LoaderComponent } from "../../loader/loader.component";
import { MaterialModule } from "../../module/material/material.module";
import { NgForm } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Subscription } from "rxjs";

@Component({
    standalone: true,
    imports: [LoaderComponent, MaterialModule],
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})

export class LoginComponent implements OnInit, OnDestroy {
    isLoading = false;
    private authStatusSub!: Subscription;


    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
            authStatus => {
                this.isLoading = false
            }
        );
    }



    onLogin(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.isLoading = true;
        // console.log(form.value);
        this.authService.login(form.value);
        // setTimeout(() => {
        //     this.isLoading = false;
        //     form.reset();
        // }, 2000);
    }

    ngOnDestroy(): void {
        if (this.authStatusSub) {
            this.authStatusSub.unsubscribe();
        }
    }
}