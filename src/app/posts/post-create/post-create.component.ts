import { Component, EventEmitter, Output } from "@angular/core";
import { MaterialModule } from "../../module/material/material.module";
import { FormsModule, NgForm } from "@angular/forms";
import { PostsService } from "../../posts.service";
import { Post } from "../../model/post.model";

@Component({
    selector: "app-post-create",
    standalone: true,
    imports: [MaterialModule, FormsModule],
    templateUrl: "./post-create.component.html",
    styleUrls: ["./post-create.component.scss"],
})
export class PostCreateComponent {

    constructor(public postService: PostsService) {}
    // @Output() postCreated = new EventEmitter<{
    //     title: string;
    //     content: string;
    //     imagePath: string;
    // }>();
    onAddPost(form: NgForm) {
        const post: Post = {
            title: form.value.title ?? "",
            content: form.value.content ?? "",
            imagePath: form.value.imagePath ?? "",
        };
        // this.postCreated.emit(post);
        this.postService.addPost(post);
        form.resetForm();
    }
}