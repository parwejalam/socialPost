import { Component, Inject, inject } from "@angular/core";
import { MaterialModule } from "../module/material/material.module";
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from "@angular/material/button";

@Component({
    templateUrl: './error.component.html',
    imports: [MatButtonModule, MatDialogContent, MatDialogActions, MatDialogClose],
    standalone: true,
})

export class ErrorComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) { }
}