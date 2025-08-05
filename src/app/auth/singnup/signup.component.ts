import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoaderComponent } from "../../loader/loader.component";
import { MaterialModule } from "../../module/material/material.module";
import { NgForm } from "@angular/forms";
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
    standalone: false,
    // imports: [LoaderComponent, MaterialModule],
    templateUrl: "./signup.component.html",
    styleUrls: ["./signup.component.scss"],
})

export class SingupComponent implements OnInit, OnDestroy {
    isLoading = false;
    private authStatusSub!: Subscription;

    constructor(public authService: AuthService) { }

    ngOnInit(): void {
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
            authStatus => {
                this.isLoading = false
            }
        );
    }

    onSignup(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.isLoading = true;
        // Simulate a login request
        this.authService.createUser(form.value);
    }

    ngOnDestroy(): void {
        if (this.authStatusSub) {
            this.authStatusSub.unsubscribe();
        }
    }
}