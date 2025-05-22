import { Component, EventEmitter, Output } from "@angular/core";
import { MaterialModule } from "../../module/material/material.module";

@Component({
    selector: "app-post-create",
    standalone: true,
    imports: [MaterialModule],
    templateUrl: "./post-create.component.html",
    styleUrls: ["./post-create.component.scss"],
})
export class PostCreateComponent {
    enteredTitle = "";
    enteredContent = "";
    enteredImagePath = "";
    @Output() postCreated = new EventEmitter<{
        title: string;
        content: string;
        imagePath: string;
    }>();
    onAddPost() {
        const post = {
            title: this.enteredTitle,
            content: this.enteredContent,
            imagePath: this.enteredImagePath,
        };
        this.postCreated.emit(post);
        this.clearForm();
        alert('Form has been submitted sucessfully!')
    }

    clearForm(){
        this.enteredTitle = '',
        this.enteredContent = '',
        this.enteredImagePath = ''
    }

}