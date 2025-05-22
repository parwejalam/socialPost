import { Component, Input, viewChild } from "@angular/core";
import { MaterialModule, } from "../../module/material/material.module";
import { MatAccordion } from "@angular/material/expansion";

interface post {
    title: string;
    content?: string;
    imagePath?: string;
}

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

    openAll() {
        this.accordion().openAll();
        this.expandAll = true;
    }
    closeAll() {
        this.accordion().closeAll();
        this.expandAll = false;
    }

    @Input() postList: post[] = [];

}