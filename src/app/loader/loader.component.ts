import { Component, Input } from "@angular/core";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-loader',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss']
})

export class LoaderComponent {
    @Input() show = false;

    id = [
        'loader-1',
        'loader-2',
        'loader-3',
        'loader-4',
        'loader-5',
    ]
}