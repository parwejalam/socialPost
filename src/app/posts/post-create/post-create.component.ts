import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MaterialModule } from "../../module/material/material.module";
import { FormGroup, ReactiveFormsModule, FormControl, Validators } from "@angular/forms";
import { PostsService } from "../../services/posts.service";
import { Post } from "../../model/post.model";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { LoaderComponent } from "../../loader/loader.component";

@Component({
    selector: "app-post-create",
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, MaterialModule, LoaderComponent],
    templateUrl: "./post-create.component.html",
    styleUrls: ["./post-create.component.scss"],
})
export class PostCreateComponent implements OnInit {
    post?: Post;
    private mode = 'create';
    private postId?: string;
    isLoading = false;
    form!: FormGroup;

    constructor(public postService: PostsService, public route: ActivatedRoute, private router: Router) { }
    ngOnInit() {
        this.form = new FormGroup({
            title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
            content: new FormControl(null, { validators: [Validators.required] }),
            imagePath: new FormControl(null,)
        });
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
                this.form.setValue({
                    title: this.post.title,
                    content: this.post.content,
                    imagePath: this.post.imagePath
                });
            } else {
                this.mode = 'create';
                this.postId = '';
            }
        });
    }


    onSavePost() {
        const post: Post = {
            id: '',
            title: this.form.value.title,
            content: this.form.value.content,
            imagePath: this.form.value.imagePath
        };
        if (this.mode == 'create') {
            this.postService.addPost(post);
        } else if (this.postId) {
            this.isLoading = true;
            this.postService.updatePost(this.postId, post)
            this.isLoading = false;
        }
        this.form.reset()
        this.router.navigate(['/']);
    }
}