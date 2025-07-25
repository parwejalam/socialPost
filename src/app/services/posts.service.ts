import { inject, Injectable } from "@angular/core";
import { Post } from '../model/post.model';
import { map, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";


@Injectable({ providedIn: 'root' })
export class PostsService {

    constructor(private http: HttpClient, private router: Router) { }
    apiURL = 'http://localhost:3000/api/posts'; // Base URL for the API

    private posts: Post[] = [];
    private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();


    // Method to get posts from the server and update the local posts array
    getPosts(postPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
        let post = this.http.get<{ message: string, posts: Post[], maxPosts: number }>(this.apiURL + queryParams)
            .subscribe(response => {
                console.log('this is testing response', response);
                if (response.posts.length !== 0) {
                    this.posts = response.posts;
                    localStorage.setItem("posts", JSON.stringify(this.posts));
                    this.postsUpdated.next({
                        posts: [...this.posts],
                        postCount: response.maxPosts
                    }); // Notify subscribers with a copy of the updated posts
                } else {
                    console.log("No posts found");
                }
            })
        return post; // Return the observable directly
    }

    // Method to get one post from the server
    getPost(id: string) {
        return this.http.get<{ _id: string, title: string, content: string, imagePath: File | string, creator: string }>(this.apiURL + '/' + id)
    }

    // Method to add a new post to the server and update the local posts array
    addPost(post: Post, image: File) {
        const postData = new FormData();
        postData.append("title", post.title);
        postData.append("content", post.content || '');
        postData.append("image", image as File, post.title); // Ensure post.image is a File type

        this.http.post<{ message: string, post: any }>(this.apiURL, postData)
            .subscribe((response) => {
                const newPost = {
                    id: response.post._doc._id,
                    title: response.post._doc.title,
                    content: response.post._doc.content || '',
                    imagePath: response.post._doc.imagePath ? response.post._doc.imagePath : '',
                    creator: response.post._doc.creator
                };
                this.posts.push(newPost);
                this.postsUpdated.next({
                    posts: [...this.posts],
                    postCount: this.posts.length
                });
                console.log('Post added successfully db res:', newPost);
                this.router.navigate(["/"]);
            });
    }

    //Method to update a post
    updatePost(postId: string, post: Post, image: File | string) {
        let postData!: Post | FormData;
        if (typeof (image) === 'object') {
            postData = new FormData();
            postData.append("id", postId);
            postData.append("title", post.title);
            postData.append("content", post.content || '');
            postData.append("image", image as File, post.title);
        } else {
            postData = {
                id: postId,
                title: post.title,
                content: post.content || '',
                imagePath: image as string,
                creator: post.creator
            }
        }

        this.http.put(this.apiURL + '/' + postId, postData).subscribe((res: any) => {
            this.router.navigate(["/"]);
        });
    }

    // Method to Delete an existing post on the server and in the local posts array
    deletePost(postId: string) {
        return this.http.delete(this.apiURL + '/' + postId);

    }

    // Method to get an observable that emits updates to the posts array
    getPostsUpdatedListener() {
        return this.postsUpdated.asObservable(); // Return an observable to listen for updates
    }

    // // Method to load posts from local storage when the service is initialized
    // loadPosts() {
    //     const storedPosts = localStorage.getItem("posts");
    //     if (storedPosts) {
    //         this.posts.push(JSON.parse(storedPosts));
    //         return this.postsUpdated.next([...this.posts])
    //     }
    // }

}