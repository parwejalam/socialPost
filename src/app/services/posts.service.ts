import { inject, Injectable } from "@angular/core";
import { Post } from '../model/post.model';
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";


@Injectable({ providedIn: 'root' })
export class PostsService {

    private http = inject(HttpClient);

    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor() { }

    getPosts() {
        // return [...this.posts]; // Return a copy of the posts array
        let post = this.http.get<{ message: string, posts: Post[] }>('http://localhost:3000/api/posts').subscribe((response) => {
            if (response.posts.length !== 0) {
                this.posts = response.posts;
                localStorage.setItem("posts", JSON.stringify(this.posts));
                this.postsUpdated.next([...this.posts]); // Notify subscribers with a copy of the updated posts
            } else {
                console.log("No posts found");
            }
        })
        return post; // Return the observable directly
    }

    addPost(post: Post) {
        this.http.post<{ message: string }>('http://localhost:3000/api/posts', post).subscribe((response) => {
            console.log(response.message);
            localStorage.setItem("posts", JSON.stringify(post));
            this.posts.push(post); // Add the new post to the local posts array
            this.postsUpdated.next([...this.posts]);
        });
    }

    deletePost(postId: string) {
        this.http.delete('http://localhost:3000/api/posts/'+ postId).subscribe(() => {
            this.posts = this.posts.filter(post => post.id !== postId); // Remove the deleted post from the local posts array
            localStorage.setItem("posts", JSON.stringify(this.posts)); // Update local storage
            this.postsUpdated.next([...this.posts]); // Notify subscribers with the updated posts
        });
        
    }

    getPostsUpdatedListener() {
        return this.postsUpdated.asObservable(); // Return an observable to listen for updates
    }


    loadPosts() {
        const storedPosts = localStorage.getItem("posts");
        if (storedPosts) {
            this.posts = JSON.parse(storedPosts);
        }
    }

}