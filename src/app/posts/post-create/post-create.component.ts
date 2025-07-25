import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MaterialModule } from "../../module/material/material.module";
import { FormGroup, ReactiveFormsModule, FormControl, Validators } from "@angular/forms";
import { PostsService } from "../../services/posts.service";
import { Post } from "../../model/post.model";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { LoaderComponent } from "../../loader/loader.component";
import { mimeType } from "./mime-type.validator";

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
    imagePreview: string = '';

    constructor(public postService: PostsService, public route: ActivatedRoute, private router: Router) { }
    ngOnInit() {
        this.form = new FormGroup({
            title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
            content: new FormControl(null, { validators: [Validators.required] }),
            image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
        });
        this.route.paramMap.subscribe((param: ParamMap) => {
            if (param.has('postId')) {
                this.mode = 'edit';
                this.postId = param.get('postId')!;
                // this.isLoading = true;
                this.postService.getPost(this.postId).subscribe((postData) => {
                    this.post = {
                        id: postData._id,
                        title: postData.title,
                        content: postData.content,
                        imagePath: postData.imagePath,
                        creator: postData.creator
                    };
                    this.form.patchValue({
                        title: this.post.title,
                        content: this.post.content,
                        image: this.post.imagePath
                    });
                    this.imagePreview = this.post.imagePath as string;
                });
            } else {
                this.mode = 'create';
                this.postId = '';
            }
        });
    }

    onPickedImage(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        this.form.patchValue({ image: file });
        this.form.get('image')?.updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result as string;
        }
        reader.readAsDataURL(file!);
    }

    onSavePost() {
        if (this.form.invalid) {
            return;
        }
        const post: Post = {
            id: '',
            title: this.form.value.title,
            content: this.form.value.content,
            imagePath: this.form.value.imagePath,
            creator: null as any // Creator will be set by the service
        };
        this.isLoading = true;
        if (this.mode == 'create') {
            this.postService.addPost(post, this.form.value.image);
            this.isLoading = false;
        } else if (this.postId) {
            this.isLoading = true;
            this.postService.updatePost(this.postId, post, this.form.value.image);
            this.isLoading = false;
        }
        this.form.reset()
        this.router.navigate(['/']);
    }
}