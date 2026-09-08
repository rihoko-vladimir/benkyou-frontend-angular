import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-result-reading',
  templateUrl: 'result-reading.component.html',
  styleUrls: ['result-reading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass]
})
export class ResultReadingComponent {
  @Input() reading = '';
  @Input() type: string = ReadingType.incorrect;
}

export enum ReadingType {
  correct = 'correct',
  required = 'required',
  incorrect = 'incorrect'
}
