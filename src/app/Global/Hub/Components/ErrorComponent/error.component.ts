import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'error',
  templateUrl: 'error.component.html',
  styleUrls: ['error.component.scss'],
  standalone: true,
  imports: [MatButton]
})
export class ErrorComponent {
  @Input() componentName: string = '';
  @Output() retry = new EventEmitter();
}
