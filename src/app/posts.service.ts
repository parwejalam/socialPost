import { Injectable } from "@angular/core";
import { Post } from "./model/post.model";
import { Subject } from "rxjs";


@Injectable({ providedIn: 'root' })
export class PostsService {

    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    getPosts() {
        return [...this.posts]; // Return a copy of the posts array
    }

    getPostsUpdatedListener() {
        return this.postsUpdated.asObservable(); // Return an observable to listen for updates
    }

    addPost(post: Post) {
        this.posts.push(post);
        localStorage.setItem("posts", JSON.stringify(this.posts));
        this.postsUpdated.next([...this.posts]); // Notify subscribers with a copy of the updated posts
    }

    loadPosts() {
        const storedPosts = localStorage.getItem("posts");
        if (storedPosts) {
            this.posts = JSON.parse(storedPosts);
        }
    }

}