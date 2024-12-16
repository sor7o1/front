import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent {
@Input () hide:boolean;
  isLoading = false;

  show() {
    this.isLoading = true;
  }

  hideL() {
    this.isLoading = false;
  }
}
