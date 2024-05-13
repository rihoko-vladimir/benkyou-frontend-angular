import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'error',
  templateUrl: 'error.component.html',
  styleUrls: ['error.component.scss']
})
export class ErrorComponent {
  @Input() componentName: string = '';
  @Output() retry = new EventEmitter();
}
