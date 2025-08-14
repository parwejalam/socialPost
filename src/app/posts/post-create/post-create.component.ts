import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { MaterialModule } from "../../module/material/material.module";
import { FormGroup, ReactiveFormsModule, FormControl, Validators } from "@angular/forms";
import { PostsService } from "../../services/posts.service";
import { Post } from "../../model/post.model";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { LoaderComponent } from "../../loader/loader.component";
import { mimeType } from "./mime-type.validator";
import { Subscription } from "rxjs";
import { AuthService } from "../../services/auth.service";

@Component({
    selector: "app-post-create",
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, MaterialModule, LoaderComponent],
    templateUrl: "./post-create.component.html",
    styleUrls: ["./post-create.component.scss"],
})
export class PostCreateComponent implements OnInit, OnDestroy{
    post?: Post;
    private mode = 'create';
    private postId?: string;
    isLoading = false;
    form!: FormGroup;
    imagePreview: string = '';
    private authStatusSub!: Subscription;

    constructor(public postService: PostsService, public route: ActivatedRoute, private router: Router, private authService: AuthService) { }
    ngOnInit() {
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
            authStatus => {
                this.isLoading = false;
            }
        )
        this.form = new FormGroup({
            title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
            content: new FormControl(null, { validators: [Validators.required] }),
            image: new FormControl(null, { asyncValidators: [mimeType] }) // Remove required validator for image
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
            console.log('Form is invalid:', this.form.errors);
            return;
        }
        
        // Check if user is authenticated
        if (!this.authService.getIsAuth()) {
            console.error('User is not authenticated');
            this.router.navigate(['/auth/login']);
            return;
        }

        const post: Post = {
            id: '',
            title: this.form.value.title,
            content: this.form.value.content,
            imagePath: '',
            creator: null as any
        };
        
        this.isLoading = true;
        if (this.mode == 'create') {
            this.postService.addPost(post, this.form.value.image);
        } else if (this.postId) {
            this.postService.updatePost(this.postId, post, this.form.value.image);
        }
        this.form.reset();
    }

    ngOnDestroy(): void {
        if(this.authStatusSub){
            this.authStatusSub.unsubscribe();
        }
    }
}