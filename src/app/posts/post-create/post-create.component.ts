import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";

import { PostsService } from "../posts.service";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  post: Post;
  private mode = 'create';
  private postId: string;

  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.post = {
            id: postData._id,
            empresa: postData.empresa,
            usuario: postData.usuario,
            estado: postData.estado,
            fabricante: postData.fabricante,
            modelo: postData.modelo,
            tipo: postData.tipo,
            serie: postData.serie,
            etiqueta: postData.etiqueta}
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });    
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.postsService.addPost(
        form.value.empresa,
        form.value.usuario,
        form.value.estado,
        form.value.fabricante,
        form.value.modelo,
        form.value.tipo,
        form.value.serie,
        form.value.etiqueta);
    } else {
      this.postsService.updatePost(
        this.postId,
        form.value.empresa,
        form.value.usuario,
        form.value.estado,
        form.value.fabricante,
        form.value.modelo,
        form.value.tipo,
        form.value.serie,
        form.value.etiqueta);
    }
    form.resetForm();
  }
}