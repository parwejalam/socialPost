import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MaterialModule } from "../../module/material/material.module";
import { FormsModule, NgForm } from "@angular/forms";
import { PostsService } from "../../services/posts.service";
import { Post } from "../../model/post.model";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { LoaderComponent } from "../../loader/loader.component";

@Component({
    selector: "app-post-create",
    standalone: true,
    imports: [MaterialModule, FormsModule, MaterialModule, LoaderComponent],
    templateUrl: "./post-create.component.html",
    styleUrls: ["./post-create.component.scss"],
})
export class PostCreateComponent implements OnInit {
    post?: Post;
    private mode = 'create';
    private postId?: string;
    isLoading = false;

    constructor(public postService: PostsService, public route: ActivatedRoute, private router: Router) { }
    ngOnInit() {
        this.route.paramMap.subscribe((param: ParamMap) => {
            if (param.has('postId')) {
                this.mode = 'edit';
                this.postId = param.get('postId')!;
                this.isLoading = true;
                const postData = this.postService.getPost(this.postId);
                this.isLoading = false;
                this.post = {
                    id: postData.id ?? '',
                    title: postData.title ?? '',
                    content: postData.content ?? '',
                    imagePath: postData.imagePath ?? ''
                };
            } else {
                this.mode = 'create';
                this.postId = '';
            }
        });
    }


    onSavePost(form: NgForm) {
        const post: Post = {
            id: '',
            title: form.value.title ?? "",
            content: form.value.content ?? "",
            imagePath: form.value.imagePath ?? "",
        };
        if (this.mode == 'create') {
            this.postService.addPost(post);
        } else if (this.postId) {
            this.isLoading = true;
            this.postService.updatePost(this.postId, post)
            this.isLoading = false;
        }
        form.resetForm();
        this.router.navigate(['/']);
    }
}