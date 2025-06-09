import { inject, Injectable } from "@angular/core";
import { Post } from '../model/post.model';
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import e from "cors";


@Injectable({ providedIn: 'root' })
export class PostsService {

    private http = inject(HttpClient);

    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor() { }

    getPosts() {
        // return [...this.posts]; // Return a copy of the posts array
        let post = this.http.get<{ message: string, posts: Post[] }>('http://localhost:3000/api/get').subscribe((response) => {
            if(response.posts.length !== 0) {
            this.posts = response.posts;
            localStorage.setItem("posts", JSON.stringify(this.posts));
            this.postsUpdated.next([...this.posts]); // Notify subscribers with a copy of the updated posts
            }else {
                console.log("No posts found");
            }
        })
        return post; // Return the observable directly
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