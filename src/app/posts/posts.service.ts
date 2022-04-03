import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

import { Post } from "./post.model";

@Injectable({providedIn: 'root'})
export class PostsService {
    private posts: Post [] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient) {}

    getPosts() {
        this.http
            .get<{message: string, posts: any}>(
                'http://localhost:3000/api/posts')
            .pipe(map((postData) => {
                return postData.posts.map(post => {
                    return {
                        empresa: post.empresa,
                        usuario: post.usuario,
                        estado: post.estado,
                        fabricante: post.fabricante,
                        modelo: post.modelo,
                        tipo: post.tipo,
                        serie: post.serie,
                        etiqueta: post.etiqueta,
                        id: post._id
                    };
                });
            }))
            .subscribe(transformedPosts => {
                this.posts = transformedPosts;
                this.postsUpdated.next([...this.posts]);
            });
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    getPost(id: string) {
        return this.http.get<{_id: string, empresa: string,
            usuario: string,
            estado: string,
            fabricante: string,
            modelo: string,
            tipo: string,
            serie: string,
            etiqueta: string}>(
            "http://localhost:3000/api/posts/" + id);
    }

    addPost(empresa: string,
        usuario: string,
        estado: string,
        fabricante: string,
        modelo: string,
        tipo: string,
        serie: string,
        etiqueta: string) {
        const post: Post = {id: null,
            empresa: empresa,
            usuario: usuario,
            estado: estado,
            fabricante: fabricante,
            modelo: modelo,
            tipo: tipo,
            serie: serie,
            etiqueta: etiqueta};
        this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
            .subscribe((responseData) => {
                const id = responseData.postId;
                post.id = id;
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
            });
        
    }

    updatePost(id: string, empresa: string,
        usuario: string,
        estado: string,
        fabricante: string,
        modelo: string,
        tipo: string,
        serie: string,
        etiqueta: string) {
        const post: Post = { id: id, empresa: empresa,
            usuario: usuario,
            estado: estado,
            fabricante: fabricante,
            modelo: modelo,
            tipo: tipo,
            serie: serie,
            etiqueta: etiqueta};
        this.http.put("http://localhost:3000/api/posts/" + id, post)
            .subscribe(response => {
                const updatedPosts = [...this.posts];
                const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
                updatedPosts[oldPostIndex] = post;
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts]);
            });
    }

    deletePost(postId: string) {
        this.http.delete("http://localhost:3000/api/posts/" + postId)
            .subscribe(() => {
                const updatedPosts = this.posts.filter(post => post.id !== postId);
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts]);
            });
    }
}