import { Component, Input, viewChild } from "@angular/core";
import { MaterialModule, } from "../../module/material/material.module";
import { MatAccordion } from "@angular/material/expansion";
import { PostsService } from "../../services/posts.service";
import { Post } from "../../model/post.model";
import { Subscription } from "rxjs";


@Component({
    selector: "app-post-list",
    standalone: true,
    imports: [MaterialModule],
    templateUrl: "./post-list.component.html",
    styleUrls: ["./post-list.component.scss"],
})
export class PostListComponent {
    accordion = viewChild.required(MatAccordion);
    expandAll = false;
    postList: Post[] = [];
    private postsSub!: Subscription;

    constructor(public postService: PostsService) {
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
        this.postService.getPosts();
        this.postsSub = this.postService.getPostsUpdatedListener().subscribe((posts: Post[]) => {
            this.postList = posts;
        });
    }

    ngOnDestroy() {
        this.postsSub.unsubscribe()
    }
}