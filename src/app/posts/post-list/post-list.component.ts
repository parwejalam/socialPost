import { Component, Input, OnInit, viewChild } from "@angular/core";
import { MaterialModule, } from "../../module/material/material.module";
import { MatAccordion } from "@angular/material/expansion";
import { PostsService } from "../../services/posts.service";
import { Post } from "../../model/post.model";
import { Subscription } from "rxjs";
import { ActivatedRoute, Params, RouterModule } from "@angular/router";
import { LoaderComponent } from "../../loader/loader.component";


@Component({
    selector: "app-post-list",
    standalone: true,
    imports: [MaterialModule, RouterModule, LoaderComponent],
    templateUrl: "./post-list.component.html",
    styleUrls: ["./post-list.component.scss"],
})
export class PostListComponent implements OnInit {
    accordion = viewChild.required(MatAccordion);
    expandAll = false;
    postList: Post[] = [];
    private postsSub!: Subscription;
    isLoading = false;

    constructor(public postService: PostsService, public route: ActivatedRoute) {
        this.postService.loadPosts();
    }
    openAll() {
        this.accordion().openAll();
        this.expandAll = true;
    }
    closeAll() {
        this.accordion().closeAll();
        this.expandAll = false;
    }

    ngOnInit() {
        this.isLoading = true;
        this.postService.loadPosts();
        this.postService.getPosts();
        this.postsSub = this.postService.getPostsUpdatedListener().subscribe((posts: Post[]) => {
            this.postList = posts;
        });
        this.isLoading = false;
    }


    deletPost(postId: string) {
        this.postService.deletePost(postId);
    }

    ngOnDestroy() {
        this.postsSub.unsubscribe()
    }
}