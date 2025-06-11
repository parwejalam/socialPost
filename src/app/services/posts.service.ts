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

    // Method to get posts from the server and update the local posts array
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

    // Method to add a new post to the server and update the local posts array
    addPost(post: Post) {
        this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', post).subscribe((response) => {
            console.log(response.message);
            post.id = response.post.id; // Assuming the server returns the new post ID in the response
            localStorage.setItem("posts", JSON.stringify([...this.posts, post]));
            this.posts.push(post);
            this.postsUpdated.next([...this.posts]);
        });
    }

    // Method to Delete an existing post on the server and in the local posts array
    deletePost(postId: string) {
        this.http.delete('http://localhost:3000/api/posts/'+ postId).subscribe(() => {
            this.posts = this.posts.filter(post => post.id !== postId); // Remove the deleted post from the local posts array
            localStorage.setItem("posts", JSON.stringify(this.posts)); // Update local storage
            this.postsUpdated.next([...this.posts]); // Notify subscribers with the updated posts
        });
        
    }

    // Method to get an observable that emits updates to the posts array
    getPostsUpdatedListener() {
        return this.postsUpdated.asObservable(); // Return an observable to listen for updates
    }

    // Method to load posts from local storage when the service is initialized
    loadPosts() {
        const storedPosts = localStorage.getItem("posts");
        if (storedPosts) {
            this.posts = JSON.parse(storedPosts);
        }
    }

}