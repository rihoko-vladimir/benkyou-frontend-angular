import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-error',
  templateUrl: 'error.component.html',
  styleUrls: ['error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton]
})
export class ErrorComponent {
  @Input() componentName = '';
  @Output() retry = new EventEmitter();
}
