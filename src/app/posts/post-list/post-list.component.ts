import { Component, Input, OnInit, viewChild } from "@angular/core";
import { MaterialModule, } from "../../module/material/material.module";
import { MatAccordion } from "@angular/material/expansion";
import { PostsService } from "../../services/posts.service";
import { Post } from "../../model/post.model";
import { Subscription } from "rxjs";
import { ActivatedRoute, Params, RouterModule } from "@angular/router";
import { LoaderComponent } from "../../loader/loader.component";
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';


@Component({
    selector: "app-post-list",
    standalone: true,
    imports: [MaterialModule, RouterModule, LoaderComponent, MatPaginatorModule],
    templateUrl: "./post-list.component.html",
    styleUrls: ["./post-list.component.scss"],
})
export class PostListComponent implements OnInit {
    accordion = viewChild.required(MatAccordion);
    expandAll = false;
    postList: Post[] = [];
    private postsSub!: Subscription;
    isLoading = false;
    totalPost = 0;
    postPerPage = 5;
    currentPage = 1;
    pageSizeOptions: number[] = [2, 3, 5, 10, 25, 100];

    constructor(public postService: PostsService, public route: ActivatedRoute) {
        this.isLoading = true;
        // this.postService.loadPosts();
        this.isLoading = false;
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
        // this.postService.loadPosts();
        this.postService.getPosts(this.postPerPage, this.currentPage);
        this.isLoading = true;
        this.postsSub = this.postService.getPostsUpdatedListener().subscribe((postData: { posts: Post[], postCount: number }) => {
            this.totalPost = postData.postCount;
            this.postList = postData.posts;
        });
        this.isLoading = false;
    }

    onChangePage(pageData: PageEvent) {
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.postPerPage = pageData.pageSize;
        this.postService.getPosts(this.postPerPage, this.currentPage);
        this.isLoading = false;
    }


    deletPost(postId: string) {
        this.postService.deletePost(postId).subscribe(() => {
            this.isLoading = true;
            this.postService.getPosts(this.postPerPage, this.currentPage);
            this.isLoading = false;

        })
    };

    ngOnDestroy() {
        this.postsSub.unsubscribe()
    }
}