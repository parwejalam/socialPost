import { Component } from "@angular/core";
import { LoaderComponent } from "../../loader/loader.component";
import { MaterialModule } from "../../module/material/material.module";
import { PostsService } from '../../services/posts.service';
import { NgForm } from "@angular/forms";

@Component({
    standalone: true,
    imports: [LoaderComponent,MaterialModule],
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})

export class LoginComponent {
    constructor(private postsService: PostsService) { }
    isLoading = false;


    onLogin(form: NgForm) {
        if (form.invalid) {
            return;
        }
        // this.isLoading = true;
        console.log(form.value);
        // Simulate a login request
        // this.postsService.login(form.value).subscribe({,
        // setTimeout(() => {
        //     this.isLoading = false;
            form.reset();
        // }, 2000);
    }
}